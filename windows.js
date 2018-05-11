
function getWindowSize(){
  var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;
      var size = [x,y];
      return size;
}
function resizeWindows(){
  var size = getWindowSize();
  var wrapperWidth = size[0] * .95;
  var fullWidth = wrapperWidth - 2;
  var buildingWidth = wrapperWidth * .27 - 2;
  var windowWidth = wrapperWidth * .73 - 2;
  var valueWidth = wrapperWidth * .35 - 2;
  var logoWidth = wrapperWidth * .65 - 2;
  document.getElementById("wrapper").style.width = wrapperWidth + "px";
  document.getElementById("window").style.height = (size[1] - 210) + "px";
  //document.getElementById("buildingsContainer").style.height = (size[1] - 210) + "px";
  document.getElementById("buildings").style.height = (size[1] - 210) + "px";
  document.getElementById("logo").style.width = logoWidth + "px";
  document.getElementById("values").style.width = valueWidth + "px";
  document.getElementById("topbar").style.width = windowWidth + "px";
  document.getElementById("buildingsContainer").style.width = buildingWidth + "px";
  document.getElementById("window").style.width = windowWidth + "px";
  var bList = document.getElementsByClassName("building");
  for (var k in bList){
    if (bList.hasOwnProperty(k)) {
         bList[k].style.width = buildingWidth + "px";
    }
  } 
}
function updateMainWindow() {
  var str = "unused"
  document.getElementById('window').innerHTML = str;
}
function updateResourceInfo() {
    var str = ""
    if (currentWindow != "supply") {
    str += "<div id='resourceTable'></div>";
    document.getElementById("window").innerHTML = str;
    }
    str = "<h2>Building Demands</h2><table><tr><th>Resource</th><th>Supply</th><th>Demand</th><th>Unused</th><th>Max</th></tr>"
    for (var rKey in incomeValues) {
      str += "<tr><td class='noCenter'>" + formatResourceName(rKey) + "</td>  "; 
      str += "<td>" + formatCustomNumber(incomeValues[rKey]) + "</td>";
      str += "<td>" + formatCustomNumber(demandedResources[rKey]) +"</td>";
      if (popDemand.type.indexOf(rKey) > -1) {
        str += "<td>" + formatCustomNumber(player.storedResources[rKey]) + "</td>";
      } else {
        str += "<td>" + formatCustomNumber(availableResources[rKey]) + "</td>";
      }
      str += "<td>" + formatCustomNumber(maxResourcesAble[rKey]) + "</td></tr>";
    }
    str += "</table><h2>Population Demands</h2><table><tr><th>Resource</th><th>Supply</th><th>Demand</th><th>Met/Unmet</th><th>Income</th><th>Stored</th></tr>";
  for (var rKey in popDemand.type) {
    var resource = popDemand.type[rKey];
    if (resource != "Research") {
      var unmet = incomeValues[resource] - popDemand.amount[rKey]*player.population;
      str += "<tr><td>" + formatResourceName(resource) + "</td>  "; 
      str += "<td>" + formatCustomNumber(incomeValues[resource]) + "</td>  "; 
      str += "<td>" + formatCustomNumber(popDemand.amount[rKey] * player.population) + "</td>  ";
      str += "<td>" + formatCustomNumber(unmet) + "</td>  ";
      str += "<td>" + formatCustomNumber(player.incomes[resource]) + "</td>  ";
      str += "<td>" + formatCustomNumber(player.storedResources[resource]) + "</td></tr>";
    }
  }
  str += "</table>";
    document.getElementById('resourceTable').innerHTML = str;
}
function updateResearchWindow(){
  var availableResearches = getAvailableResearch();
  var strProgression = "<h3>Progression Upgrages</h3>";
  var strSupplier = "<h3>Supplier Upgrages</h3>";
  var strRefiner = "<h3>Refiner Upgrades</h3>";
  var strProducer = "<h3>Producer Upgrades</h3>";
  var strPopulation = "<h3>Population Upgrades</h3>";
  var strCompleted = "<h3>Completed Upgrades - Not showing yet</h3>";
  var str = ""
  if (currentWindow != "research") {
    str += "<div class='researchSectionl'>";
    str += "<div id='rProducer'></div>";
    str += "<div id='rSupplier'></div>";
    str += "<div id='rPopulation'></div></div>";
    str += "<div class='researchSectionr'>";
    str += "<div id='rRefiner'></div>";
    str += "<div id='rProgession'></div>";
    str += "</div><div class='clear'></div>";
    str += "<div id='rCompleted' class='researchSectionb'></div>";
    document.getElementById("window").innerHTML = str;
    currentWindow = "research";
  }
  for (r in availableResearches) {
    var res = researchList[availableResearches[r]];
    var buttonText = "Begin Research";
    var buttonFunction = "changeResearch('" + availableResearches[r] + "')";
    if (player.research.current == availableResearches[r]) {
      buttonText = "Cancel Research";
      buttonFunction = "cancelResearch('" + availableResearches[r] + "')";
    } else if (player.research.current != "none" && player.research.queued == "none") {
      buttonText = "Add to Queue";
      buttonFunction = "changeResearch('" + availableResearches[r] + "')";
    }else if (player.research.queued == availableResearches[r]) {
      buttonText = "Remove from Queue";
      buttonFunction = "cancelResearch('" + availableResearches[r] + "')";
    }else if (player.research.current != "none" && player.research.queued != "none") {
      buttonText = "Swap to Queue";
      buttonFunction = "changeResearch('" + availableResearches[r] + "')";
    }
    var pointsNeeded = getPointsNeededTotal(availableResearches[r]);
    var tStr = "<div class='researchInfo'>" +
                    "<div>" + res.name + "</div>" +
                    "<div>" + res.description + "</div>" +
                    "<div> Points needed: " + formatCustomNumber(pointsNeeded) + "</div>" +
                    "<button onclick=\"" + buttonFunction + "\">" + buttonText + "</button>" +
                    "</div>";
    switch(res.type) {
      case "progression":
        strProgression += tStr;
        break;
      case "supplier":
        strSupplier += tStr;
        break;
      case "refiner":
        strRefiner += tStr;
        break;
      case "producer":
        strProducer += tStr;
        break;
      case "population": 
        strPopulation+= tStr;
        break;
      default:
        console.log("HMM.. got a bad setup on research?!?! - " + availableResearches[r]);
    }
  }
  document.getElementById('rProgession').innerHTML = strProgression;
  document.getElementById('rSupplier').innerHTML = strSupplier;
  document.getElementById('rRefiner').innerHTML = strRefiner;
  document.getElementById('rProducer').innerHTML = strProducer;
  document.getElementById('rPopulation').innerHTML = strPopulation;
  
}
function updateBuildingInfo(key) {
  var building = data.buildings[key]
  var str = "<h1> " + building.name + "</h1>" +
  "<h2> Produces </h2>" +
  "<table><tr><th>Resource</th><th>Base</th><th>With Bonus</th></tr>";
  for (var r in building.producesType) {
    str += "<tr><td>"+building.producesType[r]+"</td><td>"+building.produces[r]+"</td><td>"+ (building.produces[r] + player.bonuses.production[key]) +"</td></tr>";
  }
  str +="</table>";
  if (building.buildingType != "producer") {
    str += "<h2> Consumes </h2>" +
    "<table><tr><th>Resource</th><th>Amount</th><th>Required</th><th>Max Needed</th><th>Demanding From Supply</th><th>Supply Percent</th></tr>";
    for (var r in building.consumeType) {
      var resource = building.consumeType[r];
      str += "<tr><td>"+resource+"</td><td>"+building.consumeRate[r]+"</td>";
      if (isRequiredResource(key,resource)){
        str += "<td>Yes</td>";
      } else {
        str += "<td>No</td>";
      }
      str += "<td>" + formatCustomNumber(buildingStats[key].demanding[resource]) + "</td>" + 
      "<td>" + formatCustomNumber(buildingStats[key].demandingForSupply[resource]) + "</td>" + 
      "<td>" + (Math.round(buildingStats[key].supplyPercent[resource] * 10000)/100) + "%</td></tr>";
    }
    str += "</table>";
  }
  str += "<p>Production Bonus: " + player.bonuses.production[key];
  if (building.buildingType == "consumer") {
    var b = popDemand.value[getPopKey(building.producesType[0])];
    var bon = b * player.bonuses.sellPrice[building.producesType[0]];
    str += "<br>Sell Price Base: " + b;
    str += "<br>Sell Price Bonus: " + bon;
    str += "<br>Sell Price Total: " + (b + bon);
  }
  str += "</p>";
  document.getElementById("window").innerHTML = str;
}
function updatePriorities() {
  var tables = ["consumer","refiner"];
  var str = ""
  for (var typeKey in tables) {
    var bType = tables[typeKey];
    if (bType == "consumer"){
      str += "<h2>Suppliers</h2>";
    } else {
      str += "<h2>Refiners</h2>";
    }
    str += "<table><tr><th>Priority</th><th>Building</th><th>Adjust</th><th>Percent</th></tr>";
    for (bKey in buildingTypes[bType]) {
      var key = buildingTypes[bType][bKey];
      var building = data.buildings[key];
      str += "<tr><td>" + (Number(bKey)+1) + "</td> <td>" + building.name + "</td><td>";
      if (bKey > 0) {
        str += "<button onClick='changeBuildingPriority(\"" + key + "\",\"up\")'>/\\</button>";
      }
      if (bKey < buildingTypes[bType].length - 1) {
        str += "<button onClick='changeBuildingPriority(\"" + key + "\",\"down\")'>\\/</button>";
      }
      str += "</td><td><input id='percent" + key + "' type='text' name='Supply Percent' value='"+player.adjustPercent[key]+"'>";
      str += "<button onClick='setSupplyPercent(\""+key+"\")'>Set</button></td></tr>"
    }
    str += "</table>";
  }
  document.getElementById("window").innerHTML = str;
}
function changeWindow(w){
  if (w == "research") {
    updateResearchWindow();
  } else if (w == "info") {
    document.getElementById("window").innerHTML = "<h2>Description:</h2>"+
    "<p>By processing materials through a crafting line, you are able to supply a population with "+
    "demanded neccesities. The population pays you for your supplies which allows you to purchase more. However, the population will only pay for "+
    "the supplies they are demanding, so You will also need to supply them with alot of excess food to promote population growth. Maintaining a balance "+
    "of supply vs demand in this game is important, as many buildings share resource requirements. One building type may consume all of that resource "+
    "before the next type has a chance to recieve any.</p> "+
    "<h2>Starting Guide </h2> "+
    "<p> Begin by purchasing a Hardware Store in the suppliers tab to the right. This will create a demand for this resource. If you check the 'Resource Info'  "+
    "Tab, you will notice that there are now demands on several of the resources.</p> "+
    "<p> You can check what the building requires by clicking on the 'Info' button in the building list. This info screen shows how much the building produces, "+
    "as well, how much it consumes.</p>"+
    "<p>To supply the production of Tools, you will need Shaped Metal and Lumber. So purchase a Metalworks and a Lumbermill. The Metalworks requires " +
    "40 Metal Ore, so you will need to buy 2 Metal Mines. The Lumbermill requires 30 Wood, so you will need to buy 3 Lumbermills. Once you have these, "+
    "You will notice you are gaining income at the top left in the 'Info Panel'. Continue buying enough Metalworks, Lumbermills, Metal Mines, and Logging Camps "+
    "to max out the production of the Hardware Store. (Pointer: You can spam the '$$Clicker$$' button to gain free money per click.)</p>";
  } else if (w == "changelog") {
    document.getElementById("window").innerHTML = '<object type="text/html" width="100%" height="100%" data="changelog.html" ></object>';
  } else if (w == "main") {
    updateMainWindow();
  } else if (w == "supply") {
    updateResourceInfo();
  } else if (w == "flow") {
    document.getElementById("window").innerHTML = "<img src='materialFlow.png' alt='Crafting Flow' style='width:100%' align='middle'>";
  } else if (w == "building") {
    updateBuildingInfo(buildingInfoID);
  } else if (w == "priorities") {
    updatePriorities();
  }
  currentWindow = w;
    
}

function refreshMoney() {
  document.getElementById("money").innerHTML = "Money: " + formatCustomNumber(player.money) + 
    "  +" + formatCustomNumber(player.income) + "/tick";  
}
function refreshResearch() {
  var str = "0 / 0";
  var name = "Researching: Nothing";
  
  if (player.research.current != "none") {
    var r = researchList[player.research.current];
    var pointsNeeded = getPointsNeededTotal(player.research.current);
   
    str = formatCustomNumber(player.research.currentPoints) + " / " + formatCustomNumber(pointsNeeded);
    name = "Researching: " + researchList[player.research.current].name;
  }
  document.getElementById("researchpoints").innerHTML = "Research: " + str +  
    "  +" + formatCustomNumber(player.research.income) + "/tick"; 
  document.getElementById("researchcurrent").innerHTML = name;
  if (hasResearch("queuing") ){
    if (player.research.queued != "none") {
      document.getElementById("researchqueued").innerHTML = "Queued Research: " + researchList[player.research.queued].name;
    } else {
      document.getElementById("researchqueued").innerHTML = "Queued Research: Nothing";
    }
  } else {
    document.getElementById("researchqueued").innerHTML = "Queued Research: Locked";
  }
}
function refreshPopulation() {
  document.getElementById("population").innerHTML = "Population: " + formatCustomNumber(player.population) + 
    "  +" + formatCustomNumber(player.populationGrowth) + "/tick"; 
}
function showBuildings(t) {
  for (var tier in data.buildings) {
    //console.log("showBuildings: Testing " + tier); 
    if (t == "all") {
      document.getElementById(tier).style.display = "block";
    } else {
      if (data.buildings[tier].buildingType == t) {
        document.getElementById(tier).style.display = "block";
      } else {
        document.getElementById(tier).style.display = "none";
      }
    }
  }
}
function showBuildingStats(t) {
  document.getElementById("window").innerHTML = '<object type="text/html" width="100%" height="100%" data="buildingStats.html" ></object>';
}
  