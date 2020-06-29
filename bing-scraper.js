'use strict';
let https = require("https");
let fs = require("fs");
let subscriptionKey = '15679d2841a349c488f68190ce00ae47';
let host = 'binary-classifier-scraper.cognitiveservices.azure.com';
let path = '/bing/v7.0/images/search';
let term = 'protest';

let count = 150;
let total = 900; // in multiples of 150

let urlList = [];

let response_handler = function (response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        let imageResults = JSON.parse(body);
        if (imageResults.value.length > 0) {

            imageResults.value.map(d => {
                urlList.push(d.contentUrl);
            });

            let nextOffset = imageResults.nextOffset;

            console.log(`Image result count: ${imageResults.value.length}`);
            console.log(`Total results count: ${urlList.length}`);

            if (urlList.length < total){
                let queryCount = (urlList.length + count < total) ? count : total - urlList.length;
                bing_image_search(term, queryCount, nextOffset);
            } else {
                console.log(`Search complete with ${urlList.length} images found`);
                fs.writeFile("response.txt", urlList.toString(), err => {
                    if (err) console.log(err);
                });
                console.log("Results saved to file");
            }
        }
        else {
            console.log("Couldn't find image results!");
        }
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

let bing_image_search = async function (search, count, offset) {
    console.log(`Searching images of ${term} with count ${count} and offset ${offset}`);
    let queryPath = path + `?q=${encodeURIComponent(search)}&count=${count}&offset=${offset}`;
    let request_params = {
        method: 'GET',
        hostname: host,
        path: queryPath,
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        }
    };
    let req = https.request(request_params, response_handler);
    req.end();
}

if (subscriptionKey.length === 32) {
    bing_image_search(term, count, 0);
} else {
    console.log('Invalid Bing Search API subscription key!');
    console.log('Please paste yours into the source code.');
}