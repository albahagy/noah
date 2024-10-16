import { config } from 'dotenv'
import express from 'express'
import path from 'path'
import { bootstrap } from './src/bootstrap.js'

config({ path: path.resolve('config/.env') })

import admin from 'firebase-admin';
import serviceAccount from './noah-iptv-ff8c3-firebase-adminsdk-pa1vo-c94c4da0c0.json' assert { type: 'json' };
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function sendNotificationToAll(title, body, screen) {
  const message = {
    notification: {
      title: title,
      body: body
    },
    data: {
      click_action: 'FLUTTER_NOTIFICATION_CLICK', // This is necessary for handling notifications in Flutter
      screen: screen // Custom data to determine where to navigate in the Flutter app
    },
    topic: 'all', // This is the topic name that all devices should be subscribed to
  };

  admin.messaging().send(message)
    .then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
}


import fs from "fs";
import cors from 'cors';
import { log } from 'console'
const app = express();
app.use(cors());

app.get('/download-apk', (req, res) => {
  console.log(req);
  
  // const filePath = path.join(__dirname, 'public', 'app-armeabi-v7a-release.apk');
  // res.download(filePath, 'your-app.apk', (err) => {
  //     if (err) {
  //         console.error('Error occurred while downloading APK:', err);
  //         res.status(500).send('Error occurred while downloading APK');
  //     }
  // });
});



const port = process.env.PORT

//handel multer uploads file 
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));




bootstrap(app, express, sendNotificationToAll)







app.listen(port, () => console.log(`Example app listening on port ${port}!`))