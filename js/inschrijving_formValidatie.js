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
                  return ( (elem.value>=50) && (elem.value<=150) );
          }
        },
	 realistic_height:{
          msg: "grootte moet realistisch zijn (tussen 50 en 250 cm)",
          test: function (elem){
                  return ( (elem.value>=50) && (elem.value<=250) );
          }
        }
    }


window.onload = function (){
 
   //DOM referenties
   var eFrmInschrijving = document.frmInschrijving;
   
   var eVoornaam = document.frmInschrijving.inputVoornaam;
   var eFamilienaam = document.frmInschrijving.inputFamilienaam;
   var eGeboortedatum = document.frmInschrijving.inputGeboortedatum;
   var eEmail = document.frmInschrijving.inputEmail;
   var eNicknaam = document.frmInschrijving.inputNicknaam;
   var eFoto = document.frmInschrijving.inputFileFoto;
   var eBeroep = document.frmInschrijving.inputBeroep;
   var eSexe = document.frmInschrijving.inputSexe;
   var eHaarkleur = document.frmInschrijving.inputHaarkleur;
   var eOogkleur = document.frmInschrijving.inputOogkleur;
   var eGrootte = document.frmInschrijving.inputGrootte;
   var eGewicht = document.frmInschrijving.inputGewicht;
   var ePassword = document.frmInschrijving.inputPassword;
      
   //formulier submit
   frmInschrijving.addEventListener('submit', function (e){
      e.preventDefault();
      var bValid = valideer(this);
	  var eSexe = document.frmInschrijving.inputSexe;
      console.log(eSexe.value);
      if(bValid===true) this.submit();
   });
}



function valideer(frm){
     var bValid = true; //optimistisch geen fouten
     //lus doorheen alle form elementen van het formulier
 
     for(var i=0;i<frm.elements.length;i++){
          //verwijder vorige foutboodschappen
          hideErrors(frm.elements[i]);
          //valideer veld
          var bVeld = valideerVeld(frm.elements[i]);
          console.log("het element %s met name %s valideert %s", frm.elements[i].nodeName,frm.elements[i].name, bVeld);
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
     /*
     toont alle fouten voor één element
     @elem element, te valideren veld
     @aErrors array, fouten voor dit element
     */
     var eBroertje = elem.nextSibling;
     if(!eBroertje || !(eBroertje.nodeName == "UL" && eBroertje.className == "fouten" )){
          eBroertje = document.createElement('ul');
          eBroertje.className = "fouten";
          elem.parentNode.insertBefore(eBroertje, elem.nextSibling);
     }
     //plaats alle foutberichten erin
     for(var i=0;i<aErrors.length;i++){
          var eLi = document.createElement('li');
          eLi.innerHTML = aErrors[i];
          eBroertje.appendChild(eLi);
     }
}

function hideErrors(elem){
     /*
     verwijdert alle fouten voor één element
     @elem element, te valideren veld
     */
     var eBroertje = elem.nextSibling;
     if(eBroertje && eBroertje.nodeName == "UL" && eBroertje.className == "fouten" ){
          elem.parentNode.removeChild(eBroertje);
     }
}

