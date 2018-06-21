"use strict";
const config = require('../config/config.json');
const pg = require('pg');

const guidance_categories = {
    playability: 0,
    violence: 1,
    sex: 2,
    language: 3,
    consumerism: 4,
    drugs: 5,
    educational: 6,
}

class DB {
    constructor(module) {
  
        const db_config = config.db;
        db_config.user = config[module].user;
        db_config.password = config[module].password;
        db_config.max = 10;
        db_config.idleTimeoutMillis;

        this.pool = new pg.Pool(db_config);
        this.pool.on('error', (err) => {
            console.log("Client Error:", err.message, err.stack);
        });
    }

    // export the query method for passing queries to the pool
    query(text, values) {
        try {
            if (values){
                console.log('query:', text, values);
            }
            else {
                console.log('query:', text, values);
            }
            return this.pool.query(text, values);
        } catch (err) {
            console.log('Error With Postgres Query');
            throw err;
        }
    }

    async connect() {
        try {
            logger.debug('connecting to db pool');
            const ret = await this.pool.connect();
            ret.lquery = (text, values) => {
                if (values) {
                     logger.debug('lquery:', text, values);
                }
                else {
                    logger.debug('lquery:', text);
                }
                return ret.query(text, values);
            };
            return ret;
        } catch (err) {
            console.log('Failed To Connect To Pool', err);
            throw err;
        }
    }

    async insertCSMAppData(app) {
        console.log(`Inserting info for app: ${app.name}`);

        try {
            await this.query('begin');
            let ret = await this.query('insert into app_infos(app_name, age_rating, csm_rating, one_liner, csm_uri, play_store_url, app_package_name) values ($1,$2,$3,$4,$5,$6,$7) returning id',
                                    [app.name, app.age_rating, app.csm_rating, app.one_liner, app.csm_uri, app.play_store_url, app.app_package_name]
                                )
            let id = ret.rows[0].id;
            for(let category of Object.keys(app.parental_guidances)) {
                let appCat = app.parental_guidances[category];
                await this.query('insert into app_guidances(app_id, category, rating, description) values ($1,$2,$3,$4)',
                    [id, guidance_categories[category], appCat.rating, appCat.description]
                );
            }
            await this.query('commit');
        } 
        catch(err) {
            console.log(`Error inserting infor for app: ${app.name}. Err: ${err}`);
            await this.query('rollback');
        }  
    }
}

module.exports = DB;