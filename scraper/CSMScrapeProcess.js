const CSMScraper = require('./CSMScraper');
const scraper = new CSMScraper();

const DB = require('../db/db');
const db = new DB('csm');

const cheerio = require('cheerio');
const fs = require('fs');

const CSM = 'https://www.commonsensemedia.org';

var csm_results = [];
var pageCount = 0;
var pageAppCount = 0;
var totalAppCount = 0;

async function processCSM() {
    // Start at first page of android apps
    let url = 'https://www.commonsensemedia.org/reviews/category/app/device/android-38'
    let $ = undefined;
    try{
        do {
            pageCount += 1;
            pageAppCount = 0;

            $ = await loadPage(url);
            let links = scrapeAppLinks($);
            for(const link of links) {
                pageAppCount += 1;
                totalAppCount += 1;
                console.log(`Page: ${pageCount} -  Parsing App no ${pageAppCount} of ${links.length} - Total: ${totalAppCount}`);

                let app = await scraper.parseCSMPage(CSM+link);
                app.csm_uri = link;
                csm_results.push(app)
                await db.insertCSMAppData(app);
            }
            url = CSM+getNextPageURL($);
        }
        while(getNextPageURL($) != undefined);
    }
    catch(err) {
        fs.writeFile('ERR_DUMP.json', csm_results, 'utf8');
    }

    fs.writeFile('CSMDump.json', csm_results, 'utf8',(err)=>console.log(err));
    //console.log(`JSON DUMPS: ${JSON.stringify(csm_results,null,2)}`)
}

function getNextPageURL($) {
    return $('.pager-next').first().find('a').first().attr('href');    
}

async function loadPage(url) {
    let response = await scraper.requestPage(url);
    return cheerio.load(response.body);
}

function scrapeAppLinks($) {
    // links are found in element with following classes
    // view view-reviews-browse-search-api view-id-reviews_browse_search_api view-display-id-ctools_context_reviews_browse view-dom-id-2a4e45b1f09bd0619ab6000e7086cccb
    // probably don't need the last one.
    let appLinksContainer = $('.view.view-reviews-browse-search-api.view-id-reviews_browse_search_api.view-display-id-ctools_context_reviews_browse').first();
    let appLinkElements = appLinksContainer.find('.view-content').first().children()
    return appLinkElements.map(function() {
        return $(this).find('.content-content-wrapper').first().first().find('a').first().attr('href');
    }).toArray();
}

async function main() {
    var url = 'https://www.commonsensemedia.org/app-reviews/backbreaker-football';
    //csm = 'https://www.commonsensemedia.org/app-reviews/tagged-chill-chat-go-live';
    
    let parsedPage = await scraper.parseCSMPage(url);


    await processCSM();
}

main();