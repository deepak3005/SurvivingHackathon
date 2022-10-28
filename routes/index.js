var express = require('express');
var router = express.Router();

const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');
require('dotenv').config()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Deepak test case' });
});








const createContainerButton = document.getElementById("create-container-button");
const deleteContainerButton = document.getElementById("delete-container-button");
const selectButton = document.getElementById("select-button");
const fileInput = document.getElementById("file-input");
const listButton = document.getElementById("list-button");
const deleteButton = document.getElementById("delete-button");
const status = document.getElementById("status");
const fileList = document.getElementById("file-list");

const reportStatus = message => {
    status.innerHTML += `${message}<br/>`;
    status.scrollTop = status.scrollHeight;
}

// Update <placeholder> with your Blob service SAS URL string
const blobSasUrl = "PLACE THE KEY HERE";

// RAMAN KEY -> https://resume01storage.blob.core.windows.net/?sv=2021-06-08&ss=b&srt=sco&sp=rwdlaciytfx&se=2022-10-29T18:29:00Z&st=2022-10-28T06:16:20Z&spr=https&sig=MTbLa9L7v%2FUWhDCOe7GK6EtJlI7JBMtWaqGjq%2FrQIog%3D
const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=resume01storage;AccountKey=cjPmz/o51SAD19fPOj6I+zlfU+qRbw0tc2w8ifJ1y+ftv0UyvSqAhDhTcXGEFFfT5JJWdKOKvCun+AStepSGKQ==;EndpointSuffix=core.windows.net";
// const blobServiceClient = BlobServiceClient.fromConnectionString(
//       AZURE_STORAGE_CONNECTION_STRING
//     );
// Create a new BlobServiceClient
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

// Create a unique name for the container by 
// appending the current time to the file name
const containerName = "container" + new Date().getTime();

// Get a container client from the BlobServiceClient
const containerClient = blobServiceClient.getContainerClient(containerName);

const createContainer = async () => {
    try {
        reportStatus(`Creating container "${containerName}"...`);
        await containerClient.create();
        reportStatus(`Done. URL:${containerClient.url}`);
    } catch (error) {
        reportStatus(error.message);
    }
};

const deleteContainer = async () => {
    try {
        reportStatus(`Deleting container "${containerName}"...`);
        await containerClient.delete();
        reportStatus(`Done.`);
    } catch (error) {
        reportStatus(error.message);
    }
};

createContainerButton.addEventListener("click", createContainer);
deleteContainerButton.addEventListener("click", deleteContainer);

const listFiles = async () => {
    fileList.size = 0;
    fileList.innerHTML = "";
    try {
        reportStatus("Retrieving file list...");
        let iter = containerClient.listBlobsFlat();
        let blobItem = await iter.next();
        while (!blobItem.done) {
            fileList.size += 1;
            fileList.innerHTML += `<option>${blobItem.value.name}</option>`;


            blobItem = await iter.next();
        }
        if (fileList.size > 0) {
            reportStatus("Done.");
        } else {
            reportStatus("The container does not contain any files.");
        }
    } catch (error) {
        reportStatus(error.message);
    }
};

listButton.addEventListener("click", listFiles);


const uploadFiles = async () => {
    try {
        reportStatus("Uploading files...");
        const promises = [];
        for (const file of fileInput.files) {
            const blockBlobClient = containerClient.getBlockBlobClient(file.name);
            promises.push(blockBlobClient.uploadBrowserData(file));
        }
        await Promise.all(promises);
        reportStatus("Done.");
        listFiles();
    }
    catch (error) {
            reportStatus(error.message);
    }
}

selectButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", uploadFiles);


const deleteFiles = async () => {
    try {
        if (fileList.selectedOptions.length > 0) {
            reportStatus("Deleting files...");
            for (const option of fileList.selectedOptions) {
                await containerClient.deleteBlob(option.text);
            }
            reportStatus("Done.");
            listFiles();
        } else {
            reportStatus("No files selected.");
        }
    } catch (error) {
        reportStatus(error.message);
    }
};

deleteButton.addEventListener("click", deleteFiles);





// async function main() {
//     console.log('Azure Blob storage v12 - JavaScript quickstart sample');

//     // Quick start code goes here

//     const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=resume01storage;AccountKey=cjPmz/o51SAD19fPOj6I+zlfU+qRbw0tc2w8ifJ1y+ftv0UyvSqAhDhTcXGEFFfT5JJWdKOKvCun+AStepSGKQ==;EndpointSuffix=core.windows.net";
// //   process.env.AZURE_STORAGE_CONNECTION_STRING;

// if (!AZURE_STORAGE_CONNECTION_STRING) {
//   throw Error("Azure Storage Connection string not found");
// }



// // Create the BlobServiceClient object which will be used to create a container client
// const blobServiceClient = BlobServiceClient.fromConnectionString(
//     AZURE_STORAGE_CONNECTION_STRING
//   );
  
//   // Create a unique name for the container
// //   const containerName = "ram" + uuidv1();
  
//   console.log("\nCreating container...");
// //   console.log("\t", containerName);
  
//   // Get a reference to a container
//   const containerClient = blobServiceClient.getContainerClient("container1666937875927"); // BRO PUT THE SPECIFIC OF THE CONTAINER HERE
//   // Create the container
// //   const createContainerResponse = await containerClient.create();
//   console.log(`Container was created successfully.\n\trequestId:\n\tURL: ${containerClient.url}`);

//   // Create a unique name for the blob
// const blobName = "quickstart" + uuidv1() + ".txt";

// // Get a block blob client
// const blockBlobClient = containerClient.getBlockBlobClient(blobName);

// // Display blob name and url
// console.log(`\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`);

// // Upload data to the blob
// const data = "Hello, World!";
// const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
// console.log(`Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`);



// console.log("\nListing blobs...");

// // List the blob(s) in the container.
// for await (const blob of containerClient.listBlobsFlat()) {

//   // Get Blob Client from name, to get the URL
//   const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);

//   // Display blob name and URL
//   console.log(`\n\tname: ${blob.name}\n\tURL: ${tempBlockBlobClient.url}\n`);
// }


// // Get blob content from position 0 to the end
// // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
// // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
// const downloadBlockBlobResponse = await blockBlobClient.download(0);
// console.log("\nDownloaded blob content...");
// console.log(
//   "\t",
//   await streamToText(downloadBlockBlobResponse.readableStreamBody)
// );


// // Convert stream to text
// async function streamToText(readable) {
//     readable.setEncoding('utf8');
//     let data = '';
//     for await (const chunk of readable) {
//       data += chunk;
//     }
//     return data;
//   }



// }

// main()
// .then(() => console.log('Done'))
// .catch((ex) => console.log(ex.message));





module.exports = router;