var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/esp", (req, res) => {

  res.send("Request received");
  
})

module.exports = router;
