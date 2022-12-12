module.exports = function check(list){
    for (let variable of list){
        if(variable === undefined){
            return false;
        }
    }
    return true;
}