/**
 * Demo script to show how to implement the eventFinder.
 * How to run - In the terminal type:
 *      node .\app.js '<<event URL>>'
 * This will print out 10 new event links to the terminal
 */

var eventFinder = require('./eventFinder.js');
//index 0: node
//index 1: app.js
//index 2: first parameter which will be the url of the event to be parse
var givenLink = process.argv[2]

eventFinder.getEvents(givenLink, function(links) {
   displayResults(links); 
});

/**
 * Prints results to console.
 * @param {array} links Array of objects with with the attributes link & distance
 */
function displayResults(links) {
    console.log('/************Results***********/');
    for (var i = 0; i < links.length; i++) {
        console.log(links[i].link);
    }
}
