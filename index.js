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
var fooder = {}

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

io.on('connection', function (client) {
  console.log('a client connected!')
  console.log(foodList)

  client.emit('initialize', foodList)

  client.on('addFood', function (data) {

    postToFacebook(data)
    .then(function(newFood) {
      console.log("success: post to fb", newFood)
      return newFood
    }, function(err) {
      console.log('error: fb post', err)
    })
    .then(function(newFood) {
      console.log('success: get fb url', newFood)
      return getFBimgURL(newFood)
    }, function(err) {
      console.log('error: get fb url', err)
    })
    .then(function(newFood) {
      console.log('success: post to mongo', newFood)
      return postToMongo(newFood)
    }, function(err) {
      console.log('error: post to mongo', err)
    })
    .then(function(newFood) {
      // client.broadcast.emit('addedFood') //
      // client.emit('addedFood')
      io.sockets.emit('addedFood', newFood)
      return socket.broadcast.emit('addedFood', newFood)
    })
    // messages.push(data);
    // client.broadcast.emit('message', foodItem)
  })

})



/*   FUNCTIONS   */
function postToFacebook (data) {
  return new Promise(function(resolve, reject) {
    request.post(
    {
      url: 'https://graph.facebook.com/' + config.FB_ALBUM_ID + '/photos?access_token=' + config.FB_AUTH_TOKEN,
      formData: {
        message:
        `Status: Available
        Name: ${data.name}
        Description: ${data.description}
        Given: ${data.date} at ${data.time}`, // put in the JSON description of food here
        file: fs.createReadStream( base64Img.imgSync(data.image, 'tmp', 'foodpic_'+ Date.now() ))
      }
    },
    function(err, res, body) {
      bodyObj = JSON.parse(body)
      if (err) {
        reject(err) // TODO make clear 1 line if ternary statements
      } else if (bodyObj.error) {
        reject(bodyObj.error)
      } else {
        var newFood = {
          name: data.name,
          description: data.description,
          date: data.date,
          time: data.time,
          FB_POST_ID: bodyObj.id
        }
        resolve(newFood)
      }
      // err || bodyObj.error ? reject(err || bodyObj.error) :
      //   console.log('failed')
      //   resolve( fooder.FB_POST_ID )
      //   // reject(Error(req.statusText))
    })
  })
}

function getFBimgURL (newFood) {
  return new Promise((resolve, reject) => {
    request('https://graph.facebook.com/v2.8/' + newFood.FB_POST_ID + '?fields=images&access_token=' + config.FB_AUTH_TOKEN,
      function (err, res, body) {
        bodyObj = JSON.parse(body)
        err || bodyObj.error ? reject(err || bodyObj.error) :
          newFood.FB_IMG_URL = bodyObj.images[0].source
          resolve( newFood )
      })
  })
}

function postToMongo (newFood) {
  return new Promise((resolve, reject) => {
    foodCollection.insert(newFood, function(err, result){
      if ( result.result.ok ) {
        resolve( newFood )
        // TODO socket emit refresh
        // client.broadcast.emit('message', foodItem) // sends to all connections EXCEPT the one who sent it.
        // client.emit('message', foodItem)
      } else {
        reject(result)
      }
    })
  })
}

function postToFacebookOLD (data) {
  return new Promise((resolve, reject) => {
    request.post(
    {
      url: 'https://graph.facebook.com/' + config.FB_ALBUM_ID + '/photos?access_token=' + config.FB_AUTH_TOKEN,
      formData: {
        message: 'Status: Available', // put in the JSON description of food here
        file: fs.createReadStream( base64Img.imgSync(data.image, 'tmp', 'foodpic_'+ Date.now() ))
      }
    },
    function(err, res, body) {
      bodyObj = JSON.parse(body)
      err || bodyObj.error ? reject(err || bodyObj.error) :
        fooder.FB_POST_ID = bodyObj.id
        console.log('in post to fb: ' + JSON.stringify(fooder))
        resolve( fooder.FB_POST_ID )
    })
  })
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
