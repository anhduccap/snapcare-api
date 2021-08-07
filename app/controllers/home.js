const authMiddleware = require('../middleware/auth');
const searchHelper = require('./helper/search');

async function searchResults(keyword) {
    return await searchHelper.getSearchResult(keyword);
}

// [GET] /
exports.index = async function(req, res, next) {
    // let logged_user_id =  await authMiddleware(req, res, next, false);

    // if(logged_user_id === null || typeof logged_user_id !== 'string') {
    //     logged_user_id = null;
    // }

    res.send('Home page');
}

// [GET] /search
exports.search = async function(req, res, next) {
    console.log(req.query.keyword);
    res.json(searchResults(req.query.keyword));
}

//[GET] /suggest_keyword
exports.suggestKeyword = async function (req, res, next) {

}