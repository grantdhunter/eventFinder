# eventFinder


This script crawls a given web page and returns 10 URLs of events on that domain.

eventFinder utilize request.js, cheerio.js and compares urls using Levenshtein Distances.

## How to use it:
1. clone from github https://github.com/grantdhunter/eventFinder
2. run npm install to get required libraries
3. include it in your project and implement.
```javascript
//use path to the eventFinder.js file
var eventFinder = require('./eventFinder.js');

eventFinder.getEvents(<<link to search>>, function(links) {
  //use the returned links
});
```

## Test Links:
- http://calendar.boston.com/lowell_ma/events/show/274127485-mrt-presents-shakespeares-will
- http://www.sfmoma.org/exhib_events/exhibitions/513
- http://www.workshopsf.org/?page_id=140&id=1328
- http://events.stanford.edu/events/353/35309/
- http://www.meetup.com/startupedmonton/events/200764552/
- http://www.eventbrite.com/e/sausalito-art-festival-2014-tickets-11831764125?aff=ehometext&rank=0 

## Notes: 
From these tests most links were crawled successfully and returned proper event link. Due to the fact that this solution uses the higher levels of the URL to find the event listing page, it does not perform as well on www.workshopsf.org.  This is due to the fact that this page uses a page_id for navigation (wordpress) and it is not easy to find the event list page programmatically. For www.workshopsf.org they do have events on the main page, and this solution returns them but it also returns other links because the small number of events (less than ten events).


## TODO: 
- Find a better way to handle site like www.workshopsf.org, maybe look at the navigation bar for words such as 'Event', 'Events', 'Exhibition', 'calendar'.

- look for links that are not in <a></a> tags or links that could be generated using javascript.

- More robust URL comparison, other string metric algorithm or even regular expression. Better filtering of the URLs.

