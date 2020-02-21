$(document).ready(function(){
    var libraryArr = [];
    var weather = {};
    var countryCode = "";
    var finalResults = {}; //push object with finalSongsArr, etc.
    var bookSearchTitle = "";
    var location ="";

    //asks user for current location and save location and weather info.
    navigator.geolocation.getCurrentPosition(success, error);

    $(".searchButton").on("click",function(){
        $(".wrapperPg2").empty()
        
        bookSearchTitle =  $("#bkSearchInp").val();

        if($("#bkSearchInp").val()==""){
            $("#blankModal").show();
            $("#blankModal").delay(5000).fadeOut();
            return;
        }
        if($("#locationInp").val()==""&&location==""){
            $("#blankModal").show();
            $("#blankModal").delay(5000).fadeOut();
            return;
        }

        $("#bkSearchInp").val("");

        if(location == ""){
            location = $("#locationInp").val();
            callWeatherAPI(location,"","");
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
                        displayLibArry(libraryArr,indexCounter);
                        indexCounter++
                }
            }
        })
       
        hideExcept([".homeButton",".page2"]);
    })

    $(".homeButton").on("click",function(){
        finalResults = {};
        hideExcept([".page1"]);
    })

    $(document).on("click", ".bkResults", function(){
        var index = this.value;
        if(finalResults[index] != null){
            displaySongs(finalResults,index);
            displayBook(libraryArr,index);
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
            var weatherDescription =weather.weather[0].main;
            if(weatherKeyWords[weatherDescription] !=undefined){
                weatherKeyWord = weatherKeyWords[weatherDescription];
            }
            $.when(itunesSearch(title,countryCode),itunesSearch(subject,countryCode),itunesSearch(weatherKeyWord,countryCode),itunesSearch(weatherDescription,countryCode)).done(function(a1,a2,a3,a4){
                var finalSongsArr =[];
                var titleSongs = JSON.parse(a1[0]).results;
                var subjectSongs = JSON.parse(a2[0]).results;
                var weatherSongs = JSON.parse(a3[0]).results;
                var keywordSongs = JSON.parse(a4[0]).results;

                addToFinalSongs(titleSongs,5,finalSongsArr);
                addToFinalSongs(subjectSongs,5,finalSongsArr);
                addToFinalSongs(weatherSongs,5,finalSongsArr);
                addToFinalSongs(keywordSongs,5,finalSongsArr);
                shuffle(finalSongsArr);
                finalResults[index] = finalSongsArr;
                displaySongs(finalResults,index);
                displayBook(libraryArr,index);
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
        callWeatherAPI("",position.coords.latitude,position.coords.longitude);
    }


    //function if failed to obtain user geolocation. Display location input for user to manually enter
    function error() {
        $("#locationInp").show();
        $(".searchButton").show();
    }

    function callWeatherAPI(inputLocation, lat, long){
        var baseURL = "https://api.openweathermap.org/data/2.5/weather?";
        var apiKey = "&units=imperial&appid="+weatherAPIKeys["eric"];
        var queryURL = "";
        var currentLocation = "q="+inputLocation;
        var currentLat = "lat=" + lat;
        var currentLon = "lon=" + long;

        if(inputLocation == ""){
            queryURL = baseURL + currentLat + "&" + currentLon + apiKey;
        }
        else{
            queryURL = baseURL+currentLocation+apiKey;
        }
        $.ajax({
            url: queryURL,
            method: "GET",
            success: function(response){
                weather = response;
                location = response.name;
                countryCode = response.sys.country;
                $(".locationTitle").text(location);
                $(".weather-state").text(weather.weather[0].main);
                $(".temperature-f").text(weather.main.temp);
                $(".wind-speed").text(weather.wind.speed);
                $(".Wis-half").attr("src", "http://openweathermap.org/img/wn/"+weather.weather[0].icon+"@2x.png");
                $(".searchButton").show()
            }
        }) 
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
    var ituneQuery = "https://itunes.apple.com/search?term="+word+"&country="+countryCode;
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

function displayBook(array,index){
    $(".bkResults").empty();
    var tempItem = array[index];
    var tempTitle = $("<strong>").attr("class","finalTitle");
    tempTitle.attr("style", "text-align: center;");
    tempTitle.text(tempItem.title);
    var tempBR = $("<br>");
    var tempImg = $("<img>").attr("src", "https://covers.openlibrary.org/b/id/"+tempItem.cover_i+"-L.jpg");
    tempImg.attr("style", "margin-right:auto; margin-left:auto");

    $(".bkResults").append(tempTitle,tempBR,tempImg);

}

function shuffle(array){
    array.sort(() => {
        return Math.random() - 0.5;
    });
}