const router = require('express').Router();
const moment = require('moment');
const uuid = require('uuid/v1');
const path = require('path');
const fs = require('fs');

const errors = require('./errors');

router.get('/', (req, res, next) => {
  try {
    const files = fs.readdirSync(req.app.get('db_path'));

    const data = [];

    for (let f of files) {
      if (f === '.gitignore')
        continue;

      let rule = fs.readFileSync(path.join(req.app.get('db_path'), f), 'utf-8');
      data.push(JSON.parse(rule));
    }

    res.json(data);
  } catch (e) {
    return next(e);
  }
});

router.post('/', (req, res, next) => {
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
        if (isNaN(parseInt(d)) || parseInt(d) < 0 || parseInt(d) > 6)
          return next(errors.InvalidWeekDaysElementType);

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
  const data = {
    id: uuid(),
    rule_type: req.body.rule_type,
    day: req.body.day,
    week_days: req.body.week_days,
    intervals: req.body.intervals
  };

  fs.writeFile(path.join(req.app.get('db_path'), data.id + '.json'), JSON.stringify(data), (err) => {
    if (err)
      return next(err);

    res.json(data);
  });
});

router.get('/:id', (req, res, next) => {
  fs.readFile(path.join(req.app.get('db_path'), req.params.id + '.json'), 'utf-8', (err, data) => {
    if (err)
      return next(err);

    res.json(JSON.parse(data));
  });
});

router.delete('/:id', (req, res, next) => {
  const file = path.join(req.app.get('db_path'), req.params.id + '.json');
  if (fs.existsSync(file)) {
    fs.unlink(file, (err) => {
      if (err)
        return next(err);

      res.json(`Rule ${req.params.id} was deleted successfully.`);
    });
  } else
    return next(errors.RuleNotFound);
});

module.exports = router;
