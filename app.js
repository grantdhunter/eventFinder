var request = require('request');
var cheerio = require('cheerio');
var url = require('url');
var fs = require('fs');
var levenshtein = require('./levenshtein.js');

//index 0: node
//index 1: app.js
//index 2: first parameter which will be the url of the event to be parse
var givenLink = process.argv[2]
//Global variable that is the base URL for the site.
var baseUrl = url.parse(givenLink).protocol + '//' + url.parse(givenLink).hostname;

getPage(givenLink);


/**
 * This function crawls up a url until it gets a valid page, it then gets all
 *      links on the page and compares them with original URL to determine if 
 *      they are a event links or other types of links.
 * @param {string} link The original event link you want to use to find other 
 *      events.
 */
function getPage(link) {
    var destinationLink = crawlUp(link);
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
            getPage(destinationLink);
        }
    });
}

/**
 * Step back through the URL by removing the last '/<<segment>>' or
 *      '/<<segment>>/'.
 * @param {string} givenUrl A url you wish to remove the last segment of the
 *       path.
 * @return {string} A new Url.
 */
function crawlUp(givenUrl) {
    givenUrl = givenUrl.split('/');

    //handle if the last '/' was the last character
    if (givenUrl[givenUrl.length - 1] === '') {
        givenUrl.pop();
    }
    givenUrl.pop();
    givenUrl = givenUrl.join('/');
    return givenUrl;
}
/**
 * Gets the Levenshtein distance of a link compared with the original given
 *      link.
 * @param {string} eventLink A URL.
 * @return {object} An object with the eventLink and its distance from the
 *      original link.
 */
function getDistance(eventLink) {

    var distance = levenshtein.getEditDistance(givenLink, eventLink);

    return {
        link: eventLink,
        distance: distance
    }
}
/**
 * Gets the best results based on the distance atrribute.
 * @param {array} links Array of objects with with the attributes link &
 *    distance.
 * @param {number} maxNumber The number of final results you want to output.
 * @return {array} An array of length maxNumber that is sorted based on distance.
 */
function getBestResults(links, maxNumber) {
    //sorts array by ascending distance
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
/**
 * This normalizes all links relative or absolute to a standard URL format.
 * @param {string} aLink This is the link you want normalized.
 * @return {string} A normalized URL.
 */
function normalizeUrl(aLink) {

    //check if its a complete stand alone URL
    if (aLink.indexOf('http') < 0) {
        //checks if the link is from root or a local path
        if (aLink.indexOf('/') !== 0) {
            var path = url.parse(crawlUp(givenLink)).path;
            aLink = baseUrl + path + '/' + aLink;

        } else {
            aLink = baseUrl + aLink;
        }
    }

    return aLink;
}