var express = require('express');
var router = express.Router();
var request = require('request');
/* GET about page. */
router.get('/', function(req, res, next) {
	request('https://jsonplaceholder.typicode.com/users',function (error,data) {
		var data = JSON.parse(data);
	});
  	res.render('about', { title: 'About' });
});

module.exports = router;


function get_data(teamID) {
	var agent = new https.Agent({
		host: 'loraiot.cattelecom.com',
		port: '443',
		path: '/',
		rejectUnauthorized: false
	});
	var options = ({
		method: 'GET',
		agent: agent,
		header: { 'Content-Type': 'application/json'}
	});

	options.url = 'https://loraiot.cattelecom.com/api/pressure/'+teamID+'/all';
	request(options,function(err,res,body) {

	});

}