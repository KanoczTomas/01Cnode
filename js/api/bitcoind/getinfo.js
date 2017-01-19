module.exports = function(req, res, next){
	res.status(200).json({output: "this is a test"});
	next();
}
