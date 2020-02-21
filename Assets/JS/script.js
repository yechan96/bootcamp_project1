$(document).ready(function(){
    var libraryArr = [];
    var finalSongsArr =[];
    var weather = {};
    var countryCode = "";
    var titleSongs = [];
    var subjectSongs = [];
    var weatherSongs = [];
    var keywordSongs = [];
    var finalResults = {}; //push object with finalSongsArr, etc.


    var bookSearchTitle = "";
    var location ="";

    //asks user for current location and save location and weather info.
    navigator.geolocation.getCurrentPosition(success, error)

    $(".searchButton").on("click",function(){
        $(".wrapperPg2").empty()
        
        bookSearchTitle =  $("#bkSearchInp").val();
        if(bookSearchTitle==""){
            $("#blankModal").show()
            $("#blankModal").delay(5000).fadeOut()
            return
        }
        $("#bkSearchInp").val("");
        if(location == ""){
            location = $("#locationInp").val();
            $("#locationInp").val("");
        }

        var bkApiUrl = "https://openlibrary.org/search.json?q=";
        var searchTemp = bookSearchTitle.replace(/ /g, "+");
        var query = bkApiUrl + searchTemp;

        $.ajax({
            url: query,
            method: "GET",
            success: function(response){
                libraryArr = response.docs;
                var indexCounter = 0;
                //loop to get 10 results to display from the array
                for(i = 0; i<10; i++){
                    var arryExist = false; 
                        //move to next result if author, title or publish year is missing. 
                        while(arryExist == false){
                            if (libraryArr[indexCounter]["author_name"] === undefined || libraryArr[indexCounter]["title"] === undefined || libraryArr[indexCounter]["first_publish_year"] === undefined || libraryArr[indexCounter]["cover_i"] === undefined){
                                indexCounter++;
                            }
                            else{
                                arryExist = true;
                            }
                        }
                        displayLibArry(libraryArr,indexCounter)
                        indexCounter++
                }
            }
        })
       
        hideExcept([".homeButton",".page2"]);
    })

    $(".homeButton").on("click",function(){
        //clearall function
        hideExcept([".page1"]);
    })

    $(document).on("click", ".bkResults", function(){
        var index = this.value;
        if(finalResults[index] != null){
            displaySongs(finalResults,index);
            //displayBook;
            //displayWeather;
            hideExcept([".homeButton",".toSearchButton",".page3"]);
        }
        else{
            var subject = "";
            var title = libraryArr[index].title;
            if(libraryArr[index].subject != undefined){
                subject = libraryArr[index].subject;
            }
            else{
                subject = "book";
            }
            var weatherKeyWord ="";
            var weatherDescription ="";
            // itunesSearch(title,countryCode),itunesSearch(subject,countryCode),itunesSearch(weatherKeyWord,countryCode),itunesSearch(weatherDescription,countryCode)
            $.when(itunesSearch("chanmina"),itunesSearch("new hope club"),itunesSearch("10cm"),itunesSearch("bts")).done(function(a1,a2,a3,a4){
                titleSongs = JSON.parse(a1[0]).results;
                subjectSongs = JSON.parse(a2[0]).results;
                weatherSongs = JSON.parse(a3[0]).results;
                keywordSongs = JSON.parse(a4[0]).results;

                addToFinalSongs(titleSongs,5,finalSongsArr);
                addToFinalSongs(subjectSongs,5,finalSongsArr);
                addToFinalSongs(weatherSongs,5,finalSongsArr);
                addToFinalSongs(keywordSongs,5,finalSongsArr);
                shuffle(finalSongsArr);
                finalResults[index] = finalSongsArr;
                displaySongs(finalResults,index);
                console.log(finalResults);
                //displayBook;
                //displayWeather;
                hideExcept([".homeButton",".toSearchButton",".page3"]);
            })
        }
        
    })

    $(".toSearchButton").on("click",function(){
        hideExcept([".homeButton",".page2"]);
    })


    //***************FUNCTION within Scope  *************/

    //function if successfuly obtained user geolocation
    function success(position) {
        var currentLat = "lat=" + position.coords.latitude
        var currentLon = "lon=" + position.coords.longitude
        var geoCoorUrl = "https://api.openweathermap.org/data/2.5/weather?"
        var apiKey = "&units=imperial&appid=1a6304f914f966e5dc4a8226a424190d" 
        var queryURL = geoCoorUrl + currentLat + "&" + currentLon + apiKey
        $.ajax({
            url: queryURL,
            method: "GET",
            success: function(response){
                weather = response
                location = response.name
                countryCode = response.sys.country
                $(".searchButton").show()
            }
        })  
    }

    //function if failed to obtain user geolocation. Display location input for user to manually enter
    function error() {
        $("#locationInp").show()
        $(".searchButton").show()
    }

})

function hideExcept(array){
    var hideElements = [".page1",".homeButton",".toSearchButton", ".page2",".page3"];
    for (var i=0; i<array.length; i++){
        $(array[i]).attr("style","display:block");
        hideElements.splice( hideElements.indexOf(array[i]), 1 );
    }
    for(var i =0; i<hideElements.length;i++){
        $(hideElements[i]).attr("style","display:none");
    }
}

// function propagateOptions(array){
//     for (var i =0; i<array.length ; i++){
//         var tempCountry = $("<option>").attr("value", array[i].Code);
//         tempCountry.text(array[i].Country);
//         $("#countryOptions").append(tempCountry);
//     }
// }

//makes the new html elements and appends them to display library search results
function displayLibArry(arry, counter){
    var newBtn = $("<button class='button columns bkResults' value='" + counter + "'>");
    var fgTemp = $("<figure class='column is-2'>");
    var imgTemp = $("<img class='bkImg' src='https://covers.openlibrary.org/b/id/" + arry[counter].cover_i + "-M.jpg'>");
    var divTemp = $("<div class='bkInfo column'>");
    var strTitle = $("<strong class='bkTitle'>").text(arry[counter].title);
    var authorTemp = $("<p class='bkElements'>").text("By: " + arry[counter].author_name[0]);
    var yearTemp = $("<p class='bkElements'>").text("Publish Year: " + arry[counter].first_publish_year);
    
        divTemp.append(strTitle);
        divTemp.append(authorTemp);
        divTemp.append(yearTemp);
        fgTemp.append(imgTemp);
        newBtn.append(fgTemp);
        newBtn.append(divTemp);
        $(".wrapperPg2").append(newBtn);
}

function itunesSearch(word,countryCode){
    var ituneQuery = "https://itunes.apple.com/search?term="+word; //&country=ca"
    return $.ajax({
        url: ituneQuery,
        method: "GET"
    })
}

function addToFinalSongs(inputArray,weight,outputArray){
    var scale = weight/10;
    var length = Math.floor(scale*inputArray.length);
    shuffle(inputArray);
    for(var i =0; i<length;i++){
        outputArray.push(inputArray[i]);
    }
}

function displaySongs(object,index){
    $(".musicSelection").empty();
    var tempArray = object[index];
    var songCount = 0;
    var songIndex =0;
    while(songCount<10){
        var tempItem = tempArray[songIndex];
        if(tempItem.kind == "song"){
            var tempHead = $("<div>").attr("class", "musicChoice tile is-child box");
            var tempImageHead = $("<figure>").attr("class","media-left");
            var tempImageContainer = $("<p>").attr("class","image is-64x64");
            var tempImage = $("<img>").attr("src",tempItem.artworkUrl100);
            tempImageHead.append(tempImageContainer.append(tempImage));

            var tempSongHead =$("<div>").attr("class","media-content");
            var tempSongContainer =$("<div>").attr("class","content");
            var tempSongText=$("<p>");
            var tempSongTitle = $("<strong>").text(tempItem.trackName+"\n");
            var tempSongArtist =$("<small>").text(tempItem.artistName);
            tempSongText.append(tempSongTitle,tempSongArtist);
            var tempSongPlayer = $("<audio controls>");
            var tempSongSource = $("<source>").attr("src",tempItem.previewUrl);

            tempSongHead.append(tempSongContainer.append(tempSongText,tempSongPlayer.append(tempSongSource)));

            tempHead.append(tempImageHead,tempSongHead);
            $(".musicSelection").append(tempHead);
            songIndex++;
            songCount++;
        }
        else{
            songIndex++;
        }
    }
}

function shuffle(array){
    array.sort(() => {
        return Math.random() - 0.5;
    });
}