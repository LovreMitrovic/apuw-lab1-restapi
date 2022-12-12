const User = require('../models/user.model');
const check = require("../utils/check");
const bcrypt = require("bcrypt");
let getUser = function (req, res) {
    let username = req.params.username;
    User.findOne({ "username": username })
        .then(user => {
            if (!user) {
                res.status(404).send({ message: "User not found" });
            } else {
                res.status(200).send(user);
            }
        })
        .catch(() => {res.status(500).send({message: "Internal server error"})});
}

let putUser = async function (req, res) {
    const name = req.body.name;
    const surname = req.body.surname;
    const username = req.params.username;
    let password = req.body.password;
    if(!check([name, surname, password])){
        res.status(400).send({message: "Bad request"});
        return;
    }
    try{
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const user = await User.findOne({'username': username});
        if(user){
            if(req.user.username !== username){
                res.status(403).send({message: "Forbidden"});
                return;
            }
            await user.updateOne({username: username}, {username, password, name, surname});
            res.status(200).send({message: "User updated"});
            return
        }
        const newUser = new User({username, password, name, surname});
        await newUser.save();
        res.setHeader('Location', '/api/users/' + username);
        res.status(201).send({message: "User created"});
    } catch (err) {
        res.status(500).send({message: "Internal server error", error: err});
    }
}

const deleteUser = async function (req, res) {
    try{
        const username = req.params.username;
        if(username !== req.user.username){
            res.status(403).send({message: "Forbidden"});
            return;
        }
        await User.deleteOne({username: username});
        res.status(200).send({message: "User deleted"});
    } catch (err) {
        res.status(500).send({message: "Internal server error"});
    }

}



module.exports = { getUser, putUser, deleteUser };