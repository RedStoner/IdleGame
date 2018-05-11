function incomeLoop() {
  //Calculate Money income per resource times population
  player.income = 0;
  doPopGrowth();
  for (var dKey in popDemand.type) {
    var resource = popDemand.type[dKey];
    //gain resources stored for this tick
    adjustStoredResource(resource,incomeValues[resource]);
    var valBonus = popDemand.value[dKey] + (popDemand.value[dKey] * player.bonuses.sellPrice[resource]);
    if (player.storedResources[resource] > player.population * popDemand.amount[dKey]) {
      //consume all resources needed if Stored resources has enough.
      player.income += valBonus * (player.population * popDemand.amount[dKey]);
      player.incomes[resource] = valBonus * (player.population * popDemand.amount[dKey]);
      adjustStoredResource(resource, -(player.population * popDemand.amount[dKey]) );
    } else {
      player.income += valBonus * player.storedResources[resource];
      player.incomes[resource] = valBonus * player.storedResources[resource];
      player.storedResources[resource] = 0;
    }
  }
  player.money += player.income;
  //Calculate Research
  player.research.income = incomeValues.Research
  doResearchTick();
  refreshMoney();
  refreshResearch();
  refreshPopulation();
  if (currentWindow == "supply") {
    updateResourceInfo();
  }
  if (currentWindow == "main") {
    updateMainWindow();
  }
  setTimeout(incomeLoop,1000/player.gameTickRate);
}
function getPopKey(resource) {
  return popDemand.type.indexOf(resource);
}
function doPopGrowth(){
  if (player.storedResources.Food > 0 ) {
    var excessFood = player.storedResources.Food;
    var growthRate = excessFood / (popDemand.amount[0] * 10);
    var popGrowth = Math.round(growthRate);
    if (popGrowth < 0 ) {
      popGrowth = 0;
    }
      showDebug("Growth: " + popGrowth + " excessFood: " + excessFood + " GrowthRate: " + growthRate,"popGrowth");
    if (popGrowth > 0) {
      player.population += popGrowth;
      player.populationGrowth = popGrowth;
      adjustStoredResource("Food",popGrowth*-1);
      getAllDemands();
      updateIncomeValues();
    } else {
      player.populationGrowth = 0;
    }
  } else if (player.populationGrowth > 0 ) {
      player.populationGrowth = 0;
  }
}
function clickMoney() {
  player.money += Math.pow(2,player.bonuses.clickMoney);
  refreshMoney();
}
function adjustMaxValue(resource,amt) {
  if (maxResourcesAble[resource]  == undefined) {
    maxResourcesAble[resource] = 0;
  }
  maxResourcesAble[resource] += amt;
}
function adjustIncomeValue(resource,amt) {
  if (incomeValues[resource] == undefined) {
    incomeValues[resource] = 0;
  }
  incomeValues[resource] += amt;
}
function adjustAvailableValue(resource,amt){
  var str = "Adjusting " + resource + " by " + amt + "oldValue:" + availableResources[resource]; 
  if (availableResources[resource]  == undefined) {
    availableResources[resource] = 0;
  }
  availableResources[resource] += amt;
  showDebug(str + " newValue:" + availableResources[resource],"incomeValues");
  if (availableResources[resource] < 0) { 
    availableResources[resource] = 0;
  }
}
function adjustStoredResource(resource,amt){
  player.storedResources[resource] += amt;
  if (player.storedResources[resource] > player.population * 120) {
    player.storedResources[resource] = player.population * 120;
  }   
  if (player.storedResources[resource] < 0) {
    player.storedResources[resource] = 0;
  }  
}
//unused ???
function getConsumeAmount(consumed,produced,needed) {
  return needed * (consumed/produced);
}
function getBuildingColor(key){
  if (data.buildings[key].requires != undefined){
    if (data.buildings[key].requires == "All") {
      return "red";
    } 
    return "green";
  }
  return "black";
}
  // var base = productionRate * player.buildingsPurchased[key];
  // var _amt = (base * supplyPercent) + (base * supplyPercent * bonusPercent);
function updateIncomeValues(){
  incomeValues = {};
  maxResourcesAble = {};
  availableResources = {};
  showDebug("Checking producers : " + buildingTypes.producer, "incomeValues");
  for (var buildingTypeKey in buildingTypes.producer) {
    var key = buildingTypes.producer[buildingTypeKey];
    showDebug("Checking all resources for : " + key, "incomeValues");
    for (rKey in data.buildings[key].produces){
      showDebug(key + ": Adding resource " + data.buildings[key].producesType[rKey], "incomeValues");
      var base = (data.buildings[key].produces[rKey] + player.bonuses.production[key]) * player.buildingsPurchased[key];
      var resource = data.buildings[key].producesType[rKey];
      if (resource == "Corn" && hasResearch("ethanol") != true) {
      adjustIncomeValue(resource,0);
      adjustMaxValue(resource,0);
      adjustAvailableValue(resource,0);
        
      } else if (resource == "Plant_Matter" && hasResearch("biomass") != true) {
      adjustIncomeValue(resource,0);
      adjustMaxValue(resource,0);
      adjustAvailableValue(resource,0);
        
      } else if (resource == "Wood" && hasResearch("wood") != true && key == "orchard" ) {
      adjustIncomeValue(resource,0);
      adjustMaxValue(resource,0);
      adjustAvailableValue(resource,0);
        
      } else {
      adjustIncomeValue(resource,base);
      adjustMaxValue(resource,base);
      adjustAvailableValue(resource,base);
      showDebug(key+": Adding Values for " + resource + ":" + base , "incomeValues");
      }
      
    }
  }
  var workTypes = ["refiner","consumer"];
  for (var tKey in workTypes) {
    showDebug("Checking " + workTypes[tKey] + "s : " + buildingTypes[workTypes[tKey]], "incomeValues");
    var bType = workTypes[tKey];
    //for each refiner/consumer
    for (var buildingTypeKey in buildingTypes[bType]) {
      var key = buildingTypes[bType][buildingTypeKey];
      var t = {};
      var building = data.buildings[key];
      //check each consume material type to get the percentage it is recieving.
      for (cKey in building.consumeType){
        var resource = building.consumeType[cKey];
        var consumeRate = building.consumeRate[cKey];
        // if there is enough, set percentage to 1
        if (availableResources[resource] >= (consumeRate * player.buildingsPurchased[key]) ) {
          t[resource] = 1;
        //otherwise calculate percentage recieved
        } else {
          //check for divide by 0
          if (consumeRate * player.buildingsPurchased[key] > 0 ) {
            showDebug(key+": available " + resource + ":" + availableResources[resource], "incomeValues");
            showDebug(key+": max :" + consumeRate * player.buildingsPurchased[key], "incomeValues");
            t[resource] = availableResources[resource] / (consumeRate * player.buildingsPurchased[key]);
          } else {
            t[resource] = 0;
          }
        }
        buildingStats[key].supplyPercent[resource] = t[resource];
      }
      
      //precalculate percentage outcomes for building types(black,red,green)
      var supplyPercent = 1;
      var bonusPercent = {};
      //Find the lowest supplied material for supplyPercent
      for (pValue in t) {
        //check special bonus conditions for green buildings
        if (getBuildingColor(key) == "green") {
          //if its required, set supplyPercent if its lower than the current
          if (isRequiredResource(key,pValue) == true) {
            showDebug(key+": Requires " + pValue + ":" + t[pValue], "incomeValues");
            if (t[pValue] < supplyPercent) {
              supplyPercent = t[pValue];
            }
          //otherwise, set bonusPercent
          } else {
            showDebug(key+": Does not require " + pValue + ":" + t[pValue], "incomeValues");
            bonusPercent[pValue] = t[pValue];
          }
        //if its not green, set supplyPercent if its lower than the current
        } else {
          if (t[pValue] < supplyPercent) {
            supplyPercent = t[pValue];
          }
        }
      }
      //set Values for the buildings depending on color type
      if (getBuildingColor(key) == "red") {
        //Red Border Buildings
        var produced = 0;
        for (rKey in building.producesType){
          var resource = building.producesType[rKey];
          var base = (building.produces[rKey] + player.bonuses.production[key]) * player.buildingsPurchased[key];
          //check if there is a demand for this resource
          if (demandedResources[resource] > 0) {
            var demandMet = (base * supplyPercent) / demandedResources[resource];
            if (demandMet > 1 ) {
              demandMet = 1;
            }
            produced = demandedResources[resource] * demandMet;
          }
          showDebug(key+": produced:" + produced + " demandMet:" + demandMet + " base:" + base,"incomeValues");
          adjustMaxValue(resource, base);
          adjustIncomeValue(resource,produced);
          adjustAvailableValue(resource,produced);
          showDebug(key+": Adding Values for " + resource + ":" + produced , "incomeValues");
        }
        for (rKey in data.buildings[key].consumeType){
          //remove resources used 
          var resource = building.consumeType[rKey];
          var forOne = building.consumeRate[rKey]/(building.produces[0] + player.bonuses.production[key]);
          showDebug(key+ ": ToCraftOne:" + forOne + " consumed:" + forOne * produced,"incomeValues");
          adjustAvailableValue(resource, ( forOne * produced) * -1 );
        }
      } else if (getBuildingColor(key) == "green") {
        //Green Border Buildings
        var bTotal = 0;
        var maxBonus = 0;
        //Add up all bonus percents
        for (bonusKey in bonusPercent){
          bTotal += bonusPercent[bonusKey];
          maxBonus += 1;
        }
        var baseConsumed = 0;
        for (rKey in building.produces){
          var resource = data.buildings[key].producesType[rKey];
          var base = (building.produces[rKey] + player.bonuses.production[key]) * player.buildingsPurchased[key];
          var maxProduction = base + base * maxBonus;
          if (supplyPercent == 0 || demandedResources[resource] <= 0 || player.buildingsPurchased[key] == 0) {
            showDebug(key+": Not enough of something. setting to default","incomeValues");
            adjustIncomeValue(resource,0);
            adjustAvailableValue(resource,0);
            if (player.buildingsPurchased[key] > 0 ) {
              adjustMaxValue(resource, maxProduction);
            } else {
              adjustMaxValue(resource, 0);
            }
            break;
          }
          var reqBase = demandedResources[resource]/(supplyPercent + supplyPercent * bTotal);
          var currentMax = base * supplyPercent;
          if (currentMax > reqBase) {
            baseConsumed = reqBase;
          } else {
            baseConsumed = currentMax
          }
          var produced = baseConsumed  + (baseConsumed * bTotal);
          adjustIncomeValue(resource,produced);
          adjustAvailableValue(resource,produced);
          adjustMaxValue(resource, maxProduction);
          showDebug(key+": "+ resource + "supplyPercent:" + supplyPercent + " bTotal: " + bTotal, "incomeValues");
          showDebug(key+": Adding Production Values for " + resource + ":" + produced , "incomeValues");
          
        }
        for (rKey in building.consumeType){
          var resource = building.consumeType[rKey];
        //remove resources used 
          if (isRequiredResource(key,resource) ) {
            showDebug(key+": t[resource]:" + supplyPercent+"  bTotal:" + bTotal,"incomeValues");
            var consumed = baseConsumed * (building.consumeRate[rKey]/(building.produces[0] + player.bonuses.production[key]));
            adjustAvailableValue(resource, consumed * -1);
            showDebug(key+": Removing Consume Resource " + resource + ":" + consumed * -1 , "incomeValues");
          } else {
            if (baseConsumed > 0 ) {
              adjustAvailableValue(resource, (building.consumeRate[rKey] * player.buildingsPurchased[key] * t[resource]) * -1 );
              showDebug(key+": Removing Consume Resource " + resource + ":" + (building.consumeRate[rKey] * player.buildingsPurchased[key] * t[resource]) * -1 , "incomeValues");
            }
          }
        }
      } else {
        //Black Border Buildings
        var usageTotals = {};
        for (rKey in building.produces){
          var resource = building.produces[rKey];
          var demandToMeet = demandedResources[resource];
          var base = (building.produces[rKey] + player.bonuses.production[key]) * player.buildingsPurchased[key];
          for (pKey in t) {
            var produced = 0;
            if (demandToMeet > 0) {
              var demandMet = (base * t[pKey]) / demandToMeet;
              if (demandMet > 1 ) {
                demandMet = 1;
              }
              produced = demandToMeet * demandMet;
              if (productionTotals[pKey] == undefined ) {
                productionTotals[pKey] = 0;
              }
              productionTotals[pKey] += produced;
              demandToMeet -= produced;
                  
            }
            adjustIncomeValue(resource,produced);
            adjustAvailableValue(resource,produced);
            adjustMaxValue(resource, base);
            showDebug(key+": Adding Values for " + resource + ":" + produced , "incomeValues");
          }
        }
        for (var rKey in building.consumeType) {
          var resource = building.consumeType[rKey];
  ///////will need to fix this if i add secondary outputs to refiner/consumer  \/      /////////////
          var amountForOne = building.consumeRate[rKey]/building.produces[0];
          adjustAvailableValue(resource, (amountForOne * usageTotals[resource]) * -1);
        }
      }
    }
  }
}
//unused ???
function getConsumeRate(building,resource) {
  return data.buildings[building].consumeRate[data.buildings[building].consumeType.indexOf(resource)];
}

function isRequiredResource(building,resource) {
  if (data.buildings[building].requires[0] == "All") {
    return true;
  }
  for (var key in data.buildings[building].requires) {
    if (data.buildings[building].requires[key] == resource) {
      return true;
    }
  }
  return false;
}
function getTotalBonus(key){
  return data.buildings[key].consumeType.length - data.buildings[key].requires.length;
}
function getAllDemands(){
  bonusDemandedResources = {};
  demandedResources = {};
  //set demand from population
  for (var tkey in buildingTypes["consumer"]) {
    var key = buildingTypes["consumer"][tkey];
    var resource = data.buildings[key].producesType[0];
    if (player.buildingsPurchased[key] > 0 ) {
      if (key != "lab" || player.research.current != "none") {
        if (getBuildingColor(key) == "green") {
          demandedResources[resource] = ((player.buildingsPurchased[key] * (data.buildings[key].produces[0] + player.bonuses.production[key])) * getTotalBonus(key))*(player.adjustPercent[key]/100);
        } else {
          demandedResources[resource] = (player.buildingsPurchased[key] * (data.buildings[key].produces[0] + player.bonuses.production[key]))*(player.adjustPercent[key]/100);
        }
      } else {
        demandedResources[resource] = 0;
      }
    } else {
      demandedResources[resource] = 0;
    }
  }
  //get demand from consumers/refiners
  var workTypes = ["consumer","refiner"]
  for (var tKey in workTypes) {
    var buildingType = workTypes[tKey];
    for (var bKey in buildingTypes[buildingType]) {
      var key = buildingTypes[buildingType][bKey];
      var building = data.buildings[key];
      if (building.requires != undefined ) {
        if (building.requires[0] == "All") {
        //red buildings
          //check each material it consumes
          for (var rKey in building.consumeType) {
            var resource = building.consumeType[rKey];
            //initialize the resource if it doesnt exist
            if (demandedResources[resource] == undefined) {
              demandedResources[resource] = 0;
            }
            //set the demand
            buildingStats[key].demanding[resource] = building.consumeRate[rKey] * player.buildingsPurchased[key];
            var demand = demandedResources[building.producesType[0]] * ( building.consumeRate[rKey] / (building.produces[0] + player.bonuses.production[key]))
            buildingStats[key].demandingForSupply[resource] = demand;
            demandedResources[resource] += demand;
            showDebug(key+": Adding Demand for " + resource + ":" + demand, "demand" );
          }
        } else {
        // green buildings
          var appliedBonus = 1;
          //check each material it consumes for max bonus available
          for (var rKey in building.consumeType) {
            var resource = building.consumeType[rKey];
            //check if its required
            if (!isRequiredResource(key,resource) ){
              //check if there are available materials for the bonus
              if (availableResources[resource] != undefined ) {
                //add to max bonus if there are
                if (player.buildingsPurchased[key] > 0 ) {
                  var bonusAmt = availableResources[resource] / (building.consumeRate[rKey] * player.buildingsPurchased[key]);
                  if (bonusAmt > 1) {
                    bonusAmt = 1;
                  }
                  appliedBonus += bonusAmt
                }
              }
            }
          }
          for (var rKey in building.consumeType){
            var resource = building.consumeType[rKey];
            var toCraft1 =  building.consumeRate[rKey] / (building.produces[0] + player.bonuses.production[key]);
            //amountNeededTotal / bonus =  baseRequired
            //initialize the resource if it doesnt exist
            if (demandedResources[resource] == undefined) {
              demandedResources[resource] = 0;
            }
            if (isRequiredResource(key,resource) ) {
              buildingStats[key].demanding[resource] = building.consumeRate[rKey] * player.buildingsPurchased[key];
              var demand = ((demandedResources[building.producesType[0]]/(getTotalBonus(key)+1)) * toCraft1 ) / appliedBonus;
              buildingStats[key].demandingForSupply[resource] = demand;
              demandedResources[resource] += demand;
              showDebug(key+": Adding Demand for " + resource + ":" + (demandedResources[building.producesType[0]] * toCraft1 ) / appliedBonus, "demand" );
            } else {
              buildingStats[key].demanding[resource] = building.consumeRate[rKey] * player.buildingsPurchased[key];
              var demand = (demandedResources[building.producesType[0]]/(getTotalBonus(key)+1)) * toCraft1
              buildingStats[key].demandingForSupply[resource] = demand;
              demandedResources[resource] += demand;
              showDebug(key+": Adding Demand for " + resource + ":" + player.buildingsPurchased[key] * building.consumeRate[rKey], "demand" );
            }
          }
        }
      }
    }
  } 
 //finalize
  showDebug(demandedResources, "demand");
  
}
//