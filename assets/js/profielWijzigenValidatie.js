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
    Core.init();

    document.getElementById("hidden_error").style.display = "none";

    //DOM referenties
    var eFrmInschrijving = document.frmInschrijving;

    var sId = localStorage.getItem('huidigeKlant');

    console.log("Id van de persoon: " + sId);

    var persoon = scrumlib.getDatasetById(sId)[0];

    console.log( persoon.familienaam);

    eFrmInschrijving.inputBeroep.value = persoon.beroep;
    eFrmInschrijving.inputHobbies.value = persoon.vrijetijd;
    eFrmInschrijving.inputEmail.value = persoon.email;
    eFrmInschrijving.inputFamilienaam.value = persoon.familienaam;
    //eFrmInschrijving.inputFileFoto.value = "";
    eFrmInschrijving.inputGeboortedatum.value = persoon.geboortedatum;
    eFrmInschrijving.inputGewicht.value = persoon.gewicht;
    eFrmInschrijving.inputGrootte.value = persoon.grootte;
    eFrmInschrijving.inputHaarkleur.value = persoon.haarkleur;
    eFrmInschrijving.inputNicknaam.value = persoon.nickname;
    eFrmInschrijving.inputOogkleur.value = persoon.oogkleur;
    eFrmInschrijving.inputRegio.value = persoon.regio;
    eFrmInschrijving.inputSexe.value = persoon.sexe;
    eFrmInschrijving.inputVoornaam.value = persoon.voornaam;
    eFrmInschrijving.inputWachtwoord.value = persoon.wachtwoord;
    eFrmInschrijving.inputWachtwoordHerhaling.value = persoon.wachtwoord;

    console.log(persoon.voorkeur);

    if (persoon.voorkeur!=null) {
        if (persoon.voorkeur.sexe != null) {
            for (var i = 0; i < persoon.voorkeur.sexe.length; i++) {
                //console.log("Voorkeur:"+persoon.voorkeur.sexe[i]);
                if (persoon.voorkeur.sexe[i] == "m") eFrmInschrijving.prefM.checked = true;
                if (persoon.voorkeur.sexe[i] == "v") eFrmInschrijving.prefV.checked = true;
            }
        }

        if (persoon.voorkeur.regio != null) {
            for (var i = 0; i < persoon.voorkeur.regio.length; i++) {
                //console.log("Voorkeur:"+persoon.voorkeur.sexe[i]);
                if (persoon.voorkeur.regio[i] == "West-Vlaanderen") eFrmInschrijving.prefWestVlaanderen.checked = true;
                if (persoon.voorkeur.regio[i] == "Oost-Vlaanderen") eFrmInschrijving.prefOostVlaanderen.checked = true;
                if (persoon.voorkeur.regio[i] == "Limburg") eFrmInschrijving.prefLimburg.checked = true;
                if (persoon.voorkeur.regio[i] == "Wallonie") eFrmInschrijving.prefWallonie.checked = true;
                if (persoon.voorkeur.regio[i] == "Vlaams-Brabant") eFrmInschrijving.prefBrabant.checked = true;
                if (persoon.voorkeur.regio[i] == "Elders") eFrmInschrijving.prefElders.checked = true;
            }
        }

        if (persoon.voorkeur.leeftijd != null) {
            if (persoon.voorkeur.leeftijd.length==2)
            {
                eFrmInschrijving.inputVoorkeurLeeftijdMin.value = persoon.voorkeur.leeftijd[0];
                eFrmInschrijving.inputVoorkeurLeeftijdMax.value = persoon.voorkeur.leeftijd[1];
            }
        }
    }

    //formulier submit/'save'
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

            // Finally check whether the account already exists

            var emailAlreadyFound = false;

            var libDatasets = scrumlib.getDatasetsByConditions({email: {'waarde':eFrmInschrijving.inputEmail.value, 'match': '~'}});

            if ( (libDatasets.length>1) && (libDatasets[0]._Id!==localStorage.getItem('huidigeKlant')) ) emailAlreadyFound = true;

            console.log("Lengte:" + libDatasets.length);

            if (emailAlreadyFound===true)
            {
                document.getElementById("existing_account_error").style.display = "block";
            }
            else
            {
                // Wijzig profiel
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
                    voorkeur : userVoorkeur
                };

                sId = localStorage.getItem('huidigeKlant');

                scrumlib.updateDataset(sId,new_profiel)

                scrumlib.save();

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

    //uitschrijven event listener

    var buttonUitschrijven = document.getElementById("uitschrijven");
    buttonUitschrijven.addEventListener("click", function() { Core.User.remove(); });

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

Core.logoutbutton();