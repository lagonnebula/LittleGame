/**
 * Created by Meuhmeuh on 01/03/2015.
 */
(function(){
    var listener = new window.keypress.Listener($("#box-game"));


    listener.simple_combo("up", function() {
        console.log("You pressed shift and q");
    });

    listener.simple_combo("down", function() {
        console.log("You pressed shift and down");
    });

    listener.simple_combo("left", function() {
        console.log("You pressed shift and left");
    });

    listener.simple_combo("right", function() {
        console.log("You pressed shift and right");
    });
})();