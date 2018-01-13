//Handle Scrape button
$("#scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    })
});
// We'll be rewriting the table's data frequently, so let's make our code more DRY
// by writing a function that takes in 'animals' (JSON) and creates a table body
function displayResults(scrapedData) {
  // First, empty the table
  $("panel-body").empty();

  // Then, for each entry of that json...
  scrapedData.forEach(function(scrapedData) {
    // Append each of the animal's properties to the table
    $("panel-body").append("<ul><li>" + title + "</li>" +
                         "<li>" + link + "</li></ul>");
  });
}


// 1: On Load
// ==========

// First thing: ask the back end for json with all animals
$.getJSON("/all", function(data) {
  // Call our function to generate a table body
  displayResults(data);
});

// // 2: Button Interactions
// // ======================

// // When user clicks the weight sort button, display table sorted by weight
// $("#weight-sort").on("click", function() {
//   // Set new column as currently-sorted (active)
//   setActive("#animal-weight");

//   // Do an api call to the back end for json with all animals sorted by weight
//   $.getJSON("/weight", function(data) {
//     // Call our function to generate a table body
//     displayResults(data);
//   });
// });

// // When user clicks the name sort button, display the table sorted by name
// $("#name-sort").on("click", function() {
//   // Set new column as currently-sorted (active)
//   setActive("#animal-name");

//   // Do an api call to the back end for json with all animals sorted by name
//   $.getJSON("/name", function(data) {
//     // Call our function to generate a table body
//     displayResults(data);
//   });
// });
