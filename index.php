<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" type="text/css" href="layout.css" />
<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
<title>EvilCraft Idle v 0.5.9</title>
</head>
<body onresize="resizeWindows()">

<div id="wrapper">
    <div id="values">
        <p id="money"> Money: </p>
        <p id="population"> Population:</p>
        <p id="researchpoints"> Research:</p>
        <p id="researchcurrent"> Researching:</p>
        <p id="researchqueued"> Queued Research:</p>
    </div>
    <div id="logo">
        <p> logo here</p>
    </div>
    <div style="clear: both";></div> 
    <div id="buildingsContainer">
        <div id="buildingsNav">
          <button onclick="showBuildings('all')">All</button>
          <button onclick="showBuildings('producer')">Producers</button>
          <button onclick="showBuildings('refiner')">Refiners</button>
          <button onclick="showBuildings('consumer')">Suppliers</button>
        </div>
        <div id="buildings">
        </div>
    </div>
    <div id="topbar">
        <button onclick='clickMoney()'>$$Clicker$$</button>
        <button onclick="changeWindow('supply')">Resource Info</button>
        <button onclick="changeWindow('research')">Research</button>
        <button onclick="changeWindow('flow')">Crafting Flow</button>
        <button onclick="changeWindow('info')">Info</button>
        <button onclick="changeWindow('changelog')">Changelog</button>
        <button onclick="changeWindow('priorities')">Priorities</button>
        <button onclick="newGame()">New Game</button>
    </div>

    <div id="window">
     <p> window </p>

    </div> 
</div>
<script>
"use strict";
//Define All Globals
var player;
var data = {
  costMultiplier: 1.07,
  buildings: {
    farm: {
      name:"Farmland",
      baseCost:100,
      produces:[10,5],
      producesType: ["Crops","Corn"],
      buildingType: "producer",
      costMultiplier: 1.06
    },
    mine: {
      name:"Metal Mine",
      baseCost:50,
      produces:[20],
      producesType: ["Metal_Ore"],
      buildingType: "producer",
      costMultiplier: 1.06
    },
    logcamp: {
      name:"Logging Camp",
      baseCost:100,
      produces:[10,5],
      producesType: ["Wood","Plant_Matter"],
      buildingType: "producer",
      costMultiplier: 1.06
    },
    orchard: {
      name:"Orchard",
      baseCost:500,
      produces:[10,5],
      producesType: ["Fruit","Wood"],
      buildingType: "producer",
      researchNeeded: "orchards",
      costMultiplier: 1.06
    },
    coalmine: {
      name:"Coal Mine",
      baseCost:1000,
      produces:[10],
      producesType: ["Coal"],
      buildingType: "producer",
      researchNeeded: "steel",
      costMultiplier: 1.06
    },
    oilrefinery: {
      name:"Oil Refinery",
      baseCost:1500,
      produces:[10],
      producesType: ["Oil"],
      buildingType: "producer",
      researchNeeded: "oil",
      costMultiplier: 1.06
    },
    foodplant: {
      name:"Food Processing Plant",
      baseCost:200,
      produces:[10],
      producesType: ["Processed_Food"],
      buildingType: "refiner",
      consumeType: ["Crops","Fruit"],
      consumeRate: [40,20],
      requires: ["Crops"],
      costMultiplier: 1.07
    },
    metalworks: {
      name:"Metalworks",
      baseCost:150,
      produces:[10],
      producesType: ["Shaped_Metal"],
      buildingType: "refiner",
      consumeType: ["Metal_Ore"],
      consumeRate: [40],
      requires: ["All"],
      costMultiplier: 1.07
    },
    lumbermill: {
      name:"Lumbermill",
      baseCost:150,
      produces:[10],
      producesType: ["Lumber"],
      buildingType: "refiner",
      consumeType: ["Wood"],
      consumeRate: [30],
      requires: ["All"],
      costMultiplier: 1.07
    },
    steelmill: {
      name:"Steel Mill",
      baseCost:1000,
      produces:[10],
      producesType: ["Steel"],
      buildingType: "refiner",
      consumeType: ["Metal_Ore", "Coal"],
      consumeRate: [50,30],
      requires: ["All"],
      researchNeeded: "steel",
      costMultiplier: 1.07
    },
    plasticsplant: {
      name:"Plastics Manufacturer",
      baseCost:2000,
      produces:[10],
      producesType: ["Plastic"],
      buildingType: "refiner",
      consumeType: ["Oil","Coal"],
      consumeRate: [40,20],
      requires: ["All"],
      researchNeeded: "plastic",
      costMultiplier: 1.07
    },
    petroleumplant: {
      name:"Petroleum Plant",
      baseCost:3000,
      produces:[10],
      producesType: ["Petroleum"],
      buildingType: "refiner",
      consumeType: ["Oil","Corn","Plant_Matter"],
      consumeRate: [30,20,20],
      requires: ["Oil"],
      researchNeeded: "oil",
      costMultiplier: 1.07
    },
    grocerystore: {
      name:"Grocery Store",
      baseCost:250,
      produces:[10],
      producesType: ["Food"],
      buildingType: "consumer",
      consumeType: ["Processed_Food"],
      consumeRate: [40],
      requires: ["All"],
      costMultiplier: 1.14
    },
    lab: {
      name:"Science Lab",
      baseCost:750,
      produces:[1],
      producesType: ["Research"],
      buildingType: "consumer",
      consumeType: ["Shaped_Metal","Lumber","Plastic"],
      consumeRate: [40,20,30],
      requires: ["Shaped_Metal","Lumber"],
      costMultiplier: 1.14
    },
    hardwarestore: {
      name:"Hardware Store",
      baseCost:150,
      produces:[10],
      producesType: ["Tools"],
      buildingType: "consumer",
      consumeType: ["Shaped_Metal","Lumber"],
      consumeRate: [40,20],
      requires: ["All"],
      costMultiplier: 1.14
    },
    buildingsupplies: {
      name:"Building Supplies Store",
      baseCost:350,
      produces:[10],
      producesType: ["Building_Supplies"],
      buildingType: "consumer",
      consumeType: ["Shaped_Metal","Lumber","Steel"],
      consumeRate: [20,40,30],
      requires: ["Shaped_Metal","Lumber"],
      costMultiplier: 1.14
    },
    carfactory: {
      name:"Car Factory",
      baseCost:1500,
      produces:[10],
      producesType: ["Cars"],
      buildingType: "consumer",
      consumeType: ["Shaped_Metal","Plastic","Steel"],
      consumeRate: [40,20,30],
      requires: ["All"],
      researchNeeded: "cars",
      costMultiplier: 1.14
    },
    gasstation: {
      name:"Gas Station",
      baseCost:1800,
      produces:[10],
      producesType: ["Fuel"],
      buildingType: "consumer",
      consumeType: ["Petroleum"],
      consumeRate: [30],
      requires: ["All"],
      researchNeeded: "oil",
      costMultiplier: 1.14
    }
  }
}
var popDemand = {
    type: ["Food",  "Tools",  "Building_Supplies",  "Cars", "Fuel"],
    amount:  [0.1,  .25,            0.15,                          .5,          1],
    value:     [0.3,  2,            1.5,                             3,           5]
}
var currentWindow = "fresh";
var buildingInfoID = "farm";
var incomeValues = {};
var availableResources = {};
var demandedResources = {};
var maxResourcesAble = {};
var cheatMode = false;
var buildingTypes = {
    producer: [],
    refiner: [],
    consumer:[]
  }
var doDebug = false;
var debugLevel = ["incomeValues"];
var bonusResourcesDemanded = {}
var buildingStats = {};
</script>
<script src = "dataHandler.js"></script>
<script src ="misc.js"></script> 
<script src ="gamemech.js"></script> 
<script src ="buildings.js"></script> 
<script src = "windows.js"></script>  
<script src = "research.js"></script>  
<script>
player = newPlayerData();
buildingTypes = sortBuildingsByType();
var doSave = checkIfSavePossible();
if (doSave){
  checkForData();
}
resizeWindows();
createBuildingStats();
getAllDemands();
updateIncomeValues();
setupBuildings();
refreshMoney();
refreshResearch();
refreshPopulation();
changeWindow("supply");
//firstTickSetup();
if (cheatMode) {
  var freeBuildings = true;
  unlockAllResearch();
}
incomeLoop();
function clickedBuilding(id){
  buyBuilding(id);
}
function firstTickSetup() {
  for (var key in popDemand.type) {
    availableResources[popDemand.type[key]] = 0;
  }
}
if (doSave) {
  window.addEventListener("beforeunload", saveDataBeforeClose,false);
}
</script>

</body>
</html>