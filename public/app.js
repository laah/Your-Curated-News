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
// function that takes in articals(JSON) and creates a table body
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

// First thing: ask the back end for json with all articals
$.getJSON("/all", function(data) {
  // Call our function to generate a table body
  displayResults(data);
});

