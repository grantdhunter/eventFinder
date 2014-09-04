var request = require('request');
var cheerio = require('cheerio');
var url = require('url');
var fs = require('fs');
var levenshtein = require('./levenshtein.js');

//index 0: node
//index 1: app.js
//index 2: first parameter which will be the url of the site to be parse
var givenLink = process.argv[2]
var baseUrl = url.parse(givenLink).protocol + '//' + url.parse(givenLink).hostname;
console.log('givenLink: ' + givenLink);
console.log('baseUrl: ' + baseUrl);
getPage(givenLink);



function getPage(link) {
    var destinationLink = crawlUp(link);
    console.log('destination: ' + destinationLink);
    request(destinationLink, function (error, response, body) {

        if (error) {
            console.log(error);
            return;
        }

        var links = [];

        if (response.statusCode === 200) {
            var $ = cheerio.load(body)

            $('a').each(function (i, elem) {
                links.push(getDistance(normalizeUrl($(elem).attr('href'))));
            });

            links = getBestResults(links, 10);
            displayResults(links);

        } else {
            console.log('StatusCode: ' + response.statusCode);
            getPage(destinationLink);
        }
    });
}

function crawlUp(givenUrl) {
    givenUrl = givenUrl.split('/');

    if (givenUrl[givenUrl.length - 1] === '') {
        givenUrl.pop();
    }
    givenUrl.pop();
    givenUrl = givenUrl.join('/');
    return givenUrl;
}

function getDistance(eventLink) {

    console.log('givenLink: ' + givenLink);
    console.log('eventLink: ' + eventLink);

    //var distance = levenshtein.getEditDistance(crawlUp(givenLink), crawlUp(eventLink));
    var distance = levenshtein.getEditDistance(givenLink, eventLink);
    console.log('distance:  ' + distance);
    return {
        link: eventLink,
        distance: distance
    }
}

function getBestResults(links, maxNumber) {
    links = links.sort(function (a, b) {
        if (a.distance > b.distance) {
            return 1;
        } else {
            return -1;
        }
    });

    if (links.length > maxNumber) {
        var maxResults = maxNumber;
    } else {
        var maxResults = links.length;
    }

    return links.slice(0, maxResults);
}

function displayResults(links) {
    console.log('/************Results***********/');
    for (var i = 0; i < links.length; i++) {
        console.log(links[i].link);
    }
}

function normalizeUrl(aUrl) {

    if (aUrl.indexOf('http') < 0) {
        if (aUrl.indexOf('/') !== 0) {
            var path = url.parse(crawlUp(givenLink)).path;
            aUrl = baseUrl + path + '/' + aUrl;
 
        } else {
            aUrl = baseUrl + aUrl;
        }
    }

    return aUrl;
}