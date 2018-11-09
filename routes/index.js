// routes/index.js

// [PACKAGE CONFIGURE]

const cameraOptions = {
  width : 600,
  height : 420,
  mode : 'timelapse',
  awb : 'off',
  encoding : 'jpg',
  output : 'images/camera.jpg',
  q : 50,
  timeout : 10000,
  timelapse : 0,
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
    console.log('Restart camera');
    camera.start();
  });

  camera.on('read', function() {
    img_flag = 1;
  });

  app.get('', function(req, res) {
    res.sendfile(path.resolve('/public/cam.html'));
  });
  
  app.get('/img', function (req, res) {
    console.log('get /img') ;
      if (img_flag == 1) {
        img_flag = 0 ;
        res.sendfile('images/camera.jpg') ;
      }
  }) ;


  camera.start() ;

  return router;
}