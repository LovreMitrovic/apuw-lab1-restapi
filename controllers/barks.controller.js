const Bark = require('../models/bark.model');
const User = require('../models/user.model');

const getBarks = async function (req, res) {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    if(limit < 0 || offset < 0 || isNaN(limit) || isNaN(offset) || limit > 100) {
        res.status(400).send({message: "Bad request"});
        return;
    }
    try{
        let barks = await Bark.find({}).skip(offset).limit(limit);
        const count = await Bark.countDocuments({});
        barks = barks.map((bark) => ({...bark, author: '/api/users/' + bark.author, recipient: '/api/users/' + bark.recipient}));
        res.status(200).send({barks,
            _pagination:{_next:offset+limit <= count ? '/api/users?limit=' + limit + '&offset=' + (offset + limit) : null,
                _prev: offset-limit >= 0 ? '/api/users?limit=' + limit + '&offset=' + (offset - limit) : null,
                _count: count}});
    } catch (err) {
        res.status(500).send({message: "Internal server error"});
    }
}

const postBarks = async function (req, res) {
    const author = req.user.username;
    const text = req.body.text;
    const bid = Math.random().toString(36).substring(2, 7);
    const recipient = req.body.recipient;
    try{
        if(!await User.exists({username: recipient})){
            res.status(400).send({message: "Bad request: such recipient does not exist"});
            return;
        }
        const bark = new Bark({bid, author, text, recipient});
        await bark.save();
        res.setHeader('Location', '/api/barks/' + bid);
        res.status(201).send({message: "Bark created"});
    } catch (err) {
        res.status(500).send({message: "Internal server error"});
    }
}

module.exports = { getBarks, postBarks };