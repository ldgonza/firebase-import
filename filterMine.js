function getNumber(file) {
  let name = file.name.split("/").pop();
  let number = name.split(".")[0];
  return parseInt(number);
}

// Return true if the number matches "number = iteration * totalSlots + mySlot", for some iteration number
function isMine(number, mySlot, totalSlots){
  let dist = number - mySlot;
  let mod = dist % totalSlots;
  return mod === 0;
}

// Return batchSize number of files that match mySlot
function filterMine(files, mySlot, totalSlots, batchSize){
  let mine = [];

  for(let file of files){
    let number = getNumber(file);
    if(isMine(number, mySlot, totalSlots)){
      mine.push(file);
    }

    if(mine.length === batchSize){
      return mine;
    }
  }

  return mine;
}

module.exports = filterMine;
