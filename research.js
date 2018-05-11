
function doResearchTick() {
  player.storedResources["Research"] = 0;
  if (player.research.current != "none") {
    //increment their current points twards their research.
    player.research.currentPoints += player.research.income;
    //check if it is enough to complete the research
    var r = researchList[player.research.current];
    var pointsNeeded = getPointsNeededTotal(player.research.current);
    if (player.research.currentPoints > pointsNeeded ) {
      var doAdd = true;
      //apply effects of research completion
      if (researchList[player.research.current].effect != undefined) {
        switch(r.effect) {
          default:
            console.log("Unknown effect for research - " + player.research.current);
          case "building":
            researchUnlockBuilding(player.research.current);
            break;
          case "output":
            getAllDemands();
            updateIncomeValues();
            break;
          case "simpleUnlock":
            break;
          case "tick":
            player.gameTickRate = player.gameTickRate + 1;
            break;
          case "bonus":
            var e = r.effectInfo;
            player.bonuses[e.type][e.building] += e.amount;
            if (r.isInfinite && hasResearch(player.research.current)) {
              doAdd = false;
            }
            break;
          case "clickMoney":
            player.bonuses.clickMoney += 1;
            break;
        }
      } else {
        console.log("No effect assigned for - " + player.research.current);
      }
      //clear points and set as completed
      player.research.currentPoints = 0;
      if (doAdd) {
        player.research.completed.push(player.research.current);
      }
      //set current research to queued research
      if (player.research.queued != "none") {
        player.research.current = player.research.queued;
        player.research.queued = "none";
      } else {
        player.research.current = "none";
      }
      //check if a research was not added from queued
      if (player.research.current == "none" ) {
        //update production values to turn off research production
        getAllDemands();
        updateIncomeValues();
      }
      if (currentWindow == "research") {
        updateResearchWindow()
      }
    }
  }
}
function hasResearch(r) {
  if (player.research.completed.indexOf(r) >= 0){
    return true;
  }
  return false;
}
var researchList = {
  steel: {
    name: "Steel Processing",
    description: "Allows you to buy the Coal Mine and Steel Mill, which allows the production of Steel.",
    value: 1500,
    unlockedBy: "default",
    type: "progression",
    effect: "building"
  },
  queuing: {
    name: "Research Queue",
    description: "Allows You to queue up an additional research.",
    value: 600,
    unlockedBy: "default",
    type: "supplier",
    effect: "simpleUnlock"
  },
  orchards: {
    name: "Orchards",
    description: "Allows you to buy Orchards. They can provide a bonus input to Processed Food production and can supply a small amount of wood with a later research",
    value: 1800,
    unlockedBy: "default",
    type: "progression",
    effect: "building"
  },
  cars: {
    name: "Automobiles",
    description: "Allows you to buy the Car Factory, which supplies the population with Cars.",
    value: 14400,
    unlockedBy: "steel",
    type: "progression",
    effect: "building"
  },
  oil: {
    name: "Oil Refining",
    description: "Allows you to buy the Oil Refinery, Petroleum Plant, and the Gas Station which allows the production of Fuel.",
    value: 86400,
    unlockedBy: "steel",
    type: "progression",
    effect: "building"
  },
  plastic: {
    name: "Plastic Production",
    description: "Allows you to buy the Plastics Manufacturer, which allows the production of Plastic.",
    value: 432000,
    unlockedBy: "oil",
    type: "progression",
    effect: "building"
  },
  ethanol: {
    name: "Ethanol Additives",
    description: "Allows farms to output Corn to the Petroleum Plant to allow for bonus production",
    value: 259200,
    unlockedBy: "oil",
    type: "producer",
    effect: "output"
  },
  biomass: {
    name: "Biomass Alternatives",
    description: "Allows the Logging Camp to ouput Plant Matter to the Petroleum Plant to allow for bonus production",
    value: 604800,
    unlockedBy: "ethanol",
    type: "producer",
    effect: "output"
  },
  wood: {
    name: "Small Lumber Gathering",
    description: "Allows the Orchard to ouput a small amount of Wood to the Lumber Mill to allow for more production",
    value: 777600,
    unlockedBy: "orchards",
    type: "producer",
    effect: "output"
  },
  tickrate1: {
    name: "Tick Rate 1",
    description: "Increases the game's Calculation rate to 2 times per second.",
    value: 14400,
    unlockedBy: "steel",
    type: "progression",
    effect: "tick"
  },
  //Bonuses - Production - Producer
  farmproduction: {
    name: "Farm Production",
    description: "Increases the amount of Crops and Corn produced each tick by 1.",
    value: 7200,
    unlockedBy: "default",
    type: "producer",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "farm",
      amount: 1,
    }
  },
  metalproduction: {
    name: "Mine Production",
    description: "Increases the amount of Metal Ore produced each tick by 3.",
    value: 7200,
    unlockedBy: "default",
    type: "producer",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "mine",
      amount: 3,
    }
  },
  logproduction: {
    name: "Logging Camp Production",
    description: "Increases the amount of Wood and Plant Matter produced each tick by 4.",
    value: 7200,
    unlockedBy: "default",
    type: "producer",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "logcamp",
      amount: 4,
    }
  },
  orchardproduction: {
    name: "Orchard Production",
    description: "Increases the amount of Fruit and Wood produced each tick by 5.",
    value: 7200,
    unlockedBy: "orchards",
    type: "producer",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "orchard",
      amount: 5,
    }
  },
  coalproduction: {
    name: "Coal Mine Production",
    description: "Increases the amount of Coal produced each tick by 3.",
    value: 7200,
    unlockedBy: "steel",
    type: "producer",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "coalmine",
      amount: 3,
    }
  },
  oilproduction: {
    name: "Oil Refinery Production",
    description: "Increases the amount of Oil produced each tick by 3.",
    value: 7200,
    unlockedBy: "oil",
    type: "producer",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "oilrefinery",
      amount: 3,
    }
  },
  //Bonuses - Production - Refiners
  foodplantproduction: {
    name: "Food Processing Plant Production",
    description: "Increases the amount of Processed Food produced each tick by 3.",
    value: 7200,
    unlockedBy: "farmproduction",
    type: "refiner",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "foodplant",
      amount: 3,
    }
  },
  metalworksproduction: {
    name: "Metalworks Production",
    description: "Increases the amount of Shaped Metal produced each tick by 2.",
    value: 7200,
    unlockedBy: "metalproduction",
    type: "refiner",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "metalworks",
      amount: 2,
    }
  },
  lumberproduction: {
    name: "Lumber Mill Production",
    description: "Increases the amount of Lumber produced each tick by 2.",
    value: 7200,
    unlockedBy: "logproduction",
    type: "refiner",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "lumbermill",
      amount: 2,
    }
  },
  steelproduction: {
    name: "Steel Mill Production",
    description: "Increases the amount of Steel produced each tick by 3.",
    value: 7200,
    unlockedBy: "coalproduction",
    type: "refiner",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "steelmill",
      amount: 3,
    }
  },
  plasticproduction: {
    name: "Plastic Manufacturer Production",
    description: "Increases the amount of Plastic produced each tick by 2.",
    value: 7200,
    unlockedBy: "oilproduction",
    type: "refiner",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "plasticsplant",
      amount: 2,
    }
  },
  petroproduction: {
    name: "Petroleum Plant Production",
    description: "Increases the amount of Petroleum produced each tick by 1.",
    value: 7200,
    unlockedBy: "oilproduction",
    type: "refiner",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "petroleumplant",
      amount: 1,
    }
  },
  //Bonuses - Production - Suppliers
  foodproduction: {
    name: "Grocery Store Production",
    description: "Increases the amount of Food produced each tick by 2.",
    value: 14400,
    unlockedBy: "foodplantproduction",
    type: "supplier",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "grocerystore",
      amount: 2,
    }
  },
  toolproduction: {
    name: "Hardware Store Production",
    description: "Increases the amount of Tools produced each tick by 2.",
    value: 14400,
    unlockedBy: "metalworksproduction",
    type: "supplier",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "hardwarestore",
      amount: 2,
    }
  },
  buildingproduction: {
    name: "Building Supplies Production",
    description: "Increases the amount of Building Supplies produced each tick by 3.",
    value: 14400,
    unlockedBy: "lumberproduction",
    type: "supplier",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "buildingsupplies",
      amount: 3,
    }
  },
  carproduction: {
    name: "Car Factory Production",
    description: "Increases the amount of Cars produced each tick by 2.",
    value: 14400,
    unlockedBy: "steelproduction",
    type: "supplier",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "carfactory",
      amount: 2,
    }
  },
  labproduction: {
    name: "Science Lab Production",
    description: "Increases the amount of Research produced each tick by .5.",
    value: 28800,
    unlockedBy: "metalworksproduction",
    type: "supplier",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "lab",
      amount: .5,
    }
  },
  gasproduction: {
    name: "Gas Station Production",
    description: "Increases the amount of Gas produced each tick by 1.",
    value: 14400,
    unlockedBy: "petroproduction",
    type: "supplier",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "production",
      building: "gasstation",
      amount: 1,
    }
  },
  //Bonuses - SellPrice - Resources
  foodsell: {
    name: "Food Sell Price",
    description: "Increases the amount of money made from selling Food by 15%",
    value: 14400,
    unlockedBy: "foodproduction",
    type: "population",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "sellPrice",
      building: "Food",
      amount: 0.15,
    }
  },
  toolssell: {
    name: "Tools Sell Price",
    description: "Increases the amount of money made from selling Tools by 10%",
    value: 12200,
    unlockedBy: "toolproduction",
    type: "population",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "sellPrice",
      building: "Tools",
      amount: 0.10,
    }
  },
  buildingsell: {
    name: "Building Supplies Sell Price",
    description: "Increases the amount of money made from selling Building Supplies by 15%",
    value: 12200,
    unlockedBy: "buildingproduction",
    type: "population",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "sellPrice",
      building: "Building_Supplies",
      amount: 0.15,
    }
  },
  carsell: {
    name: "Cars Sell Price",
    description: "Increases the amount of money made from selling Cars by 10%",
    value: 14400,
    unlockedBy: "carproduction",
    type: "population",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "sellPrice",
      building: "Cars",
      amount: 0.10,
    }
  },
  fuelsell: {
    name: "Fuel Sell Price",
    description: "Increases the amount of money made from selling Fuel by 10%",
    value: 15500,
    unlockedBy: "gasproduction",
    type: "population",
    effect: "bonus",
    isInfinite: true,
    effectInfo : {
      type: "sellPrice",
      building: "Fuel",
      amount: 0.10,
    }
  },
  clickMoney: {
    name: "Click Money Bonus",
    description: "Increases the amount of money made from clicking the button by double the current value.",
    value: 500,
    unlockedBy: "default",
    type: "population",
    effect: "clickMoney",
    isInfinite: true,
    limit: 30
  },
}
function researchUnlockBuilding(r) {
  for (var key in data.buildings) {
    if (data.buildings[key].researchNeeded == r) {
      document.getElementById(key).classList.remove("hiddenBuilding");
      document.getElementById(key).classList.add("building");
      refreshBuilding(key);
    }
  }      
}
function getAvailableResearch() {
  var l = [];
  for (var researchIndex in researchList) {
    if (!hasResearch(researchIndex) || researchList[researchIndex].isInfinite){
      if (researchList[researchIndex].unlockedBy != "default") {
        if (hasResearch(researchList[researchIndex].unlockedBy) ) {
          l.push(researchIndex);
        }
      } else {
        l.push(researchIndex);
      }
    }
    
  }
  return l;
}
function changeResearch(r) {
  if (player.research.current == "none") {
    player.research.current = r;
  } else if (hasResearch("queuing") ) {
    player.research.queued = r;
  } else {
    return;
  }
  if (currentWindow == "research") {
    updateResearchWindow()
  }
  getAllDemands();
  updateIncomeValues();
}
function cancelResearch(r){
  //check if it is being researched or is in queue
  player.research.currentPoints = 0;
  if (player.research.queued != r && player.research.current != r) {
      return false;
  }
  //check if its the queued research.
  if (player.research.queued == r) {
    player.research.queued = "none";
  }
  //check if its the current research
  if (player.research.current == r) {
    if (confirm("Are You Sure? All progress towards this research will be lost!") ){
      if (player.research.queued == "none") {
        player.research.current = "none";
       //set research to queued research if there is one.
      } else {
        player.research.current = player.research.queued;
        player.research.queued = "none";
      }
    }
  }
  if (currentWindow == "research") {
    updateResearchWindow()
  }
  getAllDemands();
  updateIncomeValues();
}
function unlockAllResearch() {
  for (key in researchList) {
    player.research.current = key;
    player.research.currentPoints = researchList[key].value + 1;
    doResearchTick();
  }
}
function getPointsNeededTotal(r){
  var res = researchList[r]
  var pointsNeeded = res.value;
  if (res.isInfinite) {
    if (res.effectInfo != undefined){
      var timesCompleted = player.bonuses[res.effectInfo.type][res.effectInfo.building]/res.effectInfo.amount;
      pointsNeeded = res.value * Math.pow(1.75,timesCompleted);
    } else if (r == "clickMoney") {
      pointsNeeded = res.value * Math.pow(1.5,player.bonuses.clickMoney);
    }
  } 
  return pointsNeeded;  
}





