/**
 * Created by Leander on 31/05/2017.
 */
Core.init();
Core.berichtenTeller();
eBerichtTitels = document.getElementById('berichtTitels');
var sDeBerichten = localStorage.getItem("deBerichten");
eBerichtContent = document.getElementById('berichtText');

if(sDeBerichten.indexOf("To:"+Core.User.getID()) == -1)
{
eBerichtTitels.innerHTML = "U hebt geen berichten";
}else{
    var sStartPos = sDeBerichten.indexOf("To:"+Core.User.getID()) ;
    var i = sStartPos;
    var berichtteller = 0;
    var berichtArray = [];
    while(i >0){
        var afzenderId = sDeBerichten.substring(sStartPos-24,sStartPos);
        var sEindeBericht = sStartPos+sDeBerichten.substring(sStartPos, sDeBerichten.length).indexOf("\@\@");
        var sBericht = sDeBerichten.substring(sStartPos+32,sEindeBericht);
        var sVolgendeStartString = sDeBerichten.substring(sEindeBericht+2 ,sDeBerichten.length );
            // de plus 2 in vorige en volgende is omdat sEindeBericht niet de 2 @s heeft
        i = sVolgendeStartString.indexOf("\@\@");
        //if(i !== -1 ) {
        sStartPos = sEindeBericht + 2 + sVolgendeStartString.indexOf("To:" + Core.User.getID());

        berichtArray[berichtteller] = sBericht;
        maakVeldAfzender(afzenderId);
        berichtteller = berichtteller + 1;
        //}
    }
}




function maakVeldAfzender(id){
    console.log(berichtteller);
    var afzenderNaam = Core.User.init(id).getNickname();
    var afzenderDiv = document.createElement("li");
    var nodeText = document.createTextNode(afzenderNaam);
    afzenderDiv.id = berichtteller.toString();
    afzenderDiv.addEventListener("click", function(){
        onClickEventAfzenderNaam(parseInt(afzenderDiv.id), this);
    });
    afzenderDiv.appendChild(nodeText);
    eBerichtTitels.appendChild(afzenderDiv);

}
function onClickEventAfzenderNaam(messageNumber, element){
    var allListElements = document.querySelectorAll('ul#berichtTitels li');
    allListElements.forEach(function(elem){
        elem.classList.remove("active");
    });
    element.classList.add("active");
    eBerichtContent.innerHTML= berichtArray[messageNumber];
    configureerDelete();

}
function configureerDelete(){
    var eDeleteButton = document.getElementById("btnDelete");
    eDeleteButton.style.visibility = 'visible';
    $('#btnDelete').each(function() { // reset `onclick` event handlers
        this.onclick = null;
    });
    eDeleteButton.onclick = function(){
        eActiveNode = document.querySelector("ul#berichtTitels .active");
        nNodeNumber = eActiveNode.id;
        teDeletenBericht = berichtArray[nNodeNumber];
        console.log(teDeletenBericht);
        console.log(sDeBerichten);
        console.log(sDeBerichten.indexOf(teDeletenBericht));
        if(sDeBerichten.indexOf(teDeletenBericht) !== -1) {
            console.log("DELETEN DIE HANDEL");
            var replaceVan = sDeBerichten.indexOf(teDeletenBericht) - 5 - 24 - 3 - 24 - 5;
            var replaceTot = sDeBerichten.indexOf(teDeletenBericht) + teDeletenBericht.length + 2;
            console.log(replaceVan + " en " + replaceTot);
            sDeBerichten = sDeBerichten.replace(sDeBerichten.substring(
                replaceVan, replaceTot
            ), "");
        }else{

        }
        localStorage.setItem("deBerichten", sDeBerichten);

        var eVolgendeNode = eActiveNode.previousSibling;
        if(eVolgendeNode == null || eVolgendeNode.nodeType == 3){
            eVolgendeNode =eActiveNode.nextSibling;

        }
        if(eVolgendeNode ==null){
            location.reload();
            console.log("geen volgende node");
        }else{
            idVolgendeNode= eVolgendeNode.id;
            console.log("Javascript triggert click van node met id: "+idVolgendeNode);
            $("#"+ (idVolgendeNode)).trigger("click");
        }
        eBerichtTitels.removeChild(eActiveNode);

    };
};

Core.logoutbutton();