$(document).ready(function(){
    $(".searchButton").on("click",function(){
        hideExcept([".homeButton"]);
    })

    $(".homeButton").on("click",function(){
        hideExcept([".page1"]);
    })

})

function hideExcept(array){
    var hideElements = [".page1",".homeButton",".toSearchButton"];
    console.log(hideElements);
    for (var i=0; i<array.length; i++){
        $(array[i]).attr("style","display:block");
        hideElements.splice( hideElements.indexOf(array[i]), 1 );
    }
    for(var i =0; i<hideElements.length;i++){
        $(hideElements[i]).attr("style","display:none");
    }
    console.log(hideElements);
}