var express = require('express');
var router = express.Router();

const geonames = require('../geonames.json').reduce((dict, obj) => {
  dict[obj.geonameid] = obj;

  return dict;
}, {});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:lat/:lng', function(req, res, next) {
  req.app.get('redis').georadius('geonames', req.params.lng, req.params.lat, '100', 'mi', 'COUNT', '1', 'WITHDIST', (err, b) => {
    if (err) {
      console.error(err);
      return res.json(null);
    }

    res.json(b.length ? geonames[b[0][0]] : null);
} );
});

module.exports = router;
