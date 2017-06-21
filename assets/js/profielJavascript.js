/**
 * Created by cursist on 29/05/2017.
 */

var Profile = {

	isOwner: false,	// If isOwner = true dan is de bezoeker, de eigenaar van het profiel

	init: function() {
		console.log(scrumlib.getAllDatasets());

		let ID = this._getID();

		// If an Invalid ID was given
		// Show an error message on the page
		// Stop script
		if (!this._isValidID(ID)) {
			let content1 = document.getElementById('profile_valid')
				,	content2 = document.getElementById('profile_invalid');

			content1.classList.add('hide');
			content2.classList.remove('hide');

			return false;
		}
		// Else continue

		// Initialize User class with the given ID
		this.User.init(ID);

		// Check for isOwner
		if(this._getID() == Core.User.getID())
			this.isOwner = true;

		// If user class is ready continue
		if (this.User.isReady()) {
			this._renderContent();
		}

		// Initialise dating.. :)
		this.Arrange.init();
	},
    _messageWindowJs: function(idOntvanger){
        var eConfirmButton = document.getElementById('confirmButton');
        console.log("Messagewindow Javascript geladen");
        function berichtStringMaken(){
            var sIdtext = Core.User.getID();
            var sIdDoel = Profile.User.id;
            var sText = document.getElementById('berichtVeld').value;
            var totaleText = "From:" + sIdtext+ "To:" + sIdDoel + "Text:" + sText+"\@\@";
            return totaleText
        }
        eConfirmButton.addEventListener('click', function(){
            if(document.getElementById('berichtVeld').value == "")
            {
                alert('Het veld mag niet leeg zijn');
            }
            else{


                if(localStorage.deBerichten == null)
                {
                    console.log(bestaandeText)
                    var nieuweTotaleText = berichtStringMaken();
                    localStorage.setItem("deBerichten", nieuweTotaleText);
                }
                else{
                    var bestaandeText = localStorage.getItem("deBerichten");
                    console.log(bestaandeText)
                    var nieuweTotaleText = bestaandeText+berichtStringMaken();
                    localStorage.setItem("deBerichten", nieuweTotaleText);
                    $.colorbox.close();

										Core.Messages.show('Uw bericht is succesvol verstuurd!', 'info');
                }
            }
        });
    },

	_isValidID: function(id) {
		return (id != null && id != undefined && id.length == 24);
	},

	/**
	 * Renders the profile's content
	 * Extracts data from the User.data property
	 * @private
	 */
	_renderContent: function() {
		let user_data = this.User.getAllData();

		console.log('showing data');
		console.log(Profile.User.data);

		// Render Image
		this._renderAvatarImage(user_data['foto']);

		// Render properties (naam, voornaam, huidskleur, ...)
		this._renderProperties(user_data);

		// Change document title
		this._renderDocumentTitle(user_data['voornaam'] + ' '+ user_data['familienaam']);

		// Append profile's name to welcome message
		this._renderProfileWelcome(user_data['nickname']);

		// Add Zodiac Sign
		this._renderZodiacSign();

		// Add suggestions
		this._renderSuggestions();

		// Remove private properties If not the owner
		if (!this.isOwner) {
			this._removePrivateProperties();
			this._showAddToFavoriteButton();
			this._showExpandProfileButton();
			this._showDateButton();
		}
		else if(this.isOwner) {
			this._showFavorites();
		}

	},

	/**
	 * Renders the profile img (avatar)
	 *
	 * @param url
	 * @private
	 */
	_renderAvatarImage: function(url) {
		let img = document.getElementById('profile_img');

		if (url === null || url == '') {
			let gender = Profile.User.get('sexe');

			switch(gender) {
				case 'v':
					url = 'woman_13.png';
					break;

				case 'm':
					url = 'man_11.png';
					break;
			}
		}

		img.src = 'assets/img/' + url;
	},

	getAvatarUrl: function(url, gender) {
		if (url === null || url == '') {
			if (gender == '' || gender === null ||gender == undefined)
				gender = Profile.User.get('sexe');

			switch(gender) {
				case 'v':
					url = 'woman_13.png';
					break;

				case 'm':
					url = 'man_11.png';
					break;
			}
		}

		console.log('test: ' + url);

		return url;
	},

	/**
	 * Loops trough all properties from .data
	 * If there's an element with same id as property name, append the value of that property to it
	 *
	 * @param data
	 * @private
	 */
	_renderProperties: function(data) {
		for (let i in data) {
			let field = document.getElementById(i);

			// Check if our field was found
			if (field instanceof HTMLElement)  {
				let value = data[i];

				// Exceptional Formating
				// Sex
				if (i == 'sexe')
					value = this._formatSex(value);
				else if (i == 'geboortedatum')
					value = this._formatBirthDate(value);

				field.innerHTML = value;
			}
		}
	},

	_renderDocumentTitle: function(title) {
		let eTitle = document.getElementsByTagName('title')[0];

		eTitle.innerHTML = title + ' - Astromatch';
	},

	_renderProfileWelcome: function(name) {
		let eSpan = document.getElementById('profile_name');

		if (!this.isOwner) {
			eSpan.innerHTML = name;
		}
		else {
			eSpan = eSpan.parentNode;

			eSpan.innerHTML = 'Welkom op je profiel!';
		}
	},

	_renderZodiacSign: function() {
		let eZodiacSign = document.getElementById('sterrenbeeld');

		eZodiacSign.innerHTML = this.User.getSterrenbeeld();
	},
	
	shuffle: function(arrToShuffle) {
		let j, x, i;
		for (i = arrToShuffle.length; i; i--) {
			j = Math.floor(Math.random() * i);
			x = arrToShuffle[i - 1];
			arrToShuffle[i - 1] = arrToShuffle[j];
			arrToShuffle[j] = x;
		}
	},

	_renderSuggestions: function() {
		let profiles = this._getProfileByPreferences()
			,	eSuggestions = document.getElementById('suggestions');

		console.log(profiles.length + ' gevonden suggesties');

		this.shuffle(profiles);

		console.log(profiles.length + ' profielen geshuffled');

		for(let i in profiles) {
			if (i > 11)
				break;

			let profile = profiles[i]
				,	profile_container = document.createElement('div');

			// Jezelf overslaan
			if (profile._id == Core.User.getID())
				continue;

			// Properties
			profile_container.classList.add('profile-suggestion');
			profile_container.setAttribute('id', 'profile-' + profile._id);

			let html = '';

			html =	'<a href="/profiel.html?id=' + profile._id + '">';
			html += '<div class="profile-name">'+ profile.nickname.substr(0,10) + '</div>';
			html += '<div class="profile-img"><img src="assets/img/' + this.getAvatarUrl(profile.foto, profile.sexe) + '" /></div>';
			html += '</a>';

			profile_container.innerHTML = html;

			// Append container to eSuggestions
			eSuggestions.appendChild(profile_container);
		}

		if (profiles.length == 0 || (profiles.length == 1 && profiles[0]._id == Core.User.getID())) {
			eSuggestions.innerHTML = 'Er zijn geen profielen met uw voorkeuren gevonden';
		}
		else {
			console.log(profiles.length);
		}
	},

	_getProfileByPreferences: function() {
		let preferences = Core.User.get('voorkeur')
			,	profiles = scrumlib.getAllDatasets()
			, profiles_filtered = [];

		if (preferences == undefined)
			preferences = {};

		if (!preferences.hasOwnProperty('leeftijd')) {
			preferences.leeftijd = [18, 99];
		}

		if (!preferences.hasOwnProperty('regio')) {
			preferences.regio = ['West-Vlaanderen', 'Oost-Vlaanderen', 'Vlaams-Brabant', 'Elders'];
		}

		if (!preferences.hasOwnProperty('sexe')) {
			preferences.sexe = ['v', 'm'];
		}

		// Loop door alle profielen
		// Filter alles er uit dat niet met de voorkeuren overeenkomt
		for(let i=0; i < profiles.length; i++) {
			let profile = profiles[i];

			// Leeftijd berekenen
			let leeftijd = new Date(profile.geboortedatum)
				,	huidigJaar = new Date().getFullYear();

			leeftijd = huidigJaar - leeftijd.getFullYear();
			profile.leeftijd = leeftijd;


			// Leeftijd voorkeuren
			if (profile.leeftijd >= preferences.leeftijd[0] && profile.leeftijd <= preferences.leeftijd[1]){
				this._pushInFiltererdProfiles(profiles_filtered, profile);
			}

			// Regio voorkeuren
			for(let j=0; j < preferences.regio.length; j++) {
				//console.log('Checking profile for region ' + preferences.regio[j]);
				if (profile.regio == preferences.regio[j]) {
					this._pushInFiltererdProfiles(profiles_filtered, profile);
				}
			}

			// Geslacht voorkeuren
			for(let j=0; j < preferences.sexe.length; j++) {
				if (profile.sexe == preferences.sexe[j]) {
					this._pushInFiltererdProfiles(profiles_filtered, profile);
				}
			}

			// Alle andere geslachten eruithalen
			if(preferences.sexe.length == 1) {
				for (let j=0; j < profiles_filtered.length; j++) {
					if (profiles_filtered[j].sexe != preferences.sexe[0]) {
						profiles_filtered.splice(j, 1);
					}
				}
			}

			// Alle verkeerde regio's eruithalen
			for(let j=0; j < profiles_filtered.length; j++) {
				if (!in_array(profiles_filtered[j].regio, preferences.regio)) {
					profiles_filtered.splice(j, 1);
				}
			}

			// Alle verkeerde leeftijden eruithalen
			for (let j=0; j < profiles_filtered.length; j++) {
				if (!(profiles_filtered[j].leeftijd >= preferences.leeftijd[0] && profiles_filtered[j].leeftijd <= preferences.leeftijd[1])) {
					profiles_filtered.splice(j, 1);
				}
			}
		}

		return profiles_filtered;
	},

	_pushInFiltererdProfiles: function(profiles_filtered, profile) {
		if (!in_array(profile, profiles_filtered)) {
			profiles_filtered.push(profile);
		}
	},

	_removePrivateProperties: function() {
		// Array met de te verwijderen eigenschappen
		let properties = [
			document.getElementById('email'),
			document.getElementById('voornaam'),
			document.getElementById('familienaam'),
			document.getElementById('geboortedatum')
		];

		for(let i in properties)
			//properties[i].parentNode.parentNode.remove();
			properties[i].parentNode.parentNode.classList.add('hide'); // Use .hide because we might show them again later on
	},

	_showAddToFavoriteButton: function() {
		let saves = Core.Favorites.getFavorites()
			,	in_list = false
			,	eFavoriet = document.getElementById('btn_favorite');

		//console.log(saves);/

		// Als het profiel nog niet in de favorieten staat
		// Toon de knop
		// Add een eventlistner aan de knop
		if (!in_array(this.User.id, saves))  {
			eFavoriet.classList.remove('hide');

			eFavoriet.addEventListener('click', function(e) {
				e.preventDefault();

				let userID = Profile.User.id
					,	eMessage = document.getElementById('favorite_msg');


				// Voeg nieuwe favoriet toe
				Core.Favorites.add(userID);

				console.log('Added ID( ' + userID + ' ) to favorites');

				// Favorieten knop wissen
				$(this).fadeOut('fast');

				// Notificatie tonen
				let message = 'Je hebt _PROFILENAME_ toegevoegd aan je favorietenlijstje!';

				message = message.replace('_PROFILENAME_', Profile.User.get('nickname'));

				Core.Messages.show(message, 'info');

				//$(eMessage).slideDown('slow');
				//
				//setTimeout(function() {
				//	$(eMessage).slideUp('slow');
				//}, 2000);
			});
		}
	},

	_showFavorites: function() {
		let favorites = Core.Favorites.getFavorites();
		let eContainer = document.getElementById('favorites');

		this.shuffle(favorites);

		// Loop through favorites
		for(let i=0; i < favorites.length; i++) {
			let eUser = document.createElement('div')
				,	profile = scrumlib.getDatasetById(favorites[i])[0];

			eUser.classList.add('profile-suggestion');
			eUser.setAttribute('id', 'profile-f-' + profile._id);

			let html = '';

			html =	'<a href="/profiel.html?id=' + profile._id + '">';
				html += '<div class="profile-name">'+ profile.nickname.substr(0,10) + '</div>';
				html += '<div class="profile-img"><img src="assets/img/' + this.getAvatarUrl(profile.foto, profile.sexe) + '" /></div>';
				html += '<div class="profile-actions">';
					html += '<a href="#" data-id="' + profile._id + '" class="remove-favorite" title="Verwijder ' + profile.nickname + ' van je favorieten"><i class="glyphicon glyphicon-remove"></i></a>';
				html += '</div>';
			html += '</a>';

			eUser.innerHTML = html;

			eContainer.appendChild(eUser);
		}

		let clear = document.createElement('div');
		clear.classList.add('clear');
		eContainer.appendChild(clear);

		if (favorites.length > 0)
			eContainer.classList.remove('hide');

		this._setDeleteFavoriteEventListeners();
	},

	_setDeleteFavoriteEventListeners: function() {
		let eLinks = document.querySelectorAll('.remove-favorite');

		// Loop door alle links
		// Stel een event listener op
		for(let i=0; i < eLinks.length; i++) {
			let eLink = eLinks[i];

			eLink.addEventListener('click', function(e) {
				e.preventDefault();

				let profileID = this.getAttribute('data-id')
					,	nickname = ''
					,	check = true;

				Core.User.init(profileID);
				nickname = Core.User.getNickname();

				// Kleine controle
				check = confirm('Weet je zeker dat je ' + nickname +' van je favorieten wilt verwijderen?');

				if (check == false)
					return;

				console.log('Removing favorite: ' + profileID);

				Core.Favorites.remove(profileID);

				$(this.parentNode.parentNode).fadeOut('slow', function() {
					this.remove();
				})
			});
		}
	},

	expanded: false,
	_showExpandProfileButton: function() {
		let eBtn = document.getElementById('btn_exp-profile');

		// Show the button
		eBtn.classList.remove('hide');

		// Show all hidden properties on click
		eBtn.addEventListener('click', function(e) {
			e.preventDefault();

			// If already expanded, stop another request
			if (this.expanded == true)
				return;

			let check =  confirm('Een uitgebreid profiel kost 1 lovecoin, ben je zeker dat je het uitgebreid profiel wilt inkijken?');

			if (check == false)
				return false;

			let properties = document.querySelectorAll('table td span');

			// Enkel als er genoeg lovecoins zijn
			if (!Core.LoveCoins.hasEnough(1)) {
				Core.Messages.show('Je hebt niet genoeg lovecoins om het uitgebreide profiel op te vragen. <a href="/buylovecoins.html">Koop meer lovecoins</a>.', 'error');
				return false;
			}

			for(let i=0; i < properties.length; i++) {
				let td = properties[i].parentNode.parentNode;

				//console.log(td);
				// show propertie
				//td.setAttribute('style', 'display: none;');
				td.classList.remove('hide');

				//$(td).slideDown('slow');
			}

			// 1 lovecoin aftrekken
			Core.LoveCoins.remove(1);

			// Button herstylen
			this.setAttribute('disabled', 'disabled');

			// Toon bericht
			Core.Messages.show('Het uitgebreid profiel wordt nu weergegeven. Je hebt nu nog <strong>' + Core.User.getLovecoins() + ' lovecoin(s)</strong> over', 'info');

			this.expanded = true;
		});
	},

	_showDateButton: function() {
		let eBtn = document.getElementById('btn_date');

		eBtn.classList.remove('hide');
	},

	_getID: function() {
		let ID = getParameterByName('id');

		if (!this._isValidID(ID)) {
			// Check if user is logged IN
			if (localStorage.huidigeKlant) {
				return localStorage.huidigeKlant
			}
			else
				return null;
		}
		else {
			return ID;
		}
	},

	/**
	 * Format's 'v' or 'm' to Vrouw & Man
	 *
	 * @param sex
	 * @returns {string}
	 * @private
	 */
	_formatSex: function(sex) {
		return (sex == 'v') ? 'Vrouw' : 'Man';
	},

	_formatBirthDate: function(date) {
		let bd = new Date(date);

		return bd.getDate() + '/' + (bd.getMonth()+1) + '/' + bd.getFullYear();
	},

	User: {
		data: null,
		id: null,

		_isLoaded: false,

		/**
		 * Constructor for user class
		 * Check's for a valid ID, load's in the user's DATA
		 * @param ID
		 */
		init: function(ID) {
			// Small check for valid data
			if (!ID || ID == null || ID == undefined) {
				console.log('Geen geldige ID gegeven!');
				return;
			}

			this.id = ID;
			this.data = this._loadUserData();
		},

		/**
		 * Get's a specific property from the user
		 * @param property
		 * @returns {*}
		 */
		get: function(property) {
			if (this.data.hasOwnProperty(property))
				return this.data[property];
			else
				return null;
		},

		getAllData: function() {
			return this.data;
		},

		getSterrenbeeld: function(birthday) {
			let day, month, year;

			birthday = (birthday == undefined) ? this.get('geboortedatum') : birthday;

			// Convert to date
			date = new Date(birthday);

			// Get relevant vars
			day = date.getDate();
			month = date.getMonth() + 1;

			// translations
			let zodiacSigns = {
				'capricorn':'Steenbok',
				'aquarius':'Waterman',
				'pisces':'Vissen',
				'aries':'Ram',
				'taurus':'Stier',
				'gemini':'Tweelingen',
				'cancer':'Kreeft',
				'leo':'Leeuw',
				'virgo':'Maagd',
				'libra':'Weegschaal',
				'scorpio':'Schorpioen',
				'sagittarius':'Boogschutter'
			};

			if((month == 1 && day <= 20) || (month == 12 && day >=22)) {
				return zodiacSigns.capricorn;
			} else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) {
				return zodiacSigns.aquarius;
			} else if((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
				return zodiacSigns.pisces;
			} else if((month == 3 && day >= 21) || (month == 4 && day <= 20)) {
				return zodiacSigns.aries;
			} else if((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
				return zodiacSigns.taurus;
			} else if((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
				return zodiacSigns.gemini;
			} else if((month == 6 && day >= 22) || (month == 7 && day <= 22)) {
				return zodiacSigns.cancer;
			} else if((month == 7 && day >= 23) || (month == 8 && day <= 23)) {
				return zodiacSigns.leo;
			} else if((month == 8 && day >= 24) || (month == 9 && day <= 23)) {
				return zodiacSigns.virgo;
			} else if((month == 9 && day >= 24) || (month == 10 && day <= 23)) {
				return zodiacSigns.libra;
			} else if((month == 10 && day >= 24) || (month == 11 && day <= 22)) {
				return zodiacSigns.scorpio;
			} else if((month == 11 && day >= 23) || (month == 12 && day <= 21)) {
				return zodiacSigns.sagittarius;
			}
		},

		/**
		 * Loads in the user's data by ID
		 *
		 * @private
		 */
		_loadUserData: function() {
			console.log('Loading User Data...');
			console.log('Loading data completed');

			this._isLoaded = true;

			return scrumlib.getDatasetById(this.id)[0];
		},

		isReady: function() {
			return this._isLoaded;
		}
	},

	Arrange: {
		init: function() {
			//this._initButton();
			//this._checkSelfDates();
		},



		date: function() {
			let target = Profile.User.id
				,	dates = [];

			// Get dates from localStorage
			this._getDates();

			// Push new date to total
			dates.push({
				'id_from': Core.User.getID(),
				'id_to': target
			});

			// Put dates in local storage
			localStorage.setItem('astromatch_dates', JSON.stringify(dates));

			let eMsg = document.getElementById('date_success_msg'); //...

			eMsg.classList.remove('hide');
		},

		_getDates: function() {
			let dates = [];

			if (localStorage.getItem('astromatch_dates') !== null) {
				dates = localStorage.getItem('astromatch_dates');
				dates = JSON.parse(dates);
			}

			return dates;
		},

		_checkSelfDates: function() {
			let dates = this._getDates();

			for(let i in dates) {
				if (dates[i].id_to == Core.User.getID()) {
					let eMsg = document.getElementById('date_msg')
						,	eSender = document.getElementById('date_sender');

					eMsg.classList.remove('hide');

					let html = '';

					html = '<a href="/profiel.html?id=' + dates[i].id_from + '">';
					html += this._getNameSender(dates[i].id_from);
					html += '</a>';

					eSender.innerHTML = html;
				}
			}
		},

		_getNameSender: function(sender_id) {
			let data = scrumlib.getDatasetById(sender_id)[0];

			return data.voornaam + ' ' + data.familienaam;
		},

		_initButton: function() {
			let btn = document.getElementById('btn_date');

			btn.addEventListener('click', function(e) {
				e.preventDefault();

				Profile.Arrange.date();
			});
		}
	}
};

window.onload = function() {
	Core.User.init();
	Profile.init();

	console.log('test');

	eUitlogButton = document.getElementById('logout');


	eUitlogButton.addEventListener('click', function (e) {
		e.preventDefault();
		localStorage.removeItem('huidigeKlant');
		//console.log(localStorage.getItem('huidigeKlant'));
		open('index.html', '_self');
	});
};

//Core.logoutbutton();
