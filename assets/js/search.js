let Search = {
	init: function() {
		this._setEventHandler();
	},

	search: function() {
		let qry = this.Gui.getQueryString()
			,	profiles = null
			,	allProfiles = []
			,	eCountResults = document.getElementById('search_results_count')
			,	criteria = this.Gui.getCriteria()
			,	oTempProfile = null;

		console.log('----------------- SEARCH STARTED ----------------');

		// Zoeken naar alles van de criteria
		// Alle criteria

		if (criteria.naam!=="")
		{
			console.log("Zoek op nicknaam");
            profiles = scrumlib.getDatasetsByConditions({
                nickname: {waarde: criteria.naam, match: '~'}
            });
		}
        else
        {
            // profiles = scrumlib.getAllDatasets();
            profiles = this._getAllDataSets();
            console.log("Zoek niet op nicknaam, alle records ("+profiles.length+")worden geselecteerd");
        }

        // Elimineren op basis van grootte

        if (criteria.grootte_min==="") criteria.grootte_min =    0;
        if (criteria.grootte_max==="") criteria.grootte_max = 1000;

        console.log("Elimineren op basis van grootte: min grootte = " + criteria.grootte_min + " max grootte = " + criteria.grootte_max);

        for (var i=0; i<profiles.length; i++)
        {
            if ( (profiles[i].grootte<criteria.grootte_min) || (profiles[i].grootte>criteria.grootte_max) )
            {
                console.log("Verwijder profiel van " + profiles[i].nickname + " want zijn/haar grootte is " + profiles[i].grootte + " en minima en maxima zijn " + criteria.grootte_min + " en " + criteria.grootte_max );
                profiles.splice(i,1); i--;
            }
        }

        // Elimineren op basis van leeftijd

        if (criteria.leeftijd_min==="") criteria.leeftijd_min =    0;
        if (criteria.leeftijd_max==="") criteria.leeftijd_max = 1000;

        var date = new Date();

        var geboortedatum_min = formatMinBirthDate(date,criteria.leeftijd_min);
        var geboortedatum_max = formatMaxBirthDate(date,criteria.leeftijd_max);

        console.log("Elimineren op basis van leeftijd: min leeftijd = " + criteria.leeftijd_min + " max leeftijd = " + criteria.leeftijd_max);
        console.log("Dus geboortedatum voor min leeftijd moet VOOR: " + geboortedatum_min + " en geboortedatum voor max leeftijd moet NA: " + geboortedatum_max);

        for (var i=0; i<profiles.length; i++)
        {
            if ( (profiles[i].geboortedatum<geboortedatum_max) || (profiles[i].geboortedatum>geboortedatum_min) )
            {
                console.log("Verwijder profiel van " + profiles[i].nickname + " want zijn/haar geboortedatum is " + profiles[i].geboortedatum + " op basis van geboortedatum " + profiles[i].geboortedatum + " en minima en maxima zijn " + geboortedatum_min + " en " +geboortedatum_max );
                profiles.splice(i,1); i--;
            }
        }

        // Elimineren op basis van sterrenbeeld

        if (criteria.sterrenbeeld!=="") {

            console.log("Elimineren op basis van sterrenbeeld: criterium: " + criteria.sterrenbeeld);

            for (var i = 0; i < profiles.length; i++) {
                if (bepaalSterrenbeeld(profiles[i].geboortedatum)!==criteria.sterrenbeeld) {
                	console.log("Verwijder profiel van " + profiles[i].nickname + " want zijn/haar sterrenbeeld is " + bepaalSterrenbeeld(profiles[i].geboortedatum) + " op basis van geboortedatum " + profiles[i].geboortedatum + " en het gevraagde sterrenbeeld is " + criteria.sterrenbeeld);
                    profiles.splice(i, 1);
                    i--;
                }
            }
        }
        else
        {
            console.log("Niet elimineren op basis van sterrenbeeld, sterrenbeeld = ''");
        }

        // Elimineren op basis van hobby's

        criteria.vrijetijd = criteria.vrijetijd.toLowerCase();

        if (criteria.vrijetijd!=="") {

            console.log("Elimineren op basis van vrije tijd, vrije tijd = " + criteria.vrijetijd);

            for (var i = 0; i < profiles.length; i++) {
                if ( (profiles[i].vrijetijd===undefined) || (profiles[i].vrijetijd.toLowerCase().includes(criteria.vrijetijd)===false) ) {
                    console.log("Verwijder profiel van " + profiles[i].nickname + " want zijn/haar vrije tijd is " + profiles[i].vrijetijd + " en de gevraagde substring is " + criteria.vrijetijd);
                    profiles.splice(i, 1);
                    i--;
                }
            }
        }
        else
        {
            console.log("Niet elimineren op basis van vrije tijd, vrije tijd = ''");
        }

        // Elimineren op basis van regio

        if (criteria.regio!=="") {

            for (var i = 0; i < profiles.length; i++) {
                if ( (profiles[i].regio===undefined) || (profiles[i].regio!==criteria.regio) ) {
                    console.log("Verwijder profiel van " + profiles[i].nickname + " want zijn/haar regio is " + profiles[i].regio + " en de gevraagde regio is " + criteria.regio);
                    profiles.splice(i, 1);
                    i--;
                }
            }
        }
        else
        {
            console.log("Niet elimineren op basis van regio, regio = ''");
        }

        // Elimineren op basis van seksuele voorkeuren

		var voorkeurUserM = true;
        var voorkeurUserV = true;

        // console.log("USER IS : " + User.voornaam);

		console.log('----------------- SEARCH ENDED ----------------');

		// Check to prevent error
		if (profiles === null) {
			profiles = {};
			profiles.length = 0;
		}

		console.log(profiles.length + ' results found');

		let sResultaten = (profiles.length > 1 || profiles.length == 0) ? ' resultaten' : 'resultaat';

		eCountResults.innerHTML = profiles.length + ' ' + sResultaten;

		console.log('rendering results');

		this._renderResults(profiles);

		if (profiles.length == 0) {
			document.getElementById('search_results').innerHTML = 'Er zijn geen profielen gevonden met uw criteria.';
		}
		else {
			//Core.Messages.show('Er zijn ' + profiles.length + ' profielen gevonden met uw criteria!', 'info');
		}
	},

	_getAllDataSets: function() {
		let profiles = scrumlib.getAllDatasets()
			, datasets = [];

		for(let i=0; i < profiles.length; i++)
			datasets.push(profiles[i]);

		return datasets;
	},

	_merge: function(arrSet, arrTarget) {
		for(let i=0; i < arrSet.length; i++) {
			arrTarget.push(arrSet[i]);
		}
	},

	_removeDuplicates: function(arrSet) {
		let IDs = '';
		let tempArray = [];

		for(let i=0; i < arrSet.length; i++) {
			let set = arrSet[i];

			if (IDs.indexOf(set._id) !== -1) {
				delete arrSet[i];
				console.log('ID: ' + set._id + ' removed');
			}
			else {
				IDs += set._id + ',';
				tempArray.push(set);
			}
		}

		return tempArray;
	},

	_renderResults: function(results) {
		let eResults = document.getElementById('search_results');

		// eResults leegmaken
		eResults.innerHTML = '';

		// Loop door alle resultaten
		for(let i in results) {
			let profile = results[i]
				,	eContainer = document.createElement('div')
				,	html = '';

			// Stel de klas in
			// eContainer = een zoekresultaat
			eContainer.classList.add('profile-suggestion');

			//html += '<div class="result-avatar">';
			//	html += '<img src="assets/img/' + Profile.getAvatarUrl(profile.foto, profile.sexe) + '" class="img-responsive" />';
			//html += '</div>';
			//
			//html += '<div class="clear"></div>';

			html =	'<a href="/profiel.html?id=' + profile._id + '">';
				html += '<div class="profile-name">'+ profile.nickname + '</div>';
				html += '<div class="profile-img"><img src="assets/img/' + Profile.getAvatarUrl(profile.foto, profile.sexe) + '" /></div>';
			html += '</a>';

			eContainer.innerHTML = html;

			eResults.appendChild(eContainer);
		}
	},

	_setEventHandler: function() {
		let fSearch = document.getElementById('form-search')
			,	eBlinddate = document.getElementById('btn_blinddate');

		fSearch.addEventListener('submit', function(e) {
			e.preventDefault();

			Search.search();
		});

		eBlinddate.addEventListener('click', function(e) {
			e.preventDefault();

			let profiles = scrumlib.getAllDatasets();
			let random_profile = null;

			do {
				random_profile =  Math.round(Math.random() * profiles.length);
			}
			while(profiles[random_profile]._id == Core.User.getID());

			window.location.href = '/profiel.html?id=' + profiles[random_profile]._id;

		});
	},

	Gui: {
		getQueryString: function() {
			let iSearch = document.getElementById('querystring');

			return iSearch.value;
		},

		getCriteria: function() {
			let criteria = {}
				,	eFields = document.querySelectorAll('#form-search input,select');

			// Loop door alle velden
			for(let i in eFields) {
				let eField = eFields[i];

				if (eField instanceof HTMLElement)
					criteria[eField.getAttribute('name').replace('srch_', '')] = eField.value;
			}

			return criteria;
		}
	}

};

function formatMinBirthDate(date,minimum_age) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()-minimum_age;

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formatMaxBirthDate(date,maximum_age) {
    var d = new Date(date);

    var dayOfMonth = d.getDate();

    d.setDate(dayOfMonth + 1);
    month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()-maximum_age-1;

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


function bepaalSterrenbeeld(birthday)
{
    let day, month, year;

    birthday = (birthday == undefined) ? this.get('geboortedatum') : birthday;

    // Convert to date
    date = new Date(birthday);

    // Get relevant vars
    day = date.getDate();
    month = date.getMonth() + 1;

    // translations
    let zodiacSigns = {
        'capricorn':'steenbok',
        'aquarius':'waterman',
        'pisces':'vissen',
        'aries':'ram',
        'taurus':'stier',
        'gemini':'tweelingen',
        'cancer':'kreeft',
        'leo':'leeuw',
        'virgo':'maagd',
        'libra':'weegschaal',
        'scorpio':'schorpioen',
        'sagittarius':'boogschutter'
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
}