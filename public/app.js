//Handle Scrape button
$("#scrape").on("click", function() {
    $('#articleContainer').empty();
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function(articles) {
        console.log('this is our array of articles!!!!', articles);
        displayResults(articles)
    })
});


$("#showSaved").on("click", function() {
  $('#articleContainer').empty();
  $.ajax({
      method: "GET",
      url: "/allSaved",
  }).done(function(articles) {
      console.log('this is our array of articles!!!!', articles);
      displayResults(articles)
  })
});

$('#articleContainer').on('click', '#save', function (){
    console.log("yeahhhh!!! it is working!!", this.name);
    $.ajax({
      method: "POST",
      url: "/markAsSaved",
      data: {
        title: this.title,
        link: this.name
     }
    })
      .done(function(responseFromBackend) {
        console.log('thing we go back from backend ----', responseFromBackend);
    });
});

// function that takes in articals(JSON) and creates a table body
function displayResults(scrapedData) {
  // First, empty the table
  $(".panel-body").empty();
  // Then, for each entry of that json...
  scrapedData.forEach(function(singleData) {
    $("#articleContainer").append('<div class="panel panel-default"> <div class="panel-heading"> <h4 id= "title">' + singleData.title + '</h4>  <a class="article-link" target="_blank" href="'+ singleData.link +'">Link</a></div><button id="save" title="' + singleData.title + '" name="' + singleData.link + '" class="btn btn-success save">Save Article</button><div class="panel-body"><p></p><a href="link" target="_blank"></a></div></div>');
  });
}
