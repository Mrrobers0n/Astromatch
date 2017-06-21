var oFouten = {
    required:{
        msg: "verplicht veld",
        test: function (elem){
            return elem.value != "";
        }
    },
    valid_email:{
        msg: "email adres moet valid zijn",
        test: function (elem){
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(elem.value);
        }
    },
    realistic_weight:{
        msg: "gewicht moet realistisch zijn (tussen 50 en 150 kg)",
        test: function (elem){
            return ( (elem.value==="") || ( (Number(elem.value)>=50) && (Number(elem.value)<=150) ) );
        }
    },
    realistic_height:{
        msg: "grootte moet realistisch zijn (tussen 50 en 250 cm)",
        test: function (elem){
            return ( (elem.value>=50) && (elem.value<=250) );
        }
    },
    adult:{
        msg: "leeftijd moet >=18 jaar zijn",
        test: function (elem){
            return ( calculateAge(elem.value)>=18 );
        }
    },
    agreed:{
        msg: "u moet akkoord gaan met de gebruiksvoorwaarden",
        test: function (elem){
            return ( elem.checked );
        }
    },
    password_requirements:{
        msg: "een wachtwoord moet minstens 6 tekens zijn en 3 cijfers bevatten",
        test: function (elem){
            console.log("Password length:" + elem.value.length + " Digits:" + countdigits(elem.value));
            return ( (elem.value.length>=6) && (countdigits(elem.value)>=3) );
        }
    },
    same_as_wachtwoord:{
        msg: "het paswoord is niet tweemaal gelijk",
        test: function (elem){
            var eFrmInschrijving = document.frmInschrijving;
            var previousValue = eFrmInschrijving.inputWachtwoord.value;
            return ( (elem.value===previousValue) );
        }
    },
    no_pedophilia:{
        msg: "geen pedofilie aub (>=18)",
        test: function (elem){
            return ( (Number(elem.value)=="") || (Number(elem.value)>=18) );
        }
    },
    no_necrophilia:{
        msg: "geen necrofilie aub (<=100)",
        test: function (elem){
            return ( (Number(elem.value)<=100) );
        }
    },
    max_age_larger_than_min:{
        msg: "maximum leeftijd groter dan min leeftijd aub",
        test: function (elem){
            var eFrmInschrijving = document.frmInschrijving;
            console.log("Debug:" + eFrmInschrijving.inputVoorkeurLeeftijdMin.value + " " + eFrmInschrijving.inputVoorkeurLeeftijdMin.value);
            return ( (Number(elem.value)>Number(eFrmInschrijving.inputVoorkeurLeeftijdMin.value)) );
        }
    },
    check_at_least_one_preference_region:{
        msg: "check tenminste 1 checkbox",
        test: function (elem){
            var checkboxs=document.getElementsByName("regioVoorkeur");
            var okay=false;
            for(var i=0,l=checkboxs.length;i<l;i++)
            {
                if(checkboxs[i].checked)
                {
                    okay=true;
                    break;
                }
            }
            return (okay);
        }
    },
    check_at_least_one_preference_sex:{
        msg: "check tenminste 1 checkbox",
        test: function (elem){
            var checkboxs=document.getElementsByName("sexeVoorkeur");
            var okay=false;
            for(var i=0,l=checkboxs.length;i<l;i++)
            {
                if(checkboxs[i].checked)
                {
                    okay=true;
                    break;
                }
            }
            return (okay);
        }
    }
}


window.onload = function (){

    document.getElementById("hidden_error").style.display = "none";
    document.getElementById("existing_account_error").style.display = "none";

    //DOM referenties
    var eFrmInschrijving = document.frmInschrijving;

    //For testing purposes
    eFrmInschrijving.inputVoornaam.value = "testnaam";
    eFrmInschrijving.inputFamilienaam.value = "testfamilienaam";
    eFrmInschrijving.inputNicknaam.value = "testnicknaam";
    eFrmInschrijving.inputGeboortedatum.value = "0666-06-06";
    eFrmInschrijving.inputEmail.value = "test@gmail.com";
    eFrmInschrijving.inputSexe.value = "m";
    eFrmInschrijving.inputBeroep.value = "testberoep";
    eFrmInschrijving.inputHobbies.value = "testhobby";
    eFrmInschrijving.inputGewicht.value = "66";
    eFrmInschrijving.inputGrootte.value = "77";
    eFrmInschrijving.inputOogkleur.value = "blauw";
    eFrmInschrijving.inputHaarkleur.value = "blond";
    eFrmInschrijving.inputRegio.value = "Limburg";
    eFrmInschrijving.inputWachtwoord.value = "vdab666";
    eFrmInschrijving.inputWachtwoordHerhaling.value = "vdab666";
    eFrmInschrijving.inputVoorkeurLeeftijdMin.value = "19";
    eFrmInschrijving.inputVoorkeurLeeftijdMax.value = "99";
    eFrmInschrijving.prefM.checked = true;
    eFrmInschrijving.prefV.checked = true;
    eFrmInschrijving.prefWestVlaanderen.checked = true;
    eFrmInschrijving.prefOostVlaanderen.checked = true;
    eFrmInschrijving.prefLimburg.checked = true;
    eFrmInschrijving.prefBrabant.checked = true;
    eFrmInschrijving.prefWallonie.checked = true;
    eFrmInschrijving.termsAndConditions.checked = true;


    //formulier submit
    frmInschrijving.addEventListener('submit', function (e){
        e.preventDefault();
        var bValid = valideer(this);

        if(bValid===true)
        {
            var userVoorkeur = new Object();

            var userVoorkeurSexe = [];
            var userVoorkeurRegio = [];
            var userVoorkeurLeeftijd = [];

            if (eFrmInschrijving.prefM.checked==true) userVoorkeurSexe.push("m");
            if (eFrmInschrijving.prefV.checked==true) userVoorkeurSexe.push("v");

            if (eFrmInschrijving.prefWestVlaanderen.checked==true) userVoorkeurRegio.push("West-Vlaanderen");
            if (eFrmInschrijving.prefOostVlaanderen.checked==true) userVoorkeurRegio.push("Oost-Vlaanderen");
            if (eFrmInschrijving.prefBrabant.checked==true) userVoorkeurRegio.push("Vlaams-Brabant");
            if (eFrmInschrijving.prefLimburg.checked==true) userVoorkeurRegio.push("Limburg");
            if (eFrmInschrijving.prefWallonie.checked==true) userVoorkeurRegio.push("Wallonie");
            if (eFrmInschrijving.prefElders.checked==true) userVoorkeurRegio.push("Elders");

            userVoorkeurLeeftijd.push(eFrmInschrijving.inputVoorkeurLeeftijdMin.value);
            userVoorkeurLeeftijd.push(eFrmInschrijving.inputVoorkeurLeeftijdMax.value);

            userVoorkeur.sexe = userVoorkeurSexe;
            userVoorkeur.regio = userVoorkeurRegio;
            userVoorkeur.leeftijd = userVoorkeurLeeftijd;

			// Voeg profiel toe
            var new_profiel = {
                beroep: eFrmInschrijving.inputBeroep.value,
                vrijetijd: eFrmInschrijving.inputHobbies.value,
                email: eFrmInschrijving.inputEmail.value.toLowerCase(),
                voornaam: eFrmInschrijving.inputVoornaam.value,
                nickname: eFrmInschrijving.inputNicknaam.value,
                familienaam: eFrmInschrijving.inputFamilienaam.value,
                foto: "",//eFrmInschrijving.inputFileFoto.value,
                geboortedatum: eFrmInschrijving.inputGeboortedatum.value,
                gewicht: eFrmInschrijving.inputGewicht.value,
                grootte: eFrmInschrijving.inputGrootte.value,
                haarkleur: eFrmInschrijving.inputHaarkleur.value,
                oogkleur: eFrmInschrijving.inputOogkleur.value,
                sexe: eFrmInschrijving.inputSexe.value,
                regio: eFrmInschrijving.inputRegio.value,
				wachtwoord: eFrmInschrijving.inputWachtwoord.value,
                voorkeur : userVoorkeur,
                lovecoins : 3
            };

            console.log(scrumlib.createDataset(new_profiel));

            scrumlib.save();

			// Finally check whether the account already exists

            var emailAlreadyFound = false;

            var libDatasets = scrumlib.getDatasetsByConditions({email: {'waarde':eFrmInschrijving.inputEmail.value.toLowerCase(), 'match': '~'}});

            if (libDatasets.length>1) emailAlreadyFound = true;

            console.log("Lengte:" + libDatasets.length);

            if (emailAlreadyFound===true)
            {
                document.getElementById("existing_account_error").style.display = "block";
            }
            else
            {
                var sId = scrumlib.login(eFrmInschrijving.inputEmail.value.toLowerCase(), eFrmInschrijving.inputWachtwoord.value);
                if(sId !== false)
                {
                    console.log(localStorage.huidigeKlant);
                    //Het ID halen
                    //console.log(sId);
                    localStorage.setItem('huidigeKlant', sId); /* om id te halen
                 var klantId = localStorage.huidigeKlant;      */
                }
                else{
                    console.log("Account niet in DB");
                }

                this.submit();
            }
        }
        else
        {
            document.getElementById("hidden_error").style.display = "block";
        }
    });

    //validatie bij onblur van bepaalde elementen
    frmInschrijving.inputVoornaam.addEventListener('blur', function (e){
        hideErrors(frmInschrijving.inputVoornaam);
        valideerVeld(frmInschrijving.inputVoornaam); });
    frmInschrijving.inputNicknaam.addEventListener('blur', function (e){
        hideErrors(frmInschrijving.inputNicknaam);
        valideerVeld(frmInschrijving.inputNicknaam); });
    frmInschrijving.inputFamilienaam.addEventListener('blur', function (e){
        hideErrors(frmInschrijving.inputFamilienaam);
        valideerVeld(frmInschrijving.inputFamilienaam); });
    frmInschrijving.inputEmail.addEventListener('blur', function (e){
        hideErrors(frmInschrijving.inputEmail);
        valideerVeld(frmInschrijving.inputEmail); });
    frmInschrijving.inputGeboortedatum.addEventListener('blur', function (e){
        hideErrors(frmInschrijving.inputGeboortedatum);
        valideerVeld(frmInschrijving.inputGeboortedatum); });
    frmInschrijving.inputWachtwoord.addEventListener('blur', function (e){
        hideErrors(frmInschrijving.inputWachtwoord);
        valideerVeld(frmInschrijving.inputWachtwoord); });
    frmInschrijving.inputWachtwoordHerhaling.addEventListener('blur', function (e){
        hideErrors(frmInschrijving.inputWachtwoordHerhaling);
        valideerVeld(frmInschrijving.inputWachtwoordHerhaling); });
    frmInschrijving.inputVoorkeurLeeftijdMin.addEventListener('blur', function (e){
        hideErrors(frmInschrijving.inputVoorkeurLeeftijdMin);
        valideerVeld(frmInschrijving.inputVoorkeurLeeftijdMin); });
    frmInschrijving.inputVoorkeurLeeftijdMax.addEventListener('blur', function (e){
        hideErrors(frmInschrijving.inputVoorkeurLeeftijdMax);
        valideerVeld(frmInschrijving.inputVoorkeurLeeftijdMax); });
}


function valideer(frm){
    var bValid = true; //optimistisch geen fouten
    //lus doorheen alle form elementen van het formulier

    for(var i=0;i<frm.elements.length;i++){
        //verwijder vorige foutboodschappen
        hideErrors(frm.elements[i]);
        //valideer veld
        var bVeld = valideerVeld(frm.elements[i]);
        //console.log("het element %s met name %s valideert %s", frm.elements[i].nodeName,frm.elements[i].name, bVeld);
        if(bVeld ===false){ bValid = false; }
    }

    return bValid;
}




function valideerVeld(elem){
    //valideert één veld volgens zijn class
    var aFoutBoodschappen = [];
    for (var fout in oFouten){
        var re = new RegExp("(^|\\s)" + fout + "(\\s|$)"); //regex
        // fouten class aanwezig?
        if(re.test(elem.className)){
            var bTest = oFouten[fout].test(elem);
            //console.log("het element %s met name %s wordt gevalideerd voor %s: %s", elem.nodeName,elem.name, fout, bTest);
            if(bTest === false){
                aFoutBoodschappen.push(oFouten[fout].msg);
            }
        }
    }
    if(aFoutBoodschappen.length>0){
        showErrors(elem, aFoutBoodschappen);}
    return !(aFoutBoodschappen.length>0);
}

function showErrors(elem, aErrors){

    //toont alle fouten voor één element
    //@elem element, te valideren veld
    //@aErrors array, fouten voor dit element

    var eBroertje = elem.nextSibling;

    if (elem.getAttribute("type")!="checkbox") {
        if (!eBroertje || !(eBroertje.nodeName == "UL" && eBroertje.className == "fouten" )) {
            eBroertje = document.createElement('ul');
            eBroertje.className = "fouten";
            elem.parentNode.insertBefore(eBroertje, elem.nextSibling);
        }
        //plaats alle foutberichten erin
        for (var i = 0; i < aErrors.length; i++) {
            var eLi = document.createElement('li');
            eLi.innerHTML = aErrors[i];
            eBroertje.appendChild(eLi);
        }
    }
    else
    {
        var eBroertje = elem.nextSibling.nextSibling;

        if (!eBroertje || !(eBroertje.nodeName == "UL" && eBroertje.className == "fouten" )) {
            eBroertje = document.createElement('ul');
            eBroertje.className = "fouten";
            elem.parentNode.insertBefore(eBroertje, elem.nextSibling.nextSibling);
        }
        //plaats alle foutberichten erin
        for (var i = 0; i < aErrors.length; i++) {
            var eLi = document.createElement('li');
            eLi.innerHTML = aErrors[i];
            eBroertje.appendChild(eLi);
        }
    }
}

function hideErrors(elem){
    /*
     verwijdert alle fouten voor één element
     @elem element, te valideren veld
     */
    var eBroertje = elem.nextSibling;

    if (elem.getAttribute("type")!="checkbox") {

        if (eBroertje && eBroertje.nodeName == "UL" && eBroertje.className == "fouten") {
            elem.parentNode.removeChild(eBroertje);
        }
    }
    else
    {
        var eBroertje = elem.nextSibling.nextSibling;

        if (eBroertje && eBroertje.nodeName == "UL" && eBroertje.className == "fouten") {
            elem.parentNode.removeChild(eBroertje);
        }
    }
}

function countdigits(s) {
    return s.replace(/[^0-9]/g,"").length;
}

function calculateAge(birthDateString)
{
    var birthDate = new Date(birthDateString)

    var birthYear = birthDate.getFullYear();
    var birthMonth = birthDate.getMonth();
    var birthDay = birthDate.getDate();

    var todayDate = new Date();
    var todayYear = todayDate.getFullYear();
    var todayMonth = todayDate.getMonth();
    var todayDay = todayDate.getDate();
    var age = todayYear - birthYear;

    if (todayMonth < birthMonth - 1)
    {
        age--;
    }

    if (birthMonth - 1 == todayMonth && todayDay < birthDay)
    {
        age--;
    }
    return age;
}