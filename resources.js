function doResearchTick() {
  if (player.research.current != "none" {
    //increment their current points twards their research.
    player.research.currentPoints += player.research.income;
    //check if it is enough to complete the research
    if (player.research.currentPoints > researchList[player.research.current].value) {
      //set current research to queued research
      if (player.research.queued != "none") {
        player.research.current = player.research.queued;
        player.research.currentPoints = 0;
        player.research.queued = "none";
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
  researchLabel: {
    name: "name",
    value: 120,
    unlockedBy: "default"
  }
}