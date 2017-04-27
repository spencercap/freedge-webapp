/*   INIT   */
var express = require('express')                    // server
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient    // easy mongo DB api
var ObjectID = require("mongodb").ObjectID
var path = require('path')
var fs = require('fs')                              // file system for managing image uploads
var multer  = require('multer')                     // handles temp photo storage on server
var request = require('request')                    // posts to Facebook
// setup
var app = express()
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
});
var upload = multer({ storage: storage })
app.use(bodyParser.urlencoded({extended: true}))
app.use('/', express.static('public'))              // define static folder for vue frontend code
// vars
var foodCollection
var foodList = []



/*   ROUTES   */
app.get('/', function (req, res) {
  // res.send('Hello World!')
  res.sendFile('./public/index.html')
})

app.post('/uploadImage', function (req, res) {
  console.log(req)
  // multer tmp file (dont do form data)

  res.json( {status: 'ok!'} )
})



/*   FUNCTIONS   */

function updateFoodList() {
  foodCollection.find().toArray(function(err, results) {
    foodList = results;
    console.log(foodList);  // get mongo db
  });
}

function startup(err, database) {
  if (err) return console.log(err)
  foodCollection = database.collection('foodItemsCollection')
  updateFoodList()

  app.listen(process.env.PORT || 3000) // run express (3000 for local, env for server)
  console.log('Express server listening on port 3000 or env')
}

MongoClient.connect('mongodb://foodie:ilovefood@ds153609.mlab.com:53609/dynamic-web-db', startup) // keep this at very end
