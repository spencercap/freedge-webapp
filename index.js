/*   INIT   */
var express = require('express')                    // server
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient    // easy mongo DB api
var ObjectID = require('mongodb').ObjectID
var base64Img = require('base64-img')               // handles temp photo storage on server
// var path = require('path')
var fs = require('fs')                              // file system for managing image uploads
var request = require('request')                    // http posts (Facebook)
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
app.use(bodyParser.urlencoded({extended: true}))
app.use('/', express.static('public'))              // define static folder for vue frontend code
var server = require('http').Server(app);
var http = require( "http" ).createServer( app );
var io = require('socket.io')(http);              // web sockets realtime updates front + server

// vars
var foodCollection
var foodList = []
var tempURL

/*   ROUTES   */
app.get('/', function (req, res) {
  res.sendFile('./public/index.html')
})


// deleting
// TODO include announcements - socket emit
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
  console.log('a client connected!')
  console.log(messages)
  console.log(foodList)

  client.emit('initialize', foodList)

  client.on('message', function (data) {
    postToFacebook(data)
    // TODO seperate add to mLab DB function ES6 Generator

    // messages.push(data);
    // client.broadcast.emit('message', foodItem)
  })

})







/*   FUNCTIONS   */
function getFBimgURL (id) {
  // ES6 Generator functions... * yield...
  request('https://graph.facebook.com/v2.8/' + id + '?fields=images&access_token=' + config.FB_AUTH_TOKEN, function (error, response, body) {
    if (error) {
      return console.error('getting facebook img URL failed:', error);
    }
    // console.log('error:', error); // console.log('statusCode:', response && response.statusCode); // console.log('body:', body);
    var response = JSON.parse(body).images;
    tempURL = response[0].source ;

  })

}


function postToFacebook (newFood) {
  // learned from http://kschenk.com/uploading-images-to-facebook-in-node-js/
  request.post({
    url: 'https://graph.facebook.com/' + config.FB_ALBUM_ID + '/photos?access_token=' + config.FB_AUTH_TOKEN,
    formData: {
        message: 'Status: Available', // put in the JSON description of food here
        file: fs.createReadStream( base64Img.imgSync(newFood.image, 'tmp', 'foodpic_'+ Date.now() ))
    }
  }, function(err, resPost, body) {
      if (err) {
        return console.error('facebook upload failed:', err)
      }
      var FB_POST_ID = JSON.parse(body).id
      console.log('posted to facebook, id: ' + FB_POST_ID)


      // TODO syncrhonous callbacks
      // TODO socket emit updates "food adding...", "food successfully added...", "email subscribed"
      // ES6 Generator functions... * yield...
      // http://www.tivix.com/blog/making-promises-in-a-synchronous-manner/
      // getFBimgURL(FB_POST_ID) // below
      request('https://graph.facebook.com/v2.8/' + FB_POST_ID + '?fields=images&access_token=' + config.FB_AUTH_TOKEN, function (error, response, body) {
        if (error) {
          return console.error('getting facebook img URL failed:', error)
        }
        var tempURL = JSON.parse(body).images[0].source
        console.log('got facebook img URL: ' + tempURL)


        // TODO seperate create food instance function
        // TODO append all info facebook post
        var foodItem = {
          name: newFood.name.trim(),
          description: newFood.description.trim(),
          date: newFood.date.trim(),
          time: newFood.time.trim(),
          FB_POST_ID: FB_POST_ID,
          FB_Image_URL: tempURL
        }
        // console.log(foodItem)


        // TODO seperate add to mLab DB function ES6 Generator
        foodCollection.insert(foodItem, function(err, result){
          if ( result.result.ok ) {
            console.log('uploaded to mLab DB')
            // TODO socket emit refresh
            // client.broadcast.emit('message', foodItem)
          } else { console.log(result) }
        })

      })

    }
  )
}

function updateFoodList () {
  foodCollection.find().toArray(function(err, results) {
    foodList = results;
    console.log(foodList);  // get mongo db
  });
}

function startup (err, database) {
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
