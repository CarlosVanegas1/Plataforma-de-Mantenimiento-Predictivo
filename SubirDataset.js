const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert('path/to/your/serviceAccountKey.json'),
  storageBucket: 'casvamantenimiento-de348.appspot.com'
});

const bucket = admin.storage().bucket();

// Ruta al archivo CSV
const filePath = './Dataset_main.csv';
const destination = 'datasets/machine_data.csv'; // Ruta en Firebase Storage

async function uploadFile() {
  await bucket.upload(filePath, {
    destination: destination,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });

  console.log(`${filePath} uploaded to ${destination}`);
}

uploadFile().catch(console.error);
