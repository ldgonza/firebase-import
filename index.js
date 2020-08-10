const propertiesReader = require('properties-reader');
const firestoreService = require('firestore-export-import');
const fs = require('promise-fs');

let properties = propertiesReader('application.properties');

let file = properties.get('file.path');
let serviceAccountPath = properties.get('service.account.path');
let databaseUrl = properties.get('database.url');
let chunkSize = properties.get('chunk.size');

// Process
const appName = '[DEFAULT]';
const serviceAccount = require(serviceAccountPath);
firestoreService.initializeApp(serviceAccount, databaseUrl, appName);

let fileDir = properties.get('file.dir');
async function start() {
  let  files = await fs.readdir(fileDir);
  let chunks = chunkArray(files, chunkSize);
  for(let chunk of chunks) {
    await processFiles(chunk);
  }
}

async function processFiles(files){
  let promises = files.map(async f => {
    console.log("Restoring " + f);
    await firestoreService.restore(file);
    console.log("Done restoring " + f);
  });
  await Promise.all(promises);
}

function chunkArray(myArray, chunk_size){
    var results = [];
    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }
    return results;
}

start();
