// routes/index.js

// [LOAD PACKAGE]
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const request = require('request');
const express = require('express');

// [PACKAGE CONFIGURE]
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/');
  },
  filename: (req, file, callback) => {
    callback(null, new Date().valueOf() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  dest: 'uploads/',
  storage: storage,
});

console.log("???????????????????")

// [CONST VALUE]
const MY_APPKEY = '801c76388a679d223320a2ac616c78c8';

const router = express.Router();

module.exports = (app, Product) => {

    // [GET] GET ALL PRODUCTS
    app.get('/products', (req, res) => {
      Product.find((err, products) => {
        if (err) return res.status(500).send({error: 'database failure'});
        res.json(products);
      });
    });
    
    // [GET] GET SINGLE PRODUCT
    app.get('/products/:product_id', (req, res) => {
      Product.findOne({_id: req.params.product_id}, (err, product) => {
        if (err) return res.status(500).json({error: err});
        if (!product) return res.status(404).json({error: 'product not found'});
        res.json(product);
      })
    });

    // [GET] GET PRODUCT BY NAME
    app.get('/products/name/:name', (req, res) => {
      Product.findOne({name: req.params.name}, (err, products) => {
        if (err) return res.status(500).json({error: err});
        if (products.length === 0) return res.status(404).json({error: 'product not found'});
        res.json(products);
      })
    });
    
    // [POST] CREATE PRODUCT
    app.post('/products', (req,res) => {
      const product = new Product();
      product.name = req.body.name;
      product.price = req.body.price;
      product.amount = req.body.amount;
  
      product.save((err) => {
          if(err){
              console.error(err);
              res.json({result: 0});
              return;
          }
  
          res.json({result: 1});
  
      });
    });

    // [UPDATE] UPDATE PRODUCT
    app.put('/products/:product_id', (req,res) => {
      Product.findById(req.params.product_id, (err, product) => {
        if(err) return res.status(500).json({ error: 'database failure' });
        if(!product) return res.status(404).json({ error: 'product not found' });

        if(req.body.name) product.name = req.body.name;
        if(req.body.price) product.price = req.body.price;
        if(req.body.amount) product.amount = req.body.amount;

        product.save((err) => {
            if(err) res.status(500).json({error: 'failed to update'});
            res.json({message: 'product updated'});
        });

      });
    });

    // [DELETE] DELETE PRODUCT
    app.delete('/products/:product_id', (req,res) => {
      Product.deleteOne({ _id: req.params.product_id }, (err, output) => {
        if(err) return res.status(500).json({ error: "database failure" });

        console.log(output);
        if(output.n === 0) return res.status(404).json({ error: "product not found" });
        res.json({ message: "product deleted" });;
      })
    });

    // [POST] UPLOAD SINGLE FILE
    app.post('/upload', upload.single('file'), function(req, res){
      res.json({
        message: 'Uploaded',
        originalname: req.file.originalname,
        filename: req.file.filename,
      });
    });

    // [GET] UPLOAD IMAGE TO KAKAO 1
    app.get('/upload1/:filename', async (req, res) => {
      const file = fs.createReadStream(path.join(__dirname, '..', 'images', `${req.params.filename}`));

      // 헤더 부분
      const headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'mulipart/form-data',
        'Authorization': `KakaoAK ${MY_APPKEY}`
      };

      // 요청 세부 내용
      const options = {
        url: 'https://kapi.kakao.com/v1/vision/product/detect',
        method:'POST',
        headers: headers,
        formData: {'file': file, 'threshold': '0.1'},
      }

      // 요청
      let none = new Array;
      let exist = new Array;
      await request(options, async (error, response, body) => {
        if (!error && response.statusCode == 200) {
          body = await JSON.parse(body);
          await body.result.objects.forEach(async (product) => {
            await Product.find({name: product.class}, async (err, products) => {
              if (err) return res.status(500).json({error: err});
              if (products.length === 0) {
                await none.push(product.class);
              } else {
                await exist.push(products[0].name);
              }
            });
          });    
        } else if (response.statusCode !== 200) {
          await res.json({
            'msg': 'KAKAO API request error',
            'error': JSON.parse(body),
          });
        }
      });
      setTimeout(() => {
        res.json({
          'msg': 'KAKAO API request success',
          'data' : {
            none,
            exist,
          },
        });
      }, 1500);
      
    });
    
    // [GET] UPLOAD IMAGE TO KAKAO 2
    app.get('/upload2/:filename', (req, res) => {
      const file = fs.createReadStream(path.join('D:', 'git', 'guzygo', 'uploads', `${req.params.filename}`));

      // 헤더 부분
      const headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'mulipart/form-data',
        'Authorization': `KakaoAK ${MY_APPKEY}`
      };

      // 요청 세부 내용
      const options = {
        url: 'https://kapi.kakao.com/v1/vision/product/detect',
        method:'POST',
        headers: headers,
        formData: {'file': file}
      }

      // 요청
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let purchase = [];
          body.results.objects.map((product) => {
            Product.find({name: product.class}, (err, product) => {
              if(err) return res.status(500).json({ error: 'database failure', msg: err.message});
              if(!product) return res.status(404).json({ error: 'product not found' });
              
              Product.update({name: product.class}, {$push: {history: {"type": "purchase", "amount": 1}}});
              product.amount -= 1;
      
              product.save((err) => {
                  if(err) res.status(500).json({error: 'failed to update'});
                  res.json({message: 'product updated'});
              });

              const idx = purchase.indexOf({name: products.class});
              if (idx != -1) {
                purchase[idx].amount += 1;
              } else {
                purchase.push({
                  name: products.class,
                  amount: 1
                });
              }
              
            });
          });
          res.json({
            'msg': 'KAKAO API request success',
            'data' : {
              purchase,
            },
          });
        }
        else if (response.statusCode !== 200) {
          res.json({
            'msg': 'KAKAO API request error',
            'error': JSON.parse(body),
          });
        }
      })
    });

    // [POST] PRODUCT PURCHASE
    app.post('/purchase', (req, res) => {
      Product.update({name: req.body.name}, {$push: {history: {"type": "purchase", "amount": req.body.amount}}});
      Product.findOne({name: req.body.name}, (err, product) => {
        if(err) return res.status(500).json({ error: 'database failure', msg: err.message});
        if(!product) return res.status(404).json({ error: 'product not found' });

        product.amount -= req.body.amount;

        product.save((err) => {
            if(err) res.status(500).json({error: 'failed to update'});
            res.json({message: 'product updated'});
        });

      });
    });

    return router;
}
