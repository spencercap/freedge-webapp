/*   INIT   */
var express = require('express')                    // server
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient    // easy mongo DB api
var ObjectID = require('mongodb').ObjectID
var path = require('path')
var fs = require('fs')                              // file system for managing image uploads
var multer  = require('multer')                     // handles temp photo storage on server
var request = require('request')                    // posts to Facebook
var config = {}                                     // account credentials
try {
  config = require('./creds') // use the local configs if available
} catch (e) {
  console.log('need to configure credentials... (setup local creds.json file or use heroku config vars)')
  config.FB_AUTH_TOKEN = process.env.FB_AUTH_TOKEN
  config.FB_FREEDGE_GROUP_ID = process.env.FB_FREEDGE_GROUP_ID
  config.FB_ALBUM_ID = process.env.FB_ALBUM_ID
}
// setup
var app = express()
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + '.jpg')
  }
});
var upload = multer({ storage: storage })
app.use(bodyParser.urlencoded({extended: true}))
app.use('/', express.static('public'))              // define static folder for vue frontend code
var server = require('http').Server(app);
var http = require( "http" ).createServer( app );
var io = require('socket.io')(http);              // web sockets realtime updates front + server

// vars
var foodCollection
var foodList = []


/*   ROUTES   */
app.get('/', function (req, res) {
  // res.send('Hello World!')
  res.sendFile('./public/index.html')
})

app.post('/testing', upload.single('foodpic'), function (req, res) {
  console.log(req.file)
  // req.file holds img file

  // multer tmp file (dont do form data)

  // res.json( {status: 'ok!'} )
  res.send( true )
})

app.post('/add-food', upload.single('foodpic'), function (req, res) {
  console.log(req.body)
  // req.file holds img file

  // multer tmp file (dont do form data)

  res.json( {status: 'ok!'} )
})

app.post('/uploadImage', function (req, res) {
  console.log(req)
  console.log('spacer')
  console.log(req.file)
  console.log(req.body)
  // multer tmp file (dont do form data)

  res.json( {status: 'ok!'} )
})

// adding food
app.post('/create', upload.single('foodpic'), function (req, res, next) {
  // req.file holds img file
  // req.body holds text fields

  var FB_ID;

  // ---POST to Facebook---
  // made possible with help from http://kschenk.com/uploading-images-to-facebook-in-node-js/
  request.post(
    {
      url: 'https://graph.facebook.com/' + facebook.FB_AlbumID + '/photos?access_token=' + facebook.FB_authToken,
      formData: {
          message: 'Status: Available', // put in the JSON description of food here
          source: fs.createReadStream(req.file.path)
      }
    }, function(err, resPost, body) {
          var bodyObject = JSON.parse(body);
          FB_ID = bodyObject.id;

          request('https://graph.facebook.com/v2.8/' + FB_ID + '?fields=images&access_token=' + facebook.FB_authToken, function (error, response, body) {
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


// deleting
app.get('/food/:id/delete', function(req, res) {
  announcement = 'taking...';

  foodCollection.remove({_id: ObjectID(req.params.id)}, function(err, result) {
    // console.log(result);




    // this is a temp auth token, look into long one
    var FB_authToken2 = 'EAAfvwZCToPzQBAP96iwx0ZB1XztPdP7EVHBS9IOUcpJSXFoqRdTui3oi8AJ7ZBuVsOTvp9kOzkYZCA2OwdlyZA0vhJ9PMyUZCSdPbhHZAv5iRY2NP6HI132ypLicD3w0gvGoyL8VWJRiZAi2Io3Hc3j8Q7xIuQIN8ZBKjAYE36wT2RwZC0rTx6riEiZCtSK4wevnewZD';
    var FB_FreedeGroupID = '1293958133959760';
    var FB_AlbumID = '1409936622361910';
    var post_ID = req.query.FBID;
    console.log(post_ID);

    request.delete('https://graph.facebook.com/v2.9/'+ post_ID +'?access_token=EAAfvwZCToPzQBAP96iwx0ZB1XztPdP7EVHBS9IOUcpJSXFoqRdTui3oi8AJ7ZBuVsOTvp9kOzkYZCA2OwdlyZA0vhJ9PMyUZCSdPbhHZAv5iRY2NP6HI132ypLicD3w0gvGoyL8VWJRiZAi2Io3Hc3j8Q7xIuQIN8ZBKjAYE36wT2RwZC0rTx6riEiZCtSK4wevnewZD', function (error, response, body) {
        console.log(response);
        announcement = 'took food';
        res.redirect('/');
      }); // create the food item

  });

});


// adding email
app.post('/addEmail/:email', function (req, res, next) {

  // keep subscribe in axios? no.
  res.redirect('/');

  request.post('https://docs.google.com/forms/d/e/1FAIpQLSdVgHZibInIhmdwFbIti_k4VdxwQ80ruLrBLjMtB8ReTkCr_A/formResponse',
  {form: {
    "entry.1354257029": req.params.email
    }
  })

  announcement = 'email subscribed';

});



/*   SOCKET.io    */
var messages = [];

io.on('connection', function (client) {
  console.log('a client connected!');
  console.log(messages);

  client.emit('initialize', messages);

  client.on('message', function (data) {
    console.log('message recieved', data);
    messages.push(data);
    client.broadcast.emit('message', data);
  });

});







/*   FUNCTIONS   */
function updateFoodList() {
  foodCollection.find().toArray(function(err, results) {
    foodList = results;
    console.log(foodList);  // get mongo db
  });
}

function startup(err, database) {
  if (err) return console.log(err)
  foodCollection = database.collection('nyu.freedge.collection.brooklyn.01')
  updateFoodList()

  var port = process.env.PORT || 3000
  app.set( "ipaddr", "127.0.0.1" )
  app.set( "port", port )
  http.listen(port) // run server (NOT "app.listen(process.env.PORT || 3000)" like usual... 3000 for local, env for server)
  console.log('Express server listening on port 3000 or env port')
}

MongoClient.connect('mongodb://NYUfreedge:NYUfreedge123@ds127391.mlab.com:27391/nyufreedge', startup) // keep this at very end
