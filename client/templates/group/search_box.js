Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
  	console.log("Search boo");
    var text = $(e.target).val().trim();
    GroupSearch.search(text);
  }, 200)
});