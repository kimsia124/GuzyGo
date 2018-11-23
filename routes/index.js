// routes/index.js

// [PACKAGE CONFIGURE]

const cameraOptions = {
  width : 600,
  height : 420,
  mode : 'photo',
  awb : 'off',
  encoding : 'jpg',
  output : './images/camera.jpg',
  q : 100,
};

// [LOAD PACKAGE]
const camera = require('raspicam')(cameraOptions);
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const request = require('request');
const express = require('express');

const router = express.Router();

// [CONST VALUE]

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
    res.sendfile('cam.html', {root : __dirname}) ;
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