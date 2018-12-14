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
  br: 15,
  timeout: 1000000000000,
  timelapse: 10,
  nopreview : true,
  th : '0:0:0'
};
/*
var cmd = 'gst-launch-1.0';
var args = ['autovideosrc', 'horizontal-speed=1', 'is-live=true',
    '!', 'videoconvert',
    '!', 'vp8enc', 'cpu-used=5', 'deadline=1', 'keyframe-max-dist=10',
    '!', 'queue', 'leaky=1',
    '!', 'm.', 'autoaudiosrc',
    '!', 'audioconvert',
    '!', 'vorbisenc',
    '!', 'queue', 'leaky=1',
    '!', 'm.', 'webmmux', 'name=m', 'streamable=true',
    '!', 'queue', 'leaky=1',
    '!', 'tcpserversink', 'host=127.0.0.1', 'port=9001', 'sync-method=2'];*/

// [LOAD PACKAGE]
const camera = require('raspicam')(cameraOptions);
const express = require('express');
const path = require('path');
const net = require('net');
var child = require('child_process');
// var gstreamer = child.spawn(cmd, args, {stdio: 'inherit'});

const router = express.Router();

// [CONST VALUE]
let img_flag = 0 ;
/*
gstreamer.on('exit', function (code) {
  if (code != null) {
      console.log('GStreamer error, exit code ' + code);
  }
  process.exit();
});
*/

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
  app.get('/', function (req, res) {
    var date = new Date();
/*
    res.writeHead(200, {
        'Date': date.toUTCString(),
        'Connection': 'close',
        'Cache-Control': 'private',
        'Content-Type': 'video/webm',
        'Server': 'CustomStreamer/0.0.1',
   });

    var socket = net.connect(9001, function () {
        socket.on('close', function (had_error) {
            res.end();
        });
        socket.on('data', function (data) {
            res.write(data);
        });
    });

    socket.on('error', function (error) {
        console.log(error);
    });*/
  });

  app.get('/cam', function(req, res) {
    res.sendfile(path.join(__dirname, '..', 'public', 'cam.html'));
  });

  app.get('/img', function (req, res) {
    console.log('get /img') ;
    if (img_flag == 1) {
        img_flag = 0 ;
        res.sendfile('images/camera.jpg') ;
      }
    });

  return router;
}