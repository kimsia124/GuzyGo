// routes/index.js

// [PACKAGE CONFIGURE]

var cameraOptions = {
  width : 600,
  height : 420,
  mode : 'timelapse',
  awb : 'off',
  encoding : 'jpg',
  output : 'images/camera.jpg',
  q : 100,
  timeout : 10000,
  timelapse : 0,
  nopreview : true,
  th : '0:0:0'
};

// [LOAD PACKAGE]
const camera = require('raspicam')(cameraOptions);
const express = require('express');

const router = express.Router();

// [CONST VALUE]
let img_flag = 0 ;
camera.start() ;

camera.on('exit', function() {
  camera.stop() ;
  console.log('Restart camera') ;
  camera.start() ;
});

camera.on('read', function() {  
  img_flag = 1 ;
});
module.exports = (app) => {

  app.get('/cam', function(req, res) {
    res.sendfile('/home/pi/GuzyGo/public/cam.html') ;
  }) ;

  app.get('/img', function (req, res) {
    console.log('get /img') ;
    if (img_flag == 1) {
        img_flag = 0 ;
        res.sendfile('images/camera.jpg') ;
      }
    });

  return router;
}