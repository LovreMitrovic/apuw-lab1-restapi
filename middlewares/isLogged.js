const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const setUpUser = function (req, res, next) {
    const authHeader = req.get('Authorization');
    try{
        if(authHeader.split(' ')[0] !== 'Basic'){
            throw new Error('You need to use Basic authentication');
        }
        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii');
        const username = credentials.split(':')[0];
        const password = credentials.split(':')[1];
        req.user = {username, password};
    }catch (err) {
        req.user = {username:null, password:null};
    }
    next()

}

isLoggedIn = async function (req, res, next) {
    if(!req.user){
        res.status(401).send({message: "Unauthorized: Use Basic authentication"});
        return;
    }
    const userFromDb = await User.findOne({'username': req.user.username});
    if(!userFromDb){
        res.status(401).send({message: "Unauthorized: User doesnt exist"});
        return;
    }
    const validPassword = await bcrypt.compare(req.user.password, userFromDb.password);
    if(!validPassword){
        res.status(401).send({message: "Unauthorized: Wrong password"});
        return;
    }
    next();
}

module.exports = {setUpUser, isLoggedIn}