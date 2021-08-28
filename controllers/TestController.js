function get(req, res){
    return res.status(200).json({
        lala: 1
    });
}


module.exports.get = get;
