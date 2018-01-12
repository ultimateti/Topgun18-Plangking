var express = require('express');
var router = express.Router();
var alertctrl = require('../controllers/AlertController')

router.post('/', function(req, res) {
	alertctrl.save(req, res)
});

router.get('/', function(req, res) {
	alertctrl.list(req, res)
})

module.exports = router;