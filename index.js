var express = require('express');                   // runs app and server
var exphbs = require('express-handlebars');         // learned some great handlebar tips from here: https://webapplog.com/handlebars/
var helpers = require('handlebars-helpers')();
var bodyParser = require('body-parser');            // needed from node
var MongoClient = require('mongodb').MongoClient;   // gotta require it
var ObjectID = require("mongodb").ObjectID;
var fs = require('fs');                             // file system for managing image uploads
var request = require('request');                   // posts to Facebook
var multer  = require('multer');                    // mutler handles temporary photo storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
});
var upload = multer({ storage: storage });
var helpers = require('./public/js/helpers'); // local helpers file

var hbs = exphbs.create({
    helpers       : helpers,  // Specify helpers which are only registered on this instance.
    defaultLayout : 'main'
});

/* TODO store credentials in heroku environment variables */


// intialize Express app
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.engine('handlebars', hbs.engine); // include the helpers
app.set('view engine', 'handlebars');

app.use('/', express.static('public')); // make the public folders static assets usable

app.get('/', function(req, res) {
  // res.render('home');

  foodCollection.find({}).toArray(function(err, results){
    res.render('allFood', {foods: results});
  });
});

app.get('/foods', function(req, res) {
  // foodCollection.find({}).toArray(function(err, results){
  //   res.render('allFood', {foood: results});
  // });

  var token = 'EAAfvwZCToPzQBAFcisHDlBP4y9Pme3QI9ijevAZByTUVYfaDwLyqBcURDTIEQyyFV4Xk8uFtZCq6gOa62WKMObukztzrV2qzJcEkL6iLFqGXggZC6uuDKqItrQv2npAWMb8MUTNDOK8sG2ZAPe7FZCMyLR7CZAtA93Cpf7nSJVOHAZDZD';

  request('https://graph.facebook.com/v2.8/124036224787932?fields=webp_images&access_token=' + token, function (error, response, body) {
    // console.log('error:', error);
    // console.log('statusCode:', response && response.statusCode);
    // console.log('body:', body);
    var response = JSON.parse(body).webp_images;
    var imageURL;

    for (var i of response) {
      if (i.height == 720) {
        imageURL = i.source;
      }
    }

      console.log(imageURL);
  });

});

app.get('/foods/:foodItem', function(req, res) {
  res.render('food', {foodItem: req.params.foodItem});
});

app.get('/food/:id/delete', function(req, res) {
  foodCollection.remove({_id: ObjectID(req.params.id)}, function(err, result) {
    res.redirect('/');
    console.log(result);
  });
});

app.get('/create', function(req, res) {
  res.render('add_food');
});

app.post('/create', upload.single('foodpic'), function (req, res, next) {
  // req.file holds img file
  // req.body holds text fields

  // this is a temp auth token, look into long one
  var FB_authToken = 'EAAfvwZCToPzQBAFcisHDlBP4y9Pme3QI9ijevAZByTUVYfaDwLyqBcURDTIEQyyFV4Xk8uFtZCq6gOa62WKMObukztzrV2qzJcEkL6iLFqGXggZC6uuDKqItrQv2npAWMb8MUTNDOK8sG2ZAPe7FZCMyLR7CZAtA93Cpf7nSJVOHAZDZD';
  var FB_FreedeGroupID = '1293958133959760';
  var FB_AlbumID = '1409936622361910';
  var FB_ID;

  // ---POST to Facebook---
  // made possible with help from http://kschenk.com/uploading-images-to-facebook-in-node-js/
  request.post(
    {
      url: 'https://graph.facebook.com/' + FB_AlbumID + '/photos?access_token=' + FB_authToken,
      formData: {
          message: 'Status: Available', // put in the JSON description of food here
          source: fs.createReadStream(req.file.path)
      }
    }, function(err, resPost, body) {
          var bodyObject = JSON.parse(body);
          FB_ID = bodyObject.id;

          request('https://graph.facebook.com/v2.8/' + FB_ID + '?fields=images&access_token=' + FB_authToken, function (error, response, body) {
              // console.log('error:', error); // console.log('statusCode:', response && response.statusCode); // console.log('body:', body);
              var response = JSON.parse(body).images;
              var FB_Image_URL = response[0].source ;

              var foodItem = {
                name: req.body.name.trim(),
                description: req.body.description.trim(),
                date: req.body.date.trim(),
                FB_ID: FB_ID,
                FB_Image_URL: FB_Image_URL
              }; // create the food item
              console.log(foodItem);
              foodCollection.insert(foodItem, function(err, result){
                if ( result.result.ok ) {
                  res.redirect('/#receive');
                  console.log('uploaded to mLab DB');
                } else { console.log(result); }
              }); // add to mLab database

              if(bodyObject.error) {
                console.log(bodyObject.error.message);
              } // handle the error response
          }); // request image from FB
      }
  );

  // res.redirect('/');

});








app.post('/publish/facebookAccount', function(req, res) {

  console.log(req.files);

  // fs.createReadStream(imageFile.path)

  // request.post(
  //     {
  //         url: 'https://graph.facebook.com/me/photos?access_token=' + authToken,
  //         formData: {
  //             message: message,
  //             source: fs.createReadStream(imageFile.path)
  //         }
  //     }, function(err, res, body) {
  //         var bodyJSON = JSON.parse(body);
  //         if(bodyJSON.error) {
  //             console.log(bodyJSON.error.message);
  //         }
  //     }
  // );

});

app.post('/add', function(req, res) {
  var foodItem = {
    name: req.body.name.trim(),
    date: req.body.date.trim()
  };

  // simple validation
  if (foodItem.name != '' && foodItem.date != '') {
    foodCollection.insert(foodItem, function(err, result){
      res.redirect('/');
    });
  } else {
    res.render('add_food', {message: 'Please enter a name and date', foodItem: req.body});
  }

  // var formElement = document.querySelector("#form");
  // var formData = new FormData(formElement);
  // console.log(formData);
  // res.send(req.body.color);
});













// MONGO Stuff
var foodCollection; // this var needs to be global

/* some helping functions */
function getAllFoods() {
  // get entire db
  foodCollection.find().toArray(function(err, results) {
    console.log(results);
  });
}

function insertFood(name, date) {
  var foodToInsert = {
    name: name,
    date: date
  }

  foodCollection.insert(foodToInsert);
}



/* gotta have this main func */
function startup(err, database) {
  if (err) return console.log(err);
  foodCollection = database.collection('foodItemsCollection');

  // insertFood('banana', '02-26-17');  // inserting to DB
  // getOneTypeFood(); // gets all foods w a specific field
  getAllFoods();

  app.listen(process.env.PORT || 3000); // express app needs this
}

MongoClient.connect('mongodb://foodie:ilovefood@ds153609.mlab.com:53609/dynamic-web-db', startup); // THIS always goes at end of file and calls the starting function


/*

Fb Tokens:
Convert this short-lived access token into a long-lived one by making this Graph API call: https://graph.facebook.com/oauth/access_token?client_id=<your FB App ID >&client_secret=<your FB App secret>&grant_type=fb_exchange_token&fb_exchange_token=<your short-lived access token>
Grab the new long-lived access token returned back
Make a Graph API call to see your accounts using the new long-lived access token: https://graph.facebook.com/me/accounts?access_token=<your long-lived access token>
Grab the access_token for the page you'll be pulling info from
Lint the token to see that it is set to Expires: Never!
https://developers.facebook.com/tools/explorer/
https://developers.facebook.com/tools/debug/accesstoken
----
expire never NYU Freedge page:
EAAfvwZCToPzQBAFcisHDlBP4y9Pme3QI9ijevAZByTUVYfaDwLyqBcURDTIEQyyFV4Xk8uFtZCq6gOa62WKMObukztzrV2qzJcEkL6iLFqGXggZC6uuDKqItrQv2npAWMb8MUTNDOK8sG2ZAPe7FZCMyLR7CZAtA93Cpf7nSJVOHAZDZD
----
expires never Freedge user:
EAAfvwZCToPzQBACFUsHmmGkEO61sIbw1Klr8MuH6Ktq44uboMK1t2mhw3LjugEXd1ZBek9eHMBWH1Marm1xhZCBa3o9P0VvD3sJPWGdKixkWsQ6ZCaIcvCwGI6vZBOPCiLUxq8MaRny3ZAu0K8cjHH3o5poAxpHNjwdH00OJR6LQZDZD


// TODO use passport to authenticate FB
https://github.com/jaredhanson/passport-facebook

// posting to a group page :
http://stackoverflow.com/questions/4803697/facebook-posting-to-a-group-page

// helpful FB posting video but dated:
https://www.youtube.com/watch?v=5R_0YGmYWCY

// loading bar?
// how to preview images before submitting / posting :
http://stackoverflow.com/questions/5802580/html-input-type-file-get-the-image-before-submitting-the-form
// how to read files (pictures)
https://www.html5rocks.com/en/tutorials/file/dndfiles/

//using mutler :
https://codeforgeek.com/2014/11/file-uploads-using-node-js/
https://github.com/expressjs/multer

how to send bit files to mongodb - imgs to binary BSON format?
https://docs.mongodb.com/manual/reference/program/mongofiles/#bin.mongofiles

mongoose solutions + Schema ?
https://gist.github.com/aheckmann/2408370
http://blog.nbostech.com/2016/10/store-and-read-image-file-in-mongodb-using-nodejsexpressmongoose/

// confusing tutorial but good topic:
http://blog.robertonodi.me/simple-image-upload-with-express/
// to try one day.. facebook-complete npm
https://www.npmjs.com/package/facebook-complete

// using forms and files
https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects

// TODO form validation
https://www.w3schools.com/js/js_validation.asp


// input types for mobile help
http://blog.teamtreehouse.com/using-html5-input-types-to-enhance-the-mobile-browsing-experience


// STYLE Calendar + forms
thoughts on socket-like validation forms
http://codepen.io/Zhouzi/pen/QbBzZp

pretty form features
http://codepen.io/dapacreative/pen/bdzYEe

clever placeholders move up ** like and use this **
http://codepen.io/lukeandrewreid/pen/OVPGXN

sleek form w animation name placeholder
http://codepen.io/Izaias/pen/PPJmQe

GREAT sliders
http://codepen.io/simeydotme/pen/mJLPPq
*/
