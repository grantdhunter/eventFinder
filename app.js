var request = require('request');
var cheerio = require('cheerio');
var url = require('url');
var fs = require('fs');
var levenshtein = require('./levenshtein.js');

//index 0: node
//index 1: app.js
//index 2: first parameter which will be the url of the site to be parse
var givenLink = process.argv[2]
console.log(givenLink);
getPage(givenLink);


function crawlUp(givenUrl) {
    givenUrl = givenUrl.split('/');
    givenUrl.pop();
    givenUrl = givenUrl.join('/');
    return givenUrl;
}

function getPage(link) {
    link = crawlUp(link);
    request(link, function (error, response, body) {
        console.log(link);
        if (error) {
            console.log(error);
            return;
        }

        var links = [];

        if (response.statusCode === 200) {
            var $ = cheerio.load(body)
            $('a').each(function (i, elem) {
                //ignore external links
                if ($(elem).attr('href').indexOf('http') < 0) {
                    links.push(getDistance(link + $(elem).attr('href')));
                } else {
                    links.push(getDistance($(elem).attr('href')));
                }
            });

            links = links.sort(function (a, b) {
                if (a.distance > b.distance) {
                    return 1;
                } else {
                    return -1;
                }
            });

            if (links.length > 10) {
                var maxResults = 10;
            } else {
                var maxResults = links.length;
            }

            console.log('/************Results***********/');
            for (var i = 0; i < maxResults; i++) {
                console.log(links[i].link);
            }
        } else {
            getPage(link);
        }
    });
}



function getDistance(eventLink) {

    var distance = levenshtein.getEditDistance(crawlUp(givenLink), eventLink);
    console.log(eventLink);
    return {
        link: eventLink,
        distance: distance
    }
}


function forwardFilter(link, eventLink) {

}