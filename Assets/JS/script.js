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
    
    $(".searchButton").on("click",function(){
        location=$(".locationInput").val()
        console.log("we're searching for location ",location)
        
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
        hideExcept([".homeButton",".page2"]);
    })

    $(".homeButton").on("click",function(){
        //clearall function
        hideExcept([".page1"]);
    })

    $(".bkResults").on("click",function(){
        $("#weatherName").text(weather.name)
        $("#weatherState").text(weather.state)
        $("#weatherTemp").text(weather.temp)
        $("#weatherWind").text(weather.wind)
        $("#weatherIcon").attr("src", `http://openweathermap.org/img/wn/${weather.icon}.png`)//template literals
        hideExcept([".homeButton",".toSearchButton",".page3"]);
    })

    $(".toSearchButton").on("click",function(){
        hideExcept([".homeButton",".page2"]);
    })

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