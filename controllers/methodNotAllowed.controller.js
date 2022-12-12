module.exports = function(req,res){
    res.status(405).send({message: "Method not allowed"});
    return
}