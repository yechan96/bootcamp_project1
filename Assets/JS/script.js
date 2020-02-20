$(document).ready(function(){
    var libraryArr = [];
    var finalSongsArr =[];
    var weather = {};
    var countryCode = "";
    var subjectSongs = [];
    var weatherSongs = [];
    var keywordSongs = [];
    var finalResults = []; //push object with finalSongsArr, etc.

    var bookSearchTitle = "";
    var location ="";

    //asks user for current location and save location and weather info.
    navigator.geolocation.getCurrentPosition(success, error)

    $(".searchButton").on("click",function(){
        $(".wrapperPg2").empty()
        bookSearchTitle =  $("#bkSearchInp").val();
        $("#bkSearchInp").val("");
        if(location == ""){

            location = $("#locationInp").val();
            $("#locationInp").val("");
            getWeather()
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
        displayWeather()
        hideExcept([".homeButton",".toSearchButton",".page3"]);
    })

    $(".toSearchButton").on("click",function(){
        hideExcept([".homeButton",".page2"]);
    })


    //***************FUNCTION within Scope  *************/
    function displayWeather(){
        console.log("this is the weather", weather)
        $("#weatherName").text(weather.name)
        $("#weatherState").text(weather.state)
        $("#weatherTemp").text(weather.temp)
        $("#weatherWind").text(weather.wind)
        $("#weatherIcon").attr("src", `http://openweathermap.org/img/wn/${weather.icon}.png`)
    }
    function getWeather(){
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location+ "&units=imperial&appid=f56c94699b79bf806441d23eacbfa401"
        $.get(weatherURL, function(param){
       console.log("success callback")
       weather.name=param.name
       weather.state=param.weather[0].description
       weather.temp=param.main.temp
       weather.wind=param.wind.speed
       weather.icon=param.weather[0].icon
       console.log("weatcher",weather)
   })

    }
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
            success: function(param){
                weather.name=param.name
                weather.state=param.weather[0].description
                weather.temp=param.main.temp
                weather.wind=param.wind.speed
                weather.icon=param.weather[0].icon
                // weather = response
                location = param.name
                countryCode = param.sys.country
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

