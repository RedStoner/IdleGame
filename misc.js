function showDebug(t,level) {
  if (doDebug == true) {
    if (level == undefined || debugLevel.indexOf(level) > -1 || debugLevel[0] == "All") {
      console.log(t);
    }
  }
}
function formatResourceName(resource){
  var str =  resource.toString().replace(/_/," ");
  str = str.replace(/,/,", ");
  return str;
}

function setSupplyPercent(key){
  var t = document.getElementById("percent"+key).value;
  console.log(isNaN(t));
  if (isNaN(t)){
    t = 100;
  }
  if (t > 100) {
    t = 100;
  } else if(t<0){
    t = 0;
  }
  player.adjustPercent[key] = t;
  document.getElementById("percent"+key).value = t;
  getAllDemands();
  updateIncomeValues();
}
function formatCustomNumber(n){
  //Detect if there is a decimal value.
  var nums =    [1e87,1e84,1e81,1e78,1e75,1e72,1e69,1e66,1e63,1e60,1e57,1e54,1e51,1e48,1e45,1e42,1e39,1e36,1e33,1e30,1e27,1e24,1e21,1e18,1e15,1e12,1e9,1e6,1e3];
  var holders = [" Ovg", " Spvg", " Sevg", " Qivg", " Qavg", " Tvg", " Dvg", " Uvg",  " Vg",  " Nod",  " Ocd",  " Spd",  " Sxd",  " Qid",  " Qad",  " Td",  " Dd",  " Ud",  " Dc",  " No",  " Oc", " Sp"," Sx",  " Qi", " Qa",  " T",   " B", " M"," K"];
  var suffix = ""
  for (var key in nums) {
    if (n > nums[key]){
      n = n/nums[key];
      suffix = holders[key];
      break;
    }
  }
  n = Math.round(n * 1000) / 1000;
  return (n + suffix)
}
function refreshBuilding(id){
  var cost = getCost(id);
  var str = "<div>"+data.buildings[id].name + "</div>" +
  "<div class='buildingButtons'> <button onclick='buyBuilding(\""+id+"\")'>Buy</button>" +
  "<button onclick='buildingInfo(\""+id+"\")'>Info</button></div>" +
  "<div> Cost: $" + formatCustomNumber(cost) + 
  "<br> Amount: " +   player.buildingsPurchased[id] + "</div>";
  document.getElementById(id).innerHTML = str;
}
function getIncome(incomeType){
  var _income = 0;
  for (var key in data.buildings) {
    if (data.buildings[key].producesType == incomeType) {
      _income += (data.buildings[key].produces * player.buildingsPurchased[key]);
    }
  }
  return _income;
}
      
function buildingInfo(id) {
  buildingInfoID = id;
  changeWindow("building");
}
    
    
    
    