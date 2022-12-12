const Bark = require('../models/bark.model');
const User = require('../models/user.model');

const getBark = async function (req, res) {
    const bid = req.params.bid;
    let bark;
    try{
        const filter = res.locals.filter;
        bark = await Bark.findOne(filter);
    } catch {
        res.status(500).send({message: "Internal server error"});
        return;
    }
    if(!bark) {
        res.status(404).send({message: "Bark not found"});
        return;
    }
    res.status(200).send({text: bark.text, bid: bark.bid, author: '/api/users/' + bark.author, recipient: '/api/users/' + bark.recipient});
}

const putBark = async function (req, res) {
    const bid = res.locals.bid;
    const text = req.body.text;
    const recipient = res.locals.recipient;
    const author = req.user.username;
    try{
        if(!await User.exists({username: recipient})){
            res.status(400).send({message: "Bad request: such recipient does not exist"});
        }
        let bark = await Bark.findOne(res.locals.filter);
        if(!bark){
            res.status(404).send({message: "Bark not found"});
            return;
        }
        if (bark.author !== author) {
            res.status(403).send({message: "Forbidden"});
            return;
        }
        await bark.updateOne({bid, text, author, recipient});
        res.status(200).send({message: "Bark updated"});
    } catch (err) {
        res.status(500).send({message: "Internal server error"});
    }

}

const deleteBark = async function (req, res) {
    try{
        const bark = await Bark.findOne(res.locals.filter);
        if(!bark){
            res.status(404).send({message: "Bark not found"});
            return;
        }
        if(bark.author !== req.user.username){
            res.status(403).send({message: "Forbidden"});
            return;
        }
        //await Bark.deleteOne({bid: bid});
        await bark.deleteOne();
        res.status(200).send({message: "Bark deleted"});
    } catch (err) {
        res.status(500).send({message: "Internal server error"});
    }
}

module.exports = { getBark, putBark, deleteBark };