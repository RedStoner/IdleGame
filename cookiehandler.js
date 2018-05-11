function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkForCookies() {
  var c = ""
  c = getCookie("player_money");
  if (c != "") {
      data.player.money = parseInt(c,2);
  } 
  c = getCookie("player_researchPoints");
  if (c != "") {
      data.player.researchPoints = parseInt(c,2);
  } 
  c = getCookie("player_income");
  if (c != "") {
      data.player.income = parseInt(c,2);
  } 
  c = getCookie("player_researchIncome");
  if (c != "") {
      data.player.researchIncome = parseInt(c,2);
  } 
  c = getCookie("building_tier1");
  if (c != "") {
      data.buildings.tier1.numPurchased = parseInt(c,2);
  }
  c = getCookie("building_tier2");
  if (c != "") {
      data.buildings.tier2.numPurchased = parseInt(c,2);
  }
  c = getCookie("building_tier3");
  if (c != "") {
      data.buildings.tier3.numPurchased = parseInt(c,2);
  }
  c = getCookie("building_tier4");
  if (c != "") {
      data.buildings.tier4.numPurchased = parseInt(c,2);
  }
    
}
function removeCookie(cname) {
  var d = new Date();
  d.setTime(d.getTime() - (6000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + ";" + expires + ";path=/";
}
function removeCookies() {
  cList = ["building_tier1","building_tier2","building_tier3","building_tier4",
           "player_income","player_money","player_researchIncome","player_researchPoints"];
  for (i=0;cList.length;i++) {
    removeCookie(cList[i]);
  }
}