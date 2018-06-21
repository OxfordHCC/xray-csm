const cheerio = require('cheerio');
const request = require('async-request');
const phantom = require('phantom');

class CSMScraper {

    async requestPage(url) {
        return await request(url);
    }

    parseCSMAgeRating($) {
        return $('.csm-green-age').first().text();
    }

    parseCSMRating($) {
        // Classes found in DOM: ratings-small, star, rating-5, field_stars_rating csm_review
        
        let classes = ['ratings-small','star','field_stars_rating','csm_review'];
        
        let ratingString = $('.' + classes.join('.')).first()
                                .toggleClass(classes.join(' '))
                                .attr('class')
                                .replace('rating-', '');

        return parseInt(ratingString);
    }

    parseCSMOneLiner($) {
        // Classes found in DOM: field, field-name-field-one-liner, field-type-text, field-label-hidden
        // Then need the children from this...
        let oneLineField = $('.field.field-name-field-one-liner.field-type-text.field-label-hidden').first()
        return oneLineField.children().first().children().first().text();
    }

    parseGuidanceRating($) {
        //
        // content-grid-rating field_content_grid_rating field_collection_content_grid
        // content-grid-4
        let classes = ['content-grid-rating', 'field_content_grid_rating', 'field_collection_content_grid'];
        let categoryRatingString = $.find('.' + classes.join('.')).first()
                                    .toggleClass(classes.join(' '))
                                    .attr('class');
        if (categoryRatingString == undefined) {
            return -1;
        }
        return parseInt(categoryRatingString.replace('content-grid-', ''));
    }


    parseGuidanceDescription($) {
        // field field-name-field-content-grid-rating-text field-type-text-long field-label-hidden
        let classes = ['field','field-name-field-content-grid-rating-text','field-type-text-long','field-label-hidden']
        return $.find('.'+classes.join('.')).first().find('.field-item.even').first().text();
    }

    parseGuidanceCategory($) {

        return {
            rating: this.parseGuidanceRating($),
            description: this.parseGuidanceDescription($)
        }
    }

    parseCSMAppName($) {
        //panel-pane pane-node-title csm_app
        return $('.panel-pane.pane-node-title.csm_app').first().children().first().children().first().text();
    }

    parseCSMParentGuidances($) {

        // Each category rating has a the following classes:
        // content-grid-rating field_content_grid_rating field_collection_content_grid
        // There is also a 'content-grid-<<VALUE>>, like content-grid-4 or content-grid-2 which is the rating

        let playability = $('#content-grid-item-playability');
        let violence = $('#content-grid-item-violence');
        let sex = $('#content-grid-item-sex');
        let language = $('#content-grid-item-language');
        let consumerism = $('#content-grid-item-consumerism');
        let drugs = $('#content-grid-item-drugs');
        let educational = $('#content-grid-item-educational');
        
        return {
            playability: this.parseGuidanceCategory(playability),
            violence: this.parseGuidanceCategory(violence),
            sex: this.parseGuidanceCategory(sex),
            language: this.parseGuidanceCategory(language),
            consumerism: this.parseGuidanceCategory(consumerism),
            drugs: this.parseGuidanceCategory(drugs),
            educational: this.parseGuidanceCategory(educational)
        }

    }

    async parseCSMAndroidBuyLink(url) {
        // Classes found in DOM: click -> .buy-button, then look for -> buy-link, googleplay
        const instance = await phantom.create();
        const page = await instance.createPage();
        await page.on('onResourceRequested', function(requestData) {
            //console.info('Requesting', requestData.url);
        });
        const status = await page.open(url);
        const content = await page.property('content');
        
        let $ = cheerio.load(content);
        let play_store_url = $('.googleplay').first().attr('href');
        await instance.exit();
        return play_store_url;
    }

    async parseCSMPage(url) {
        let response = await this.requestPage(url);

        let $ = cheerio.load(response.body);
        
        let play_store_url = await this.parseCSMAndroidBuyLink(url);
        let app_package_name = play_store_url.split('=')[1];
        return {
            name: this.parseCSMAppName($),
            age_rating: this.parseCSMAgeRating($),
            csm_rating: this.parseCSMRating($),
            one_liner: this.parseCSMOneLiner($),
            csm_uri: "",
            play_store_url: play_store_url,
            app_package_name: app_package_name, // from playstore url.
            parental_guidances: this.parseCSMParentGuidances($)
        }
    }
}

module.exports = CSMScraper;