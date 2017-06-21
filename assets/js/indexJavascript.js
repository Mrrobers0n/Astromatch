
//document elements
eLoginFrm = document.login;
eLoginEmail = document.login.email;
eLoginPassword = document.login.wachtwoord;
eOutput = document.getElementById("errorOutput");
console.log(localStorage.huidigeKlant);

//als klant al ingelogd is
if(localStorage.getItem('huidigeKlant') !== null){
    open('home.html', '_self');
}

//eventlistener inlog button
eLoginFrm.addEventListener('submit', function(e){
	e.preventDefault();
	sLoginEmail = eLoginEmail.value.toLowerCase();
	sLoginPassword = eLoginPassword.value;
	if(validateEmail(eLoginEmail.value))
	{
		//email is geen email probeer opnieuw
		console.log("Geen geldig E-mail");
		eOutput.innerHTML = "Geen geldig E-mail adres.";	}
	else{
		//checken of de user bestaat
		//indien ja naar volgende pagina
		//indien nee error onbestaande username of pass
		var sId = scrumlib.login(sLoginEmail, sLoginPassword);
		if(sId !== false)
		{
			console.log(localStorage.huidigeKlant);
			 //Het ID halen
			//console.log(sId);
			localStorage.setItem('huidigeKlant', sId); /* om id te halen 
															var klantId = localStorage.huidigeKlant;      */
            open('home.html', '_self');
		}
		else{
			console.log("Account niet in DB");
			eOutput.innerHTML = "Geen bestaand account of wachtwoord.";
		}
	}
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(email);
}