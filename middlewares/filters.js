const bidAndUsername = function (req, res, next){
    res.locals.filter = {bid: req.params.bid, recipient: req.params.username};
    res.locals.bid = req.params.bid;
    res.locals.recipient = req.params.username;
    next();
}

const bidOnly = function (req, res, next){
    res.locals.filter = {bid: req.params.bid};
    res.locals.bid = req.params.bid;
    res.locals.recipient = req.body.recipient;
    next();
}

module.exports = {bidAndUsername, bidOnly};