const got = require('got');

exports.getContinents = async (req, res) => {
    try {
        const continents = await got(`${process.env.API_URL}/continents`, 
        {
            searchParams: {
                page_size: 100,
            },
            username: process.env.API_BASE_USER_NAME,
            password: process.env.API_BASE_USER_PASSWORD,
            responseType: 'json', 
            resolveBodyOnly: true
        });

        if(continents.currentPagesEntities)
            res.status(200).send(continents.currentPagesEntities);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.getRegions = async (req, res, next) => {
    try {
        const { continent } = req.query;
        const regions = await got(`${process.env.API_URL}/regions`, 
        {
            searchParams: {
                page_size: 1000,
                ...(parseInt(continent) ? {continent_id: continent} : {})
            },
            username: process.env.API_BASE_USER_NAME,
            password: process.env.API_BASE_USER_PASSWORD,
            responseType: 'json', 
            resolveBodyOnly: true
        });
       
        if(regions.currentPagesEntities)
            res.status(200).send(regions.currentPagesEntities);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.getCountries = async (req, res, next) => {
    try {
        const { continent, region } = req.query;
        const countries = await got(`${process.env.API_URL}/countries`, 
        {
            searchParams: {
                page_size: 2000,
                ...(parseInt(continent) ? {continent_id: continent} : {}),
                ...(parseInt(region) ? {region_id: region} : {})
            },
            username: process.env.API_BASE_USER_NAME,
            password: process.env.API_BASE_USER_PASSWORD,
            responseType: 'json', 
            resolveBodyOnly: true
        });
       
        if(countries.currentPagesEntities)
            res.status(200).send(countries.currentPagesEntities);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.getCities = async (req, res, next) => {
    try {
        const { continent, region, country } = req.query;
        const cities = await got(`${process.env.API_URL}/cities`, 
        {
            searchParams: {
                page_size: 5000,
                ...(parseInt(continent) ? {continent_id: continent} : {}),
                ...(parseInt(region) ? {region_id: region} : {}),
                ...(parseInt(country) ? {country_id: country} : {})
            },
            username: process.env.API_BASE_QUERY_NAME,
            password: process.env.API_BASE_USER_PASSWORD,
            responseType: 'json', 
            resolveBodyOnly: true,
            https: {
                rejectUnauthorized: false
            }
        });
       
        if(cities.currentPagesEntities)
            res.status(200).send(cities.currentPagesEntities);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.getRadiosByFilters = async (req, res, next) => {
    try {
        const { country, city } = req.query;
        if(!city && !country) {
            res.status(400).send('City or country is an obligatory field');
            return;
        }

        const radiostations = await got(`${process.env.API_URL}/monitored_channels/detailed`, 
        {
            searchParams: {
                page_size: 5000,
                sort_direct: 'ASCENDING',
                web_only: 'ANY',
                ...(parseInt(country) ? {country_id: country} : {}),
                ...(parseInt(city) ? {city_id: city} : {})
            },
            username: process.env.API_BASE_QUERY_NAME,
            password: process.env.API_BASE_USER_PASSWORD,
            responseType: 'json', 
            resolveBodyOnly: true,
            https: {
                rejectUnauthorized: false
            }
        });
        
        if(radiostations.currentPagesEntities){
            const stabilityList = await getRadiosStabilityList(radiostations.currentPagesEntities);
            const radiostationsWithStatus = radiostations.currentPagesEntities.map(radio => 
                ({...radio, 
                    stability: stabilityList.find(stabilityItem => stabilityItem.channel_id === radio.id).stability
                }))
            res.status(200).send(radiostationsWithStatus);
        }

    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

function getRadiosStabilityList (channels) {
    const channelsStabilityPromises = channels.map(channel => checkStability(channel.id));
        return Promise.all(channelsStabilityPromises);
}

function checkStability (channel_id){
    return got(`${process.env.EXPERIMENTAL_API_URL}/stability/check_stability`, 
        {
            searchParams: {
                channel_id
            },
            username: process.env.EXPERIMENTAL_API_USER,
            password: process.env.EXPERIMENTAL_API_USER_PASS,
            responseType: 'json', 
            resolveBodyOnly: true,
            https: {
                rejectUnauthorized: false
            },
            hooks: {
                afterResponse: [(response) => {
                    if(response && response.body){
                        response.body = { ...response.body, channel_id }
                    }
                    return response;
                }]
            }
        });

  }
