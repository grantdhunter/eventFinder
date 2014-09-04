var request = require('request');
var cheerio = require('cheerio');
var url = require('url');
var fs = require('fs');
var levenshtein = require('./levenshtein.js');

/**
 * Public function for geting other events from a single event link.
 * @param {string} givenLink The link you want to use to look up other events.
 * @param {function} callback A callback function to get the resulting events.
 */
exports.getEvents = function (givenLink, callback) {

    //Global variable that is the base URL for the site.
    var baseUrl = url.parse(givenLink).protocol + '//' + url.parse(givenLink).hostname;

    getPage(givenLink, callback);


    /**
     * This function crawls up a url until it gets a valid page, it then gets all
     *      links on the page and compares them with original URL to determine if
     *      they are a event links or other types of links.
     * @param {string} link The original event link you want to use to find other
     *      events.
     * @param {function} callback A callback function to get the resulting events.
     */
    function getPage(link, callback) {

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

                    if ($(elem).attr('href') && $(elem).attr('href') !== givenLink) {
                        var link = normalizeUrl($(elem).attr('href'));

                        if (!links.contains(link) && link.indexOf('#') < 0) {
                            links.push(getDistance(link));
                        }
                    }
                });

                links = getBestResults(links, 10);
                callback(links);

            } else {
                getPage(destinationLink, callback);
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
    /**
     * Customized version contains from
     *      http://css-tricks.com/snippets/javascript/javascript-array-contains/
     * Checks if an object with the same link is in the array.
     * @param {string} needle A link you wish to determine if it is in the array
     *      already.
     * @return {boolean} weather the array contains the element or not.
     */
    Array.prototype.contains = function (needle) {
        for (i in this) {
            if (this[i].link === needle) return true;
        }
        return false;
    }
}