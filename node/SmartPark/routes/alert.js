var express = require('express');
var router = express.Router();
var alertctrl = require('../controllers/AlertController')

router.get('/', function(req, res) {
	alertctrl.list(req, res)
})

router.post('/', function(req, res) {
	alertctrl.save(req, res)
});

module.exports = router;