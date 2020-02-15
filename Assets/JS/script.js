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


        hideExcept([".homeButton",".page2"]);
    })

    $(".homeButton").on("click",function(){
        //clearall function
        hideExcept([".page1"]);
    })

    $(".bkResults").on("click",function(){
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