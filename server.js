// dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
// Require request and cheerio. This makes the scraping possible
var cheerio = require("cheerio");
var request = require("request");


// Initialize Express
var app = express();

mongoose.Promise = Promise;

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main",
}));
app.set("view engine", "handlebars");

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing all the stories from the Globe and Mail\n" +
            "\n***********************************\n");

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
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

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request for the news section of Globe and mail
  request("https://www.theglobeandmail.com/world/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $(".o-card__content-text").each(function(i, element) {
      console.log("this is the element found", element.parent.parent.parent.parent.attribs.href
        );
      // Save the text and href of each link enclosed in the current element
      var title = element.children[0].data;
      var link = "https://www.theglobeandmail.com" + element.parent.parent.parent.parent.attribs.href;

      // If this found element had both a title and a link
      if (title) {
        // Insert the data in the scrapedData db
        db.scrapedData.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      }
    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});

app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
