var express = require('express');
var router = express.Router();
var bodyParser = require('body');

router.get('/', function(req, res, next) {
	res.locals.myMcu = null;
  	res.render('mcu',{
		users: user
	});
});

router.get('/getall', function(req, res, next) {
  	res.render('mcu',{
		myMcu: res.locals.myMcu
	});
});

router.post('/showrespond', function (req,res,next) {
	console.log("start");
	var mcu = {
		name: req.body.name,
		id: req.body.id
	}
	console.log(mcu);
	res.render('showrespond',{
		myMcu: mcu
	});
});

module.exports = router;
