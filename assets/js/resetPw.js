/**
 * Created by cursist on 6/1/2017.
 */

// ---------- DOM elements -------------
var msg1 = document.getElementById('error1');
var msg2 = document.getElementById('error2');
var msg3 = document.getElementById('error3');
var eSubmit = document.getElementById("btn");


//add event listener to submit
eSubmit.addEventListener("click", function(){


    //stuff to do after click;
    console.log('clicked');

    // get entered values of fields
    var eEmail = document.getElementById('email').value;
    var pas1 = document.getElementById('pw1').value;
    var pas2 = document.getElementById('pw2').value;

    //  condition for numbers
    var regex = /[0-9]/g;
    var numbers = pas1.match(regex);


    // check if entered email is in database
    var sUser = scrumlib.getDatasetsByConditions({
        email: {'waarde':eEmail, 'match': '~'}
    })[0];

    // register input as to be used value for new password
    var newPw =  { wachtwoord: pas1 };

    console.log('email: ' + eEmail);
    console.log(sUser);


    if(eEmail == "") {
        console.log('enter something in email');
        msg1.innerHTML = "Gelieve uw email in te vullen"
    }



    // check of user bestaat
    if(sUser === undefined) {
        console.log("user not found");
     }

    else {

        console.log("user found : proceed");
        // valideer entered pw

        if (pas1.length >= 6 && pas1 === pas2 && numbers.length > 2)
        {
            console.log("proceed registering pw");
            msg1.innerHTML ='Wachtwoord succesvol verandert. U kan nu <a href="/index.html">inloggen</a>';
            msg2.innerHTML ="";
            msg3.innerHTML ="";
            //update pasword in database and push
            scrumlib.updateDataset(sUser._id, newPw);
            scrumlib.save()
        }

        else {
            console.log('continue checking input')
            // check if pw is long enough
            if(pas1.length >= 6 )
            {
                msg1.innerHTML = ""
            }
            else
            {
                msg1.innerHTML = "Gelieve op z'n minst 6 characters in te geven"
            }

            // check if pw includes at least 3 numbers
            if(numbers.length < 3 ) {
                msg2.innerHTML ="Gelieve minimum 3 cijfers te gebruiken";
                console.log("too short - at least 1 number");
            }

            else
            {
                msg2.innerHTML = ""
                console.log("enough numbers")
            }

            // check if 2 fields match
            if(pas1 === pas2)
            {
                msg3.innerHTML = ""
            }
            else
            {
                msg3.innerHTML = "Ingevoerde wachtwoorden komen niet overeen"
            }
        }
    }


});  // close click function