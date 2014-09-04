
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
