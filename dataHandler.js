function checkIfSavePossible(){
  if (typeof(Storage) !== "undefined"){
    return true;
  } else {
    alert("Unable to access save area. Saves are Disabled!!!!!!");
    return false;
  }
}
function storeData(){
  var myJSON = JSON.stringify(player);
  localStorage.setItem("clickerPlayerData",myJSON);  
  var myJSONB = JSON.stringify(buildingTypes);
  localStorage.setItem("clickerBuildingPriority",myJSONB);  
}
function getPlayerData(){
  var text = localStorage.getItem("clickerPlayerData");
  return JSON.parse(text);
}
function getBuildingData(){
  var text = localStorage.getItem("clickerBuildingPriority");
  return JSON.parse(text);
}
function checkForData() {
  var tData = getPlayerData();
  var tBData = getBuildingData();
  var defaultData = newPlayerData();
  var defaultBData = sortBuildingsByType();
  if (tData) {
    //console.log("Found Previous Play Session. Resuming it.");
    for (var key in defaultData) {
      //console.log("Checking key " + key);
      if (tData[key]){
        //console.log("inSave: true");
        //console.log("type: " + typeof(defaultData[key]) );
        if (typeof(defaultData[key]) == "object") {
          //Found another object inside
          for (var innerKey in defaultData[key]) {
            if (tData[key][innerKey]){
              //console.log("data: " + tData[key]);
              player[key][innerKey] = tData[key][innerKey];
            }
          }
        } else {
          //console.log("data: " + tData[key]);
          player[key] = tData[key];
        }
      }
    }
  }
  if (tBData) {
    for (var key in defaultBData) {
      //check if each building is in the save data
      for (var bKey in defaultBData[key]) {
        //if its not in the save data, add it to the data.
        if (tBData[key].indexOf(defaultBData[key][bKey]) == -1) {
          tBData[key].push(defaultBData[key][bKey]);
        }
      }
      buildingTypes[key] = tBData[key];
    }
  }
  if (player.population <= 0) {
    player.population = 100;
  }
}
function saveDataBeforeClose(){
  alert("Saving Data.");
  storeData();
}
function newPlayerData() {
  var newPlayer = {
    gameTickRate: 1,
    money:1000,
    income: 0,
    researchIncome: 0,
    population: 25,
    populationGrowth: 0,
    buildingsPurchased: {
      farm: 0,
      mine: 0,
      logcamp: 0,
      orchard: 0,
      coalmine: 0,
      oilrefinery: 0,
      foodplant: 0,
      metalworks: 0,
      lumbermill: 0,
      steelmill: 0,
      plasticsplant: 0,
      petroleumplant: 0,
      grocerystore: 0,
      hardwarestore: 0,
      buildingsupplies: 0,
      carfactory: 0,
      lab: 0,
      gasstation: 0
    },
    storedResources: {
      Food: 0,
      Tools: 0,
      Building_Supplies: 0,
      Cars: 0,
      Research: 0,
      Fuel: 0
    },
    incomes: {
      Food: 0,
      Tools: 0,
      Building_Supplies: 0,
      Cars: 0,
      Research: 0,
      Fuel: 0
    },
    research: {
      completed: [],
      current: "none",
      currentPoints:0,
      queued: "none",
      income: 0
    },
    bonuses: {
      production: {
        farm: 0,
        mine: 0,
        logcamp: 0,
        orchard: 0,
        coalmine: 0,
        oilrefinery: 0,
        foodplant: 0,
        metalworks: 0,
        lumbermill: 0,
        steelmill: 0,
        plasticsplant: 0,
        petroleumplant: 0,
        grocerystore: 0,
        hardwarestore: 0,
        buildingsupplies: 0,
        carfactory: 0,
        lab: 0,
        gasstation: 0
      },
      sellPrice: {
        Food: 0,
        Tools: 0,
        Building_Supplies: 0,
        Cars: 0,
        Fuel: 0
      },
      cost: {
        farm: 0,
        mine: 0,
        logcamp: 0,
        orchard: 0,
        coalmine: 0,
        oilrefinery: 0,
        foodplant: 0,
        metalworks: 0,
        lumbermill: 0,
        steelmill: 0,
        plasticsplant: 0,
        petroleumplant: 0,
        grocerystore: 0,
        hardwarestore: 0,
        buildingsupplies: 0,
        carfactory: 0,
        lab: 0,
        gasstation: 0
      },
      clickMoney: 0
    },
    adjustPercent: {
      farm: 100,
      mine: 100,
      logcamp: 100,
      orchard: 100,
      coalmine: 100,
      oilrefinery: 100,
      foodplant: 100,
      metalworks: 100,
      lumbermill: 100,
      steelmill: 100,
      plasticsplant: 100,
      petroleumplant: 100,
      grocerystore: 100,
      hardwarestore: 100,
      buildingsupplies: 100,
      carfactory: 100,
      lab: 100,
      gasstation: 100
    },
  }
  return newPlayer;
}
function newGame(){
  //Need to add confirmation
  if (confirm("Are You Sure? This cannot be undone!!!!!")){
    player = newPlayerData();
    incomeValues = {};
    availableResources = {};
    demandedResources = {};
    maxResourcesAble = {};
    getAllDemands();
    updateIncomeValues();
    setupBuildings();
    refreshMoney();
    refreshResearch();
    refreshPopulation();
    if (currentWindow == "supply" ) {
      updateResourceInfo();
    }
  }
}