const router = require('express').Router();
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const errors = require('./errors');

const db_path = path.join(__dirname, '..', 'db', 'rules');

router.use('/', (req, res, next) => {
  try {
    const start = moment(req.query.start, 'DD-MM-YYYY', true);
    const end = moment(req.query.end, 'DD-MM-YYYY', true);

    if (!start.isValid() || !end.isValid())
      throw errors.InvalidInterval;

    const files = fs.readdirSync(db_path);

    const data = [];

    for (let f of files) {
      if (f === '.gitignore')
        continue;

      let rule = JSON.parse(fs.readFileSync(path.join(db_path, f), 'utf-8'));

      switch (rule.rule_type) {
        case 'ONE_DAY':
          let day = moment(rule.day, 'DD-MM-YYYY', true);
          if (start.isSameOrBefore(day) && end.isSameOrAfter(day))
            data.push({ day: rule.day, intervals: rule.intervals });
          
          break;

        case 'DAILY':
          let s = moment(req.query.start, 'DD-MM-YYYY', true);
          for (let i = 0; i < end.diff(s, 'days') + 1; i++) {
            s.add(i, 'days');

            data.push({ day: s.format('DD-MM-YYYY'), intervals: rule.intervals });
          }
          break;

        case 'WEEKLY':
          let t = moment(req.query.start, 'DD-MM-YYYY', true);
          for (let i = 0; i < end.diff(t, 'days') + 1; i++) {
            t.add(i, 'days');

            if (rule.week_days.includes(t.day()))
              data.push({ day: t.format('DD-MM-YYYY'), intervals: rule.intervals });
          }
          break;

      }
    }

    res.json(data);
  } catch(e) {
    return next(e);
  }
});

module.exports = router;
