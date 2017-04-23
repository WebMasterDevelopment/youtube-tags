$(document).ready(function(){
	var api_key = "AIzaSyDHpAbhK5b2PkTscYfpu7gN7WErxlLrmU0";
	var searchResults = {};
	searchResults.videoID = [];
	var terms = ['best','awesome','incredible','insane','great']
	$('#search').on("click", function(){
		var maxResults = $("#max-results").val();
		$.each(terms, function(i, currentTerm){
			$.ajax({
				url: "https://www.googleapis.com/youtube/v3/search?part=snippet&q=‌​%23%23"+currentTerm+"&maxResults="+maxResults+"&key="+api_key+"&type=video';&q=array_item",
				dataType: "jsonp",
				type: "GET",
				success: function(data){
					$.each(data.items, function(i, object) {
						$.each(object.id, function(property, id) {
							if(property == "videoId"){
								var dummy = {};
								dummy[currentTerm] = id;
								searchResults.videoID.push(dummy);
							}
						});
					});
				}
			});
		});
		setTimeout(function(){
			var finalTags = {};
			finalTags.videoIds = [];
			var temp = [];
			var property;
			var randomResults;
			$.each(terms, function(i, currentTerm){
				$.each(searchResults.videoID, function(x, object){
					$.each(object, function(property, value){
						if(currentTerm == property){
							temp.push(value)
						}
					});
				});
				//Rand becomes our temporary array
				randomResults = getRandom(temp,10);
				console.log(currentTerm+ ": "+randomResults);
				//Go through each object in our current array
				$.each(randomResults, function(i, currentID){
					//We make an AJAX call for each video id in the array
					$.ajax({
						url: "https://www.googleapis.com/youtube/v3/videos?part=snippet&key=AIzaSyDHpAbhK5b2PkTscYfpu7gN7WErxlLrmU0&fields=items(snippet(tags))&id="+currentID,
						dataType: "jsonp",
						type: "GET",
						success: function(data){
							$.each(data.items, function(i, currentItem){
								console.log(currentItem);
								$.each(currentItem.snippet, function(x, currentSnippet){
									console.log(currentSnippet);
									var dummy = {};	
									dummy[currentItem] = currentSnippet;
									finalTags.videoIds.push(dummy);
									
								});
							});
						}
					});
				});
				//Reset the array
				temp.length = 0;
			});
			console.log(finalTags);
		}, 1500);
		});
});

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len;
    }
    return result;
}
