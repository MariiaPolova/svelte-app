const got = require('got');

exports.getListBySearch = async (req, res, next) => {
    try {
        const { titleOrArtist, sortProp } = req.query;
        console.log('titleOrArtist, sortProp', titleOrArtist, sortProp);
        const songs = await got(`${process.env.API_URL}/songs/detailed`, 
        {
            searchParams: {
                page_size: 500,
                title_or_artist_like: titleOrArtist || '',
                sort_prop: sortProp || 'SONG_NAME',
                typing: 'FINISHED_TYPING',
                foreign_songs: 'INCLUDE_UNMONITORED'
            },
            username: process.env.API_BASE_QUERY_NAME,
            password: process.env.API_BASE_USER_PASSWORD,
            responseType: 'json', 
            resolveBodyOnly: true
        });
       
        if(process.env.DEBUG_MODE === 'true') {
            console.info(songs);
        }
        res.status(200).send(songs.currentPagesEntities);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}
