# XRayCSM
A CSM Data service, providing children and family oriented data about a requested app.

## API

located in `/api` the `xray_csm_api.js` file provides only one endpoint, which is used to request CSM data about a given app identified by a provide app package name.

Endpoint
```
    /apps/<<App Package Name>>
```

Example Curl
```
    curl "localhost:8080/apps/com.hello_november.rudirainbow
```

Example Response
```json
{
    "id": 2023,
    "name": "Rudi Rainbow – Children's Book",
    "age_rating": "age 5+",
    "csm_rating": 4,
    "one_liner": "Fun is in the forecast with cute, playful weather adventure.",
    "csm_uri": "/app-reviews/rudi-rainbow-childrens-book",
    "play_store_url": "https://play.google.com/store/apps/details?id=com.hello_november.rudirainbow",
    "app_package_name": "com.hello_november.rudirainbow",
    "parental_guidances": {
        "playability": {
            "rating": 4,
            "description": "A hand icon help kids know where to tap, though it's not always clear what kids should do in the games.\n"
        },
        "violence": {
            "rating": 1,
            "description": "Kids see wind and some cartoon destruction after Harold Hurricane gets so mad that he causes a hurricane.\n"
        },
        "sex": {
            "rating": 0,
            "description": "No Rating"
        },
        "language": {
            "rating": 0,
            "description": "No Rating"
        },
        "consumerism": {
            "rating": 0,
            "description": "No Rating"
        },
        "drugs": {
            "rating": 0,
            "description": "No Rating"
        },
        "educational": {
            "rating": 3,
            "description": "Kids can learn a variety of weather-related terms like hurricane, snowflake, tornado, and breeze. They'll also hear explanations and watch demonstrations on constellations and the phases of the moon, how hail, lightening, and rain are formed, and what makes wind.\n"
        }
    }
}
```


## How to setup.

You will need node.js in order to run the project.

If you haven’t yet, go [install Node.js](https://nodejs.org/en/download/) which will also install the command-line package manager, npm.

Once you have the above set up on your server you are ready to start!

1. From a Linux environment, clone the repository.
2. initialise a PostgreSQL Database using `init.sql` found in `path_to_repo/db/init.sql` (Prerequsitie: a Postgres server and client running on your system)
3. make a copy of `example_config.json` and rename it to `config.json`
4. update the details of `config.json` so it accurately reflects your DB setup.
5. run `npm install' to install all node packages required for the project
6. use `node js` in the `path_to_repo` to run the ` api/xray_csm_api.js` file using the command of `node api/xray_csm_api.js'
7. from a web browser, navigate to `localhost:8081` or `localhost:<<whatever port>>` if you changed the port number in `config.json`

