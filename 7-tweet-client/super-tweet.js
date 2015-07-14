var request = require('superagent');
request.get('http://twitter.com/search.json')
    .send({q: 'Justin Bieber'})
    .set('Date', new Date)
    .end(function (res) {console.log(res);});
