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
    
    let classes = ['ratings-small','star','field_stars_rating','csm_review'];
    
    let ratingString = $('.' + classes.join('.')).first()
                            .toggleClass(classes.join(' '))
                            .attr('class')
                            .replace('rating-', '');

    return parseInt(ratingString);
}

function parseCSMOneLiner($) {
    // Classes found in DOM: field, field-name-field-one-liner, field-type-text, field-label-hidden
    // Then need the children from this...
    let oneLineField = $('.field.field-name-field-one-liner.field-type-text.field-label-hidden').first()
    return oneLineField.children().first().children().first().text();
}

function parseGuidanceRating($) {
    //
    // content-grid-rating field_content_grid_rating field_collection_content_grid
    // content-grid-4
    let classes = ['content-grid-rating', 'field_content_grid_rating', 'field_collection_content_grid'];
    let categoryRatingString = $.find('.' + classes.join('.')).first()
                                .toggleClass(classes.join(' '))
                                .attr('class');
    return parseInt(categoryRatingString.replace('content-grid-', ''));
}


function parseGuidanceDescription($) {
    // field field-name-field-content-grid-rating-text field-type-text-long field-label-hidden
    let classes = ['field','field-name-field-content-grid-rating-text','field-type-text-long','field-label-hidden']
    return $.find('.'+classes.join('.')).first().find('.field-item.even').first().text();
}

function parseGuidanceCategory($) {
    return {
        rating: parseGuidanceRating($),
        description: parseGuidanceDescription($)
    }
}

function parseCSMParentGuidances($) {

    // Each category rating has a the following classes:
    // content-grid-rating field_content_grid_rating field_collection_content_grid
    // There is also a 'content-grid-<<VALUE>>, like content-grid-4 or content-grid-2 which is the rating

    let playability = $('#content-grid-item-playability');
    let violence = $('#content-grid-item-violence');
    let sex = $('#content-grid-item-sex');
    let language = $('#content-grid-item-language');
    let consumerism = $('#content-grid-item-consumerism');
    let drugs = $('#content-grid-item-drugs');
    
    return {
        playability: parseGuidanceCategory(playability),
        violence: parseGuidanceCategory(violence),
        sex: parseGuidanceCategory(sex),
        language: parseGuidanceCategory(language),
        consumerism: parseGuidanceCategory(consumerism),
        drugs: parseGuidanceCategory(drugs)
    }

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
    let csmGuidance = parseCSMParentGuidances($);

    //let csmPlayLink = parseCSMAndroidBuyLink($);

    

    console.log(`
    Age Rating: ${ageRating}\n
    CSM Rating: ${csmRating}\n
    One Linter: ${csmOneLiner}\n
    Guidances: ${JSON.stringify(csmGuidance, null,2)}
    `)
}

main();