var oFouten = {
     required:{
          /* enkel voor input type="text|password" */
          msg: "verplicht veld",
          test: function (elem){
                return elem.value != "";
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
   var eHaarkleur = document.frmInschrijving.inputHaarkleur;
   var eOogkleur = document.frmInschrijving.inputOogkleur;
   var eGrootte = document.frmInschrijving.inputGrootte;
   var eGewicht = document.frmInschrijving.inputGewicht;
   var ePassword = document.frmInschrijving.inputPassword;
 
   //formulier submit
   frmInschrijving.addEventListener('submit', function (e){
      e.preventDefault();
      var bValid = valideer(this);
      console.log('formulier ' + this.name +' valideert ' + bValid);
      if(bValid===true) this.submit();
   });
}



function valideer(frm){
     var bValid= true;
     return bValid;
}