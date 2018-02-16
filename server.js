// dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");
// Require request and cheerio. This makes the scraping possible
var cheerio = require("cheerio");
var request = require("request");


// Initialize Express
var app = express();
app.use(express.static('public'))

mongoose.Promise = Promise;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static('public'))


// var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({
//     defaultLayout: "main",
// }));
// app.set("view engine", "handlebars");

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing all the stories from the Globe and Mail\n" +
            "\n***********************************\n");

// Database configuration
var databaseUrl = "scraper";
var collections = ["savedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)(know main page goes here)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  console.log('we hit the scrape route!!!');
  var arrayOfArticles = []
  // Make a request for the news section of Globe and mail
  request("https://www.theglobeandmail.com/world/", function(error, response, html) {
    // Load the html body from request into cheerio
    

    var $ = cheerio.load(html);
    // For each element with a "title" class
    $(".o-card__content-text").each(function(i, element) {
      
      // Save the text and href of each link enclosed in the current element
      var title = element.children[0].data;
      var link = "https://www.theglobeandmail.com" + element.parent.parent.parent.parent.attribs.href;

      // If this found element had both a title and a link
      if (title) {
       
        arrayOfArticles.push({title: title, link: link})
        
      }
    });
    res.json(arrayOfArticles);
  });
  
});

  // Retrieve data from the db (to show on browser)
app.get("/all", function(req, res) {
  console.log('we hit the route ----');
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

app.get("/allSaved", function(req, res) {
  console.log('we hit the route ----');
  // Find all results from the scrapedData collection in the db
  db.savedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});


app.get("/home", function(req, res) {
  console.log('hit the home path ----');
  res.sendFile(path.join(__dirname, './public/index.html'))
});

app.post('/markAsSaved', function (req,res) {
  console.log('this is the id of the dude we want to mark saved!!!', req.body);


  db.savedData.insert(req.body, function(err, inserted) {
    if (err) {
      // Log the error if one is encountered during the query
      console.log(err);
    }
    else {
      // Otherwise, log the inserted data
      console.log('we just saved this dude ---',inserted);
      res.json(inserted);
    }
  });


});



const db = process.env.MONGODB_URI || "mongodb://localhost/Your-curated-news";
mongoose.connect(db, function(error) {
  if (error) {
    console.error(error);
  }
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
