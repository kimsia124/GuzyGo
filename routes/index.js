// routes/index.js

// [PACKAGE CONFIGURE]

const cameraOptions = {
  width : 600,
  height : 420,
  awb : 'off',
  encoding : 'jpg',
  output : 'images/camera.jpg',
  q : 100,
  timeout : 10000,
  nopreview : true,
  th : '0:0:0'
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

module.exports = (app) => {
  camera.on('exit', function() {
    camera.stop();
  });

  camera.on('read', function() {
    img_flag = 1;
  });

  app.get('/camera', function(req, res) {
      camera.start() ;
  });
  app.get('', function(req, res) {
    res.sendfile(path.resolve('/home/pi/GuzyGo/public/cam.html'));
  });
  
  app.get('/img', function (req, res) {
    console.log('get /img') ;
      if (img_flag == 1) {
        img_flag = 0 ;
        res.sendfile('images/camera.jpg') ;
      }
  }) ;


  return router;
}