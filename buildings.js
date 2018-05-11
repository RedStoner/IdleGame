
function setupBuildings(){
  var str = ""
  for (var key in data.buildings) {
    str += "<div id = '"+key+"' class='building'></div>"
  }
  document.getElementById("buildings").innerHTML = str;
  for (var key in data.buildings) {
    if (data.buildings[key].researchNeeded == undefined || hasResearch(data.buildings[key].researchNeeded) ) {
      refreshBuilding(key);
    } else {
      document.getElementById(key).classList.remove("building");
      document.getElementById(key).classList.add("hiddenBuilding");
    }
  }
}
function getCost(id) {
  var multiplier = Math.pow(data.buildings[id].costMultiplier,player.buildingsPurchased[id]);
  return data.buildings[id].baseCost * multiplier ;
}
function buyBuilding(id){
  var cost = getCost(id)
  if (freeBuildings) {
    player.buildingsPurchased[id] += 1;
    refreshBuilding(id);
    refreshMoney();
    getAllDemands();
    updateIncomeValues();
    if (currentWindow == "supply" ) {
      updateResourceInfo();
    }
    if (currentWindow == "main") {
      updateMainWindow();
    }
    return;
  }
  if(player.money >= cost) {
    player.buildingsPurchased[id] += 1;
    refreshBuilding(id);
    player.money -= cost;
    refreshMoney();
    getAllDemands();
    updateIncomeValues();
    if (currentWindow == "supply" ) {
      updateResourceInfo();
    }
    if (currentWindow == "main") {
      updateMainWindow();
    }
  }
  
}
function sortBuildingsByType() {
  var tempBList = {
    producer: [],
    refiner: [],
    consumer:[]
  }
  for (var key in data.buildings) {
    buildingTypes[data.buildings[key].buildingType].push(key);
  }
  return tempBList;
}
function changeBuildingPriority(key,d){
  var t = data.buildings[key].buildingType;
  var index = buildingTypes[t].indexOf(key);
  if (d == "up") {
    if (index > 0) {
      var temp = buildingTypes[t][index-1];
      buildingTypes[t][index-1] = buildingTypes[t][index];
      buildingTypes[t][index] = temp;
    }
  } else if (d == "down") {
    if (index < buildingTypes[t].length) {
      var temp = buildingTypes[t][index+1];
      buildingTypes[t][index+1] = buildingTypes[t][index];
      buildingTypes[t][index] = temp;
    }
  }
  if (currentWindow == "priorities") {
    updatePriorities();
  }
  getAllDemands();
  updateIncomeValues();
  
}
function createBuildingStats() {
  for (var key in data.buildings) {
    var building = data.buildings[key];
    buildingStats[key] = {};
    buildingStats[key].produced = {};
    buildingStats[key].supplyPercent = {};
    buildingStats[key].demanding = {};
    buildingStats[key].demandingForSupply = {};
    for (rKey in building.producesType){
      var r = building.producesType[rKey];
      buildingStats[key].produced[r] = 0;
    }
    for (rKey in building.consumeType) {
      var r = building.producesType[rKey];
      buildingStats[key].supplyPercent[r] = 0;
      buildingStats[key].demanding[r] = 0;
      buildingStats[key].demandingForSupply[r] = 0;
    }
  }
}
