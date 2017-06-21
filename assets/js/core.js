/**
 * Created by cursist on 29/05/2017.
 */
function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function in_array(needle, haystack) {
	let found = false;

	for(let i=0; i < haystack.length; i++) {
		if (haystack[i] == needle)
			found = true;
	}

	return found;
}

function get_index(needle, haystack) {
	for(let i=0; i < haystack.length; i++) {
		if (haystack[i] == needle)
			return i;
	}
}

let Core = {
	init: function() {
		Core.User.init();
		this._setWelcomeMessage();
		this.Favorites.init();
	},
    logoutbutton: function () {
        eUitlogButton = document.getElementById('logout');
        console.log("Uitlog event listener added");

        eUitlogButton.addEventListener('click', function (e) {
            if (confirm("Bent u zeker dat u wilt uitloggen?")) {
                //e.preventDefault();
                localStorage.removeItem('huidigeKlant');
                open('index.html', '_self');
            }
        });
    },
    berichtenTeller: function(){
        var sDeBerichten = localStorage.getItem("deBerichten");

			if (sDeBerichten == null || sDeBerichten == '')
				return;

        if(sDeBerichten.indexOf("To:"+Core.User.getID()) == -1)
        {
            return "Geen";
        }else{
            var sStartPos = sDeBerichten.indexOf("To:"+Core.User.getID()) ;
            var i = sStartPos;
            var berichtteller = 0;
            while(i >0){
                var sEindeBericht = sStartPos+sDeBerichten.substring(sStartPos, sDeBerichten.length).indexOf("\@\@");
                var sBericht = sDeBerichten.substring(sStartPos+32,sEindeBericht);
                //console.log(afzenderId);
                var sVolgendeStartString = sDeBerichten.substring(sEindeBericht+2 ,sDeBerichten.length );
                // de plus 2 in vorige en volgende is omdat sEindeBericht niet de 2 @s heeft
                sStartPos = sEindeBericht+2 + sVolgendeStartString.indexOf("To:"+Core.User.getID()) ;
                i = sVolgendeStartString.indexOf("\@\@");
                if(i != -1)
                {
                    berichtteller= berichtteller+1;
                }

            }
            console.log(berichtteller);
            return berichtteller;
        }
    },

	_setWelcomeMessage: function() {
		let eMessage = document.getElementById('currentLogin');

		eMessage.innerHTML = Core.User.getName();
	},

	User: {
		id: null,
		data: null,

		init: function(user_id) {
			// Check user login
			if (!this.isLoggedIn()) {
				if (user_id == '' || user_id == undefined || user_id == null)
					window.location.href = '/index.html';
				else {
					console.log('Assigning new user');
					this.id = user_id;
					this.data = this.getData();
				}
			}
			else {
				if (user_id == '' || user_id == undefined || user_id == null) {
					this.id = this.getID();
					this.data = this.getData();
				}
				else {
					this.id = user_id;
					this.data = this.getData();

					return this;
				}
			}
		},

		getID: function() {
			if (this.isLoggedIn())
				return localStorage.huidigeKlant;
			else
				return false;
		},

		getName: function() {
			return this.data['voornaam'] + ' ' + this.data['familienaam'];
		},

		getSurname: function() {
			return this.data['voornaam'];
		},

		getLastname: function() {
			return this.data['familienaam'];
		},

		getLovecoins: function() {
			return this.data['lovecoins'];
		},

		getNickname: function() {
			return this.data['nickname'];
		},

		getData: function() {
			if (this.id == null)
				this.id = this.getID();

			return scrumlib.getDatasetById(this.id)[0];
		},

		getFullDataSet: function() {
			return this.data;
		},

		get: function(property) {
			return this.data[property];
		},

		isLoggedIn: function() {
			let user_id, user_data;

			// Check if an ID is defined in local storige
			if (localStorage.huidigeKlant != undefined) {
				user_id = localStorage.huidigeKlant;

				// Get user's data
				data = scrumlib.getDatasetById(user_id);

				if (data instanceof Object) {
					return true;
				}
				else {
					return false;
				}
			}
			else {
				return false;
			}
		},

		remove: function() {
			let userID = this.getID();

			console.log('Removing user with ID: ' + userID);

			let test = scrumlib.deleteDataset(userID);

			if (test === true) {
				console.log('Remove succesful');
				scrumlib.save();

				// Logging out
				localStorage.removeItem('huidigeKlant');
				localStorage.removeItem('favorites');

				location.href = '/index.html';
			}
			else {
				console.log('Verwijderen mislukt!');
			}
		},

		logout: function() {
			localStorage.removeItem('huidigeKlant');
			window.location.href = '/index.html';
		}
	},

	Favorites: {
		data: null,
		fullData: null,

		init: function() {
			// Get data
			this.data = this._getData();
		},

		getFavorites: function() {
			return this.data;
		},

		remove: function(id) {
			let data = this.data
				,	new_data = [];

			if (in_array(id, data)) {
				let index = get_index(id, data);

				console.log('Favorite user found');
				console.log('Removing user @index[' + index + ']');

				for(let i=0; i < data.length; i++) {
					if (i != index) {
						new_data.push(data[i]);
					}
				}

				console.log(new_data.toString());
				this.data = new_data;
				this.save();
			}
		},

		add: function(id) {
			let data = this.data;

			if (data == null  || data == undefined || data.length == 0)
				data = [];
			else if (!data instanceof Array)
				data = data.split(',');	// Convert to array

			// Add new one
			data.push(id);

			// Set to storage
			this.data = data;

			// Save
			this.save();
		},

		save: function() {
			let data = this.fullData;

			// First time fix
			if (data == null)
				data = {};

			console.log('Foutje, wat is data? -> ' +data);

			data[Core.User.getID()] = this.data;

			console.log(this.data);
			console.log(data);

			localStorage.setItem('favorites',JSON.stringify(data));
		},

		_getData: function() {
			let favorites = localStorage.getItem('favorites')
				,	user_id = Core.User.getID();

			try {
				favorites = JSON.parse(favorites);

				if (favorites.hasOwnProperty(user_id)) {
					console.log('Favorites from ID ' + user_id +' found');
					console.log(favorites[user_id]);

					// Set full data up front
					this.fullData = favorites;

					favorites = favorites[user_id];
				}
				else {
					// Set full data up front
					this.fullData = favorites;

					console.log('Favorites from ID ' + user_id +' NOT FOUND!');
					favorites = [];
				}
			}
			catch(e) {
				favorites = null;
				console.log('fail');
			}

			if (favorites == '' || favorites == null || favorites == undefined)
				favorites = [];

			return favorites
		}
	},

	HomePage: {
		init: function() {
			this._renderWelcomeBar();
			this._renderNewestMembers();
		},

		_renderWelcomeBar: function() {
			let eWelcomebar = document.getElementById('welcome-bar')
				,	html = eWelcomebar.innerHTML
				,	date = new Date()
				,	messages = Core.berichtenTeller();

			if (messages > 0) {
				messages = '<strong>(' + messages + ')</strong> nieuwe';
			}
			else {
				messages = 'geen nieuwe';
			}

			// Format messages

			html = html.replace('_NAME_', Core.User.getName());
			html = html.replace('_COINS_', Core.User.getLovecoins());
			html = html.replace('_BERICHTEN_', messages);
			html = html.replace('_DATE_', date.getDate()+ '/'+(date.getMonth()+1)+'/'+date.getFullYear()+' ' + date.getHours() +':'+date.getMinutes());

			eWelcomebar.innerHTML = html;
		},

		_renderNewestMembers: function() {
			let profiles = scrumlib.getAllDatasets()
				,	eContainer = document.getElementById('newest_members')
				,	count = 0;

			for(let i=profiles.length-1; i > 0; i--) {
				if (count++ >= 6)
					break;

				let profile = profiles[i]
					, profile_container = document.createElement('div');

				// Jezelf overslaan
				if (profile._id == Core.User.getID())
					continue;

				// Properties
				profile_container.classList.add('profile-suggestion');
				profile_container.setAttribute('id', 'profile-' + profile._id);

				let html = '';

				html =	'<a href="/profiel.html?id=' + profile._id + '">';
				html += '<div class="profile-name">'+ profile.nickname.substr(0,10) + '</div>';
				html += '<div class="profile-img"><img src="assets/img/' + Profile.getAvatarUrl(profile.foto, profile.sexe) + '" /></div>';
				html += '</a>';

				profile_container.innerHTML = html;

				// Append container to eSuggestions
				eContainer.appendChild(profile_container);
			}
		}
	},

	LoveCoins: {
		coins: null,

		init: function() {
			this._getLovecoins();
		},

		add: function(amount) {
			let profile = Core.User.getFullDataSet();

			amount = (amount == undefined || amount == '' || amount == null) ? 1 : amount;

			profile.lovecoins = parseInt(profile.lovecoins) +  amount;

			console.log('Added ' + amount + ' coin(s)');

			scrumlib.updateDataset(profile._id, profile);
			scrumlib.save();

			this._getLovecoins();
		},

		remove: function(amount) {
			let profile = Core.User.getFullDataSet();

			amount = (amount == undefined || amount == '' || amount == null) ? 1 : amount;

			profile.lovecoins = parseInt(profile.lovecoins) -  amount;

			// If less then zero, set to zero
			if (parseInt(profile.lovecoins) < 0)
				profile.lovecoins = 0;

			console.log('Removed ' + amount + ' coin(s)');

			scrumlib.updateDataset(profile._id, profile);
			scrumlib.save();

			this._getLovecoins();
		},

		hasEnough: function(amount) {
			if (this.coins === null)
				this.init();

			return (parseInt(this.coins) >= amount);
		},

		getAll: function() {
			if (this.coins === null)
				this.init();

			return this.coins;
		},

		_getLovecoins: function() {
			this.coins = Core.User.getLovecoins();

			// Als er geen lovcoins zijn
			if (this.coins == undefined)
				this.coins = 0;
		}
	},

	Messages: {
		count: 1,

		show: function(message, type) {
			// Remove previous message
			//this._removePreviousMsg();

			let eContainer = this._createMessageContainer(type);

			eContainer.innerHTML = eContainer.innerHTML +  message;
			eContainer.style.zIndex = 100000 + this.count;

			// Add after <body> _HERE_
			let doc_parent = document.body.firstChild;
			doc_parent.parentNode.insertBefore(eContainer, doc_parent);

			$(eContainer).slideDown('slow');

			setTimeout(function() {
				$(eContainer).slideUp('fast', function() {
					this.remove();
				});
			}, 5000);

			this.count++;
		},

		_createMessageContainer: function(type) {
			let eContainer = document.createElement('div')
				,	eIcon = document.createElement('span')
				,	type_icon = this._getIconType(type);

			eContainer.classList.add('notification-top');
			eContainer.classList.add('notification-'+type);

			eIcon.classList.add('notification-icon');
			eIcon.innerHTML = '<i class="glyphicon glyphicon-' + type_icon + '"><i>';

			eContainer.appendChild(eIcon);

			eContainer.style.display = 'none';

			return eContainer;
		},

		_removePreviousMsg: function() {
			let eMsg = document.getElementsByClassName('notification-top')[0];

			if (eMsg instanceof HTMLElement) {
				$(eMsg).fadeOut(300);
			}
		},

		_getIconType: function(type) {

			switch(type) {
				case 'success': return 'check'; break;
				case 'error': return 'remove'; break;
				case 'info': return 'info-sign'; break;
			}
		}
	},

	addMissingPropertiesToAllProfiles: function() {
		let profiles = scrumlib.getAllDatasets();	// Haal alle profielen op

		// Check localStorage whether this has been run or not
		let check = localStorage.getItem('updatedProfilesWithRandoms');

		// Stop if this function has been executed before
		if (check == true || check == 'true')
			return;

		let regios = [
			'West-Vlaanderen',
			'Oost-Vlaanderen',
			'Vlaams-Brabant',
			'Limburg',
			'Wallonie',
			'Elders'
		];

		let hobbys = [
			'Computeren',
			'Schilderen',
			'Knutselen',
			'Tekenen',
			'Designen',
			'Puzzelen',
			'Koffiekletsen',
			'Programmeren',
			'Carten',
			'Paardrijden',
			'Vissen',
			'Zwemmen',
			'Roken',
			'Zingen',
			'Dansen',
			'Films kijken',
			'Series kijken',
			'Acteren',
			'Toneelspelen',
			'Opera',
			'Cruwen'
		];

		console.log('--------------- MISSING PROPERTIES TO ALL PROFILES ---------------');
		console.log('STARTED: ' + profiles.length + ' profiles found');

		// Door ieder profiel loopen
		// Ieder profiel met willekeurige data volproppen
		// Profiel updaten
		for(let i=0; i < profiles.length; i++) {
			let profile = profiles[i];

			console.log('EDITING PROFILE [ ' + profile['nickname'] + ' ]');

			// Random regio
			let r_regio = Math.round(Math.random() * (regios.length-1));
			profiles[i].regio = regios[r_regio];

			console.log('Setting \'regio\' to ' + regios[r_regio]);

			// Random hobby
			let vrijetijd = [];

			for (let j=0; j < 3; j++) {
				let r_hobby = Math.round(Math.random() * (hobbys.length-1));

				vrijetijd.push(hobbys[r_hobby]);
			}

			profiles[i].vrijetijd = vrijetijd.join(', ');

			console.log('Setting \'vrijetijd\' to ' + vrijetijd.join(', '));

			// Lovecoins
			profiles[i].lovecoins = 3;

			// Update profile
			scrumlib.updateDataset(profile._id, profile);
		}

		console.log('--------------- MISSING PROPERTIES TO ALL PROFILES [ENDED] ---------------');

		// Save scrumlib
		scrumlib.save();

		// Update localStorage
		localStorage.setItem('updatedProfilesWithRandoms', true);
	}
};