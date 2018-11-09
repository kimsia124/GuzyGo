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

module.exports = (app) => {
  camera.on('exit', function() {
    camera.stop();
  });

  camera.on('read', function() {
    res.sendfile('images/' + req.query.time +'.jpg') ;
  }) ;
  camera.on("start", function(){

  });
  app.get('', function(req, res) {
    res.sendfile(path.resolve('/home/pi/GuzyGo/public/cam.html'));
  });
  
  app.get('/img', function (req, res) {
    camera.set('output', '.images/' + req.query.time + '.jpg');
    camera.start();
  }) ;


  return router;
}