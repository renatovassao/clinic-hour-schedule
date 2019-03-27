const router = require('express').Router();
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const errors = require('./errors');

router.get('/', (req, res, next) => {
  try {
    const start = moment(req.query.start, 'DD-MM-YYYY', true);
    const end = moment(req.query.end, 'DD-MM-YYYY', true);

    if (!start.isValid() || !end.isValid())
      throw errors.InvalidInterval;

    const files = fs.readdirSync(req.app.get('db_path'));

    const map = new Map();

    for (let f of files) {
      if (f === '.gitignore')
        continue;

      let rule = JSON.parse(fs.readFileSync(path.join(req.app.get('db_path'), f), 'utf-8'));

      switch (rule.rule_type) {
        case 'ONE_DAY':
          let day = moment(rule.day, 'DD-MM-YYYY', true);
          if (start.isSameOrBefore(day) && end.isSameOrAfter(day)) {
            if (!map.get(rule.day))
              map.set(rule.day, rule.intervals)
            else
              map.set(rule.day, map.get(rule.day).concat(rule.intervals))
          }
          
          break;

        case 'DAILY':
          let s = moment(req.query.start, 'DD-MM-YYYY', true);
          for (let i = 0; i <= end.diff(start, 'days'); i++) {

            let day = s.format('DD-MM-YYYY');

            if (!map.get(day))
              map.set(day, rule.intervals)
            else
              map.set(day, map.get(day).concat(rule.intervals))

            s.add(1, 'days');
          }
          break;

        case 'WEEKLY':
          let t = moment(req.query.start, 'DD-MM-YYYY', true);
          for (let i = 0; i <= end.diff(start, 'days'); i++) {
            if (rule.week_days.includes(t.day())) {
              let day = t.format('DD-MM-YYYY');

              if (!map.get(day))
                map.set(day, rule.intervals)
              else
                map.set(day, map.get(day).concat(rule.intervals))
            }

            t.add(1, 'days');
          }
          break;

      }
    }

    const data = [];

    for (let [key, val] of map) {
      data.push({day: key, intervals: val});
    }

    // sort data by days
    data.sort(function(a, b) {
      let A = moment(a.day, 'DD-MM-YYYY', true);
      let B = moment(b.day, 'DD-MM-YYYY', true);

      if (A.isAfter(B))
        return 1;
      if (A.isBefore(B))
        return -1;
      return 0;
    });

    // sort intervals
    for (let h of data) {
      h.intervals.sort(function(a, b) {
        let A = moment(a.end, 'HH:mm', true);
        let B = moment(b.start, 'HH:mm', true);

        if (A.isAfter(B))
          return 1;
        if (A.isBefore(B))
          return -1;
        return 0;
      });
    }

    res.json(data);
  } catch(e) {
    return next(e);
  }
});

module.exports = router;
