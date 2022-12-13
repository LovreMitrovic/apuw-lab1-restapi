const User = require("../models/user.model");
const Bark = require("../models/bark.model");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

mongoose.connect('mongodb://localhost:27017/apuw-lab1', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', true);
async function init(){
    await User.deleteMany({});
    await Bark.deleteMany({});
    let password = 'admin';
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const adminObj = {name:'admin', surname:'admin', password};
    const adminUsername = 'admin';
    const admin = new User({...adminObj, username: adminUsername});
    await admin.save();

    /*const barkId = 'r5p43';
    const barkWithRecipient = {text:'bark', recipient: adminUsername};
    const bark = new Bark({...barkWithRecipient, author: adminUsername, bid: barkId});
    await bark.save();*/
}

init().then(() => console.log('done')).catch(err => console.log(err));