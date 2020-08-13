const buckets = require('./buckets.js');
const propertiesReader = require('properties-reader');
const firestoreService = require('firestore-export-import');
const fs = require('promise-fs');

let properties = propertiesReader('application.properties');
let serviceAccountPath = properties.get('service.account.path');
let chunkSize = properties.get('chunk.size');
let bucketName = properties.get('bucket.name');
let bucketPrefix = properties.get('bucket.prefix');
let bucketDelimiter = properties.get('bucket.delimiter');
let parallel = properties.get('process.parallel');

// Process
const appName = '[DEFAULT]';
const serviceAccount = require(serviceAccountPath);

firestoreService.initializeApp(serviceAccount, databaseUrl, appName);

async function processFile(f){
  console.log("Restoring " + f.name);
  let contents = await f.download();
  let result = await firestoreService.restore(JSON.parse(contents));

  if (typeof result === "undefined" || result.status !== true){
    console.log("Error restoring file! " + f.name);
    throw new Error("Error restoring file! " + f.name);
  }

  console.log("Done restoring " + f.name);
  console.log("Deleting " + f.name);
  await f.delete();
  console.log("Done Deleting " + f.name);
}

async function processFiles(files){
  if(parallel === "true"){
    let promises = files.map(processFile);
    await Promise.all(promises);
    return;
  }

  for(let file of files) {
    await processFile(file);
  }
}

// -------------------------------------

async function start() {
  let files;
  let finish = false;
  do {
    files = await buckets.listFilesByPrefix(bucketName, chunkSize, bucketPrefix, bucketDelimiter);
    if(files.length > 0) {
      await processFiles(files).catch(e => {
        console.log(e);
        finish = true;
      });
    }

    if(finish)
      console.log("Error detected! not fetching any more files");
  } while (! finish && (files.length > 0));
}
start();
