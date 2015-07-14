var request = require('superagent');

module.exports = function search (word, fn) {
    request.get('https://openapi.youku.com/v2/searches/video/by_keyword.json')
        .query({client_id: 'e35629ad727b6247'})
        .query({keyword: word})
        .end(function (err, res) {
            // console.log(res.body.videos);
            if (res.body && res.body.videos.length) {
                return fn(null, res.body.videos);
            } else {
                return fn(new Error('Bad Youku response'));
            }
        });
}
