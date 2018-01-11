var express = require('express');
var router = express.Router();



router.post('/', function(req, res) {
  console.log(req);
	  var newTable = {
	    teamID: 25,
	    keys: ['team_id','description'],
	    data: {1,'eiei'}
	 };
  res.render('alert',{result: [newTable]});
});

module.exports = router;