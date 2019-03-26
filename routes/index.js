const router = require('express').Router();

const rules = require('./rules');
const hours = require('./hours');

router.use('/rules', rules);
router.use('/hours', hours);

module.exports = router;
