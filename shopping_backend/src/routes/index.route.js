const newsRouter = require('./news.route');
const clothesRouter = require('./clothes.route');
const siteRouter = require('./site.route');

function route(app) {

    app.use('/news', newsRouter);

    app.use('/clothes', clothesRouter);
    

    app.use('/', siteRouter);

}

module.exports = route;
