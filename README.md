# eventFinder


This is the technical test for SpotOn.it. It crawls a given webpage and returns 10 URLs of events on that domain.

eventFinder utilize request.js, cheerio.js and compares urls using Levenshtein Distances.

## How to use it:
1. clone from github https://github.com/grantdhunter/eventFinder
2. run npm install to get required libraries
3. include it in your project and implement.
'''javascript
//use path to the eventFinder.js file
var eventFinder = require('./eventFinder.js');

eventFinder.getEvents(<<link to search>>, function(links) {
  //use the returned links
});
'''

## Test Links:
- http://calendar.boston.com/lowell_ma/events/show/274127485-mrt-presents-shakespeares-will
- http://www.sfmoma.org/exhib_events/exhibitions/513
- http://www.workshopsf.org/?page_id=140&id=1328
- http://events.stanford.edu/events/353/35309/
- http://www.meetup.com/startupedmonton/events/200764552/
- http://www.eventbrite.com/e/sausalito-art-festival-2014-tickets-11831764125?aff=ehometext&rank=0 

## Notes: 
Other than www.workshopsf.org this works pretty good. Workshopsf looks like it is built on wordpress and there is no easy way of finding the events page. 


## TODO: 
- Find a better way to handle site like www.workshopsf.org, maybe look at the navigation bar for words such as 'Event', 'Events', 'Exhibition', 'calendar'.

- look for links that are not in <a></a> tags or links that could be generated using javascript.

- More robust URL comparison, Other string metric algorythim or even regular expression.