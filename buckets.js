/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();


//listFilesByPrefix().catch(console.error);

module.exports.listFilesByPrefix = async (bucketName, maxResults=null, prefix='', delimiter='') => {
  const options = {
    prefix: prefix,
  };

  if (delimiter) {
    options.delimiter = delimiter;
  }

  if(maxResults) {
    options.maxResults = maxResults;
  }

  // Lists files in the bucket, filtered by a prefix
  let [files] = await storage.bucket(bucketName).getFiles(options);
  return files;
  // console.log('Files:');
  // files.forEach(file => {
  //   console.log(file.name);
  // });
};

