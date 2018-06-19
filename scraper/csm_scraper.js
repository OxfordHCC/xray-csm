const cheerio = require('cheerio');
const request = require('async-request');



async function requestPage(url) {
    return await request(url);
}

function parseCSMAgeRating($) {
    return $('.csm-green-age').first().text();
}

function parseCSMRating($) {
    // Classes found in DOM: ratings-small, star, rating-5, field_stars_rating csm_review
    let ratingsClasses = ['rating-0','rating-1','rating-2','rating-3','rating-4','rating-5']
    let rating = $('.ratings-small.star.field_stars_rating.csm_review').first();

    for(i=0;i<ratingsClasses.length;i++) {
        if(rating.hasClass(ratingsClasses[i])) {
            return i;
        }
    }
    return -1;
}

function parseCSMOneLiner($) {
    // Classes found in DOM: field, field-name-field-one-liner, field-type-text, field-label-hidden
    // Then need the children from this...
    let oneLineField = $('.field.field-name-field-one-liner.field-type-text.field-label-hidden').first()
    return oneLineField.children().first().children().first().text();
}


// need to change the approach to scraping these links, the button HAS to be interacted with,
// consider the use of some headless browser, something like JSDOM or PhantomJS should do.
function parseCSMAndroidBuyLink($) {
    // Classes found in DOM: buy-link, googleplay
    let link =  $('.buy-links')//('.buy-link.googleplay').length//.first().attr('href').toString();;
    console.log(link);
    return link;
}

async function main() {
    var csm = 'https://www.commonsensemedia.org/app-reviews/backbreaker-football';
    //csm = 'https://www.commonsensemedia.org/app-reviews/tagged-chill-chat-go-live';
    
    let response = await requestPage(csm);

    console.log(`Status Code: ${response.statusCode}`);
    let $ = cheerio.load(response.body);

    let ageRating = parseCSMAgeRating($);
    let csmRating = parseCSMRating($);
    let csmOneLiner = parseCSMOneLiner($);

    //let csmPlayLink = parseCSMAndroidBuyLink($);

    console.log(`
    Age Rating: ${ageRating}\n
    CSM Rating: ${csmRating}\n
    One Linter: ${csmOneLiner}\n
    `)
}

main();