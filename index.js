// index.js


// [LOAD PACKAGES]
const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://root:sia740822@ds129823.mlab.com:29823/guzygo',{ 
  useNewUrlParser: true,
  useCreateIndex: true,
});

// DEFINE MODEL
const Product = require('./models/Product');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [CONFIGURE STATIC FILE SERVING]
app.use('/static', express.static('uploads'))

// [CONFIGURE SERVER PORT]
const port = process.env.PORT || 3000;

// [CONFIGURE ROUTER]
const api = require('./routes/api.js')(app, Product);
app.use('/api', api);

const route = require('./routes/index.js')(app);
app.use('/', route);



// [RUN SERVER]
const server = app.listen(port, function(){
 console.log("GuzyGo server has started on port " + port);
});