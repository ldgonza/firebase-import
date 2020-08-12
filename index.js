const buckets = require('./buckets.js');
const propertiesReader = require('properties-reader');
const firestoreService = require('firestore-export-import');
const fs = require('promise-fs');

let properties = propertiesReader('application.properties');
let serviceAccountPath = properties.get('service.account.path');
let databaseUrl = properties.get('database.url');
let chunkSize = properties.get('chunk.size');
let bucketName = properties.get('bucket.name');
let bucketPrefix = properties.get('bucket.prefix');
let bucketDelimiter = properties.get('bucket.delimiter');

// Process
const appName = '[DEFAULT]';
const serviceAccount = require(serviceAccountPath);
firestoreService.initializeApp(serviceAccount, databaseUrl, appName);

async function processFile(f){
  console.log("Restoring " + f.name);
  let contents = await f.download();
  await firestoreService.restore(JSON.parse(contents));
  console.log("Done restoring " + f.name);
  
  console.log("Deleting " + f.name);
  await f.delete();
  console.log("Done Deleting " + f.name);
}

async function processFiles(files){
  let promises = files.map(processFile);
  await Promise.all(promises);
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

  // let file = files[0];
  // console.log((await file.download()) + "");
  // await file.delete();
  //    console.log("file err: "+err);  
  //    console.log("file data: "+contents);   
  // });
  
//x  console.log(await files[0].get())


  // let  files = await fs.readdir(fileDir);
  // let chunks = chunkArray(files, chunkSize);
  // for(let chunk of chunks) {
  //   await processFiles(chunk);
  // }
}
start();
