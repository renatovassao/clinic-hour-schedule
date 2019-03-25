const router = require('express').Router();
const moment = require('moment');
const uuid = require('uuid/v1');
const path = require('path');
const fs = require('fs');

const errors = require('./errors');

router.post('/create', (req, res, next) => {
  // rule type validation
  switch (req.body.rule_type) {
    case 'ONE_DAY':
      if (!moment(req.body.day, 'DD-MM-YYYY', true).isValid())
        return next(errors.InvalidDay);
      break;

    case 'DAILY':
      break;

    case 'WEEKLY':
      if (!Array.isArray(req.body.week_days) || req.body.week_days.length < 1)
        return next(errors.InvalidWeekDaysType);

      for (let d of req.body.week_days)
        if (isNaN(parseInt(d)) || parseInt(d) < 0 || parseInt(d) > 7)
          return next(errors.InvalidDaysWeekElementType);

      break;

    default:
      return next(errors.InvalidRuleType);
      break;
  }

  // intervals validation
  if (!Array.isArray(req.body.intervals) || req.body.intervals.length < 1)
    return next(errors.InvalidIntervalsType);

  for (let d of req.body.intervals) {
    if (!moment(d.start, 'HH:mm', true).isValid() || !moment(d.end, 'HH:mm', true).isValid())
      return next(errors.InvalidTime);
  }

  // save rule
  const data = Object.assign({ id: uuid(), rule_type: null, day: null, week_days: null, intervals: null }, req.body);

  fs.writeFileSync(path.join(__dirname, '..', 'db', 'rules', data.id + '.json'), JSON.stringify(data));

  res.json({data: data});
});

module.exports = router;

let dayObj = {
  rule_type: "ONE_DAY",
  day: 'DD-MM-YYY',
  intervals: [{
    start: "HH:MM",
    end: "HH:MM"
  },{
    start: "HH:MM",
    end: "HH:MM"
  }]
}

let dailyObj = {
  rule_type: "DAILY",
  intervals: [{
    start: "HH:MM",
    end: "HH:MM"
  },{
    start: "HH:MM",
    end: "HH:MM"
  }]
}

let weeklyObj = {
  rule_type: "WEEKLY",
  week_days: [0, 2, 3],
  intervals: [{
    start: "HH:MM",
    end: "HH:MM"
  },{
    start: "HH:MM",
    end: "HH:MM"
  }]
}
