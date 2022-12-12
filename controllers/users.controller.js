const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const check = require('../utils/check');
let getUsers = async function (req, res) {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    if(limit < 0 || offset < 0 || isNaN(limit) || isNaN(offset) || limit > 100) {
        res.status(400).send({message: "Bad request"});
        return;
    }
    try{
        let users = await User.find({}).skip(offset).limit(limit);
        //users = users.map(user => ({username: user.username, link: '/api/users/' + user.username}));
        const count = await User.countDocuments({});
        res.status(200).send({users,
            _pagination:{_next:offset+limit <= count ? '/api/users?limit=' + limit + '&offset=' + (offset + limit) : null,
                _prev: offset-limit >= 0 ? '/api/users?limit=' + limit + '&offset=' + (offset - limit) : null,
                _count: count}});
        return
    } catch (err) {
        res.status(500).send({message: "Internal server error"});
    }
}

let postUser = async function (req, res) {
    const name = req.body.name;
    const surname = req.body.surname;
    let password = req.body.password;
    if(!check([name, surname, password])){
        res.status(400).send({message: "Bad request"});
        return;
    }
    try{
        //let username = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const username = Math.random().toString(36).substring(2, 7);
        const user = await User.findOne({'username': username});
        if(user){
            throw new Error("Server didnt generate unique username try again");
        }
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const newUser = new User({username, password, name, surname});
        await newUser.save();
        res.setHeader('Location', '/api/users/' + username);
        res.status(201).send({message: "User created"});
    } catch (err) {
        res.status(500).send({message: "Internal server error", error: err});
    }
}

module.exports = { getUsers, postUser }