const router = require('express').Router();
const moment = require('moment');
const uuid = require('uuid/v1');
const path = require('path');
const fs = require('fs');

const errors = require('./errors');

/**
 * @api {get} /rules List all rules
 * @apiGroup Rules
 *
 * @apiSuccess {Object[]} rules List of rules
 * @apiSuccess {String} rules.id Rule id
 * @apiSuccess {String} rules.rule_type Rule type ('ONE_DAY', 'DAILY', 'WEEKLY')
 * @apiSuccess {String} rules.day Rule day
 * @apiSuccess {Integer[]} rules.week_days Rule week days
 * @apiSuccess {Object[]} rules.intervals Rule intervals
 * @apiSuccess {String} rules.intervals.start Rule intervals start
 * @apiSuccess {String} rules.intervals.end Rule intervals end
 * @apiSuccessExample {json} Success Response
 *  HTTP/1.1 200 OK
 *  [
 *    {
 *      "id": "e5efe2d0-51a8-11e9-be65-6fb595927377",
 *      "rule_type": "ONE_DAY",
 *      "day": "28-03-2019",
 *      "intervals": [
 *        {
 *          "start": "01:00",
 *          "end": "02:00"
 *        },
 *        {
 *          "start": "03:00",
 *          "end": "04:00"
 *        }
 *      ]
 *    },
 *    {
 *      "id": "ff8a8ce0-51a3-11e9-9459-7fd41a26fcac",
 *      "rule_type": "DAILY",
 *      "intervals": [
 *        {
 *          "start": "07:00",
 *          "end": "08:00"
 *        }
 *      ]
 *    },
 *    {
 *      "id": "ff8b0210-51a3-11e9-9459-7fd41a26fcac",
 *      "rule_type": "WEEKLY",
 *      "week_days": [
 *        1,
 *        3,
 *        5
 *      ],
 *      "intervals": [
 *        {
 *          "start": "09:00",
 *          "end": "10:00"
 *        },
 *        {
 *          "start": "11:00",
 *          "end": "12:00"
 *        }
 *      ]
 *    }
 *  ]
 *
 *  @apiErrorExample {json} Error Response
 *    HTTP/1.1 500 Internal Server Error
 *
 */
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

/**
 * @api {post} /rules Create rules
 * @apiGroup Rules
 * @apiParam {String} rule_type Rule type ('ONE_DAY', 'DAILY', 'WEEKLY')
 * @apiParam {String} day Rule day (When rule_type is 'ONE_DAY', this parameter is required)
 * @apiParam {Integer[]} week_days Rule week days (When rule_type is 'WEEKLY', this parameter is required)
 * @apiParam {Object[]} intervals Rule intervals
 * @apiParam {String} intervals.start Rule intervals start
 * @apiParam {String} intervals.end Rule intervals end
 *
 * @apiSuccess {String} id Rule id
 * @apiSuccess {String} rule_type Rule type ('ONE_DAY', 'DAILY', 'WEEKLY')
 * @apiSuccess {String} day Rule day
 * @apiSuccess {Integer[]} week_days Rule week days
 * @apiSuccess {Object[]} intervals Rule intervals
 * @apiSuccess {String} intervals.start Rule intervals start
 * @apiSuccess {String} intervals.end Rule intervals end
 * @apiSuccessExample {json} Success Response
 *  HTTP/1.1 200 OK
 *  {
 *    "id": "e5efe2d0-51a8-11e9-be65-6fb595927377",
 *    "rule_type": "ONE_DAY",
 *    "day": "28-03-2019",
 *    "intervals": [
 *      {
 *        "start": "01:00",
 *        "end": "02:00"
 *      },
 *      {
 *        "start": "03:00",
 *        "end": "04:00"
 *      }
 *    ]
 *  }
 *
 * @apiErrorExample {json} Error Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "error": "Invalid day. Valid date format id: 'DD-MM-YYYY'"
 *    }
 * @apiErrorExample {json} Error Response
 *    HTTP/1.1 500 Internal Server Error
 *
 */
router.post('/', (req, res, next) => {
  try {
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

    // check for rule conflict
    const files = fs.readdirSync(req.app.get('db_path'));

    for (let f of files) {
      if (f === '.gitignore')
        continue;

      let rule = JSON.parse(fs.readFileSync(path.join(req.app.get('db_path'), f), 'utf-8'));

      switch (req.body.rule_type) {
        case 'ONE_DAY':
          if(hasConflictOneDay(rule, req.body))
            return next({status: 400, message: `Rule conflict found: rule ${rule.id} has interval ${JSON.stringify(rule.intervals)}`});
          break;

        case 'DAILY':
          if(hasIntervalConflict(rule, req.body))
            return next({status: 400, message: `Rule conflict found: rule ${rule.id} has interval ${JSON.stringify(rule.intervals)}`});
          break;

        case 'WEEKLY':
          if(hasConflictWeekly(rule, req.body))
            return next({status: 400, message: `Rule conflict found: rule ${rule.id} has interval ${JSON.stringify(rule.intervals)}`});
          break;
      }

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
  } catch (e) {
    next(e);
  }
});

/**
 * @api {get} /rules/:id List one rule
 * @apiGroup Rules
 * @apiParam {String} id Rule id
 *
 * @apiSuccess {String} id Rule id
 * @apiSuccess {String} rule_type Rule type ('ONE_DAY', 'DAILY', 'WEEKLY')
 * @apiSuccess {String} day Rule day
 * @apiSuccess {Integer[]} week_days Rule week days
 * @apiSuccess {Object[]} intervals Rule intervals
 * @apiSuccess {String} intervals.start Rule intervals start
 * @apiSuccess {String} intervals.end Rule intervals end
 * @apiSuccessExample {json} Success Response
 *  HTTP/1.1 200 OK
 *  {
 *    "id": "e5efe2d0-51a8-11e9-be65-6fb595927377",
 *    "rule_type": "ONE_DAY",
 *    "day": "28-03-2019",
 *    "intervals": [
 *      {
 *        "start": "01:00",
 *        "end": "02:00"
 *      },
 *      {
 *        "start": "03:00",
 *        "end": "04:00"
 *      }
 *    ]
 *  }
 *
 * @apiErrorExample {json} Error Response
 *    HTTP/1.1 404 Not Found
 *    {
 *      "error": "Rule not found."
 *    }
 * @apiErrorExample {json} Error Response
 *    HTTP/1.1 500 Internal Server Error
 *
 */
router.get('/:id', (req, res, next) => {
  const file = path.join(req.app.get('db_path'), req.params.id + '.json');
  if (fs.existsSync(file)) {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err)
        return next(err);

      res.json(JSON.parse(data));
      });
  } else
    return next(errors.RuleNotFound);
});

/**
 * @api {delete} /rules/:id Delete rule
 * @apiGroup Rules
 * @apiParam {String} id Rule id
 *
 * @apiSuccessExample {json} Success Response
 *  HTTP/1.1 200 OK
 *  "Rule ed1a92f0-51ab-11e9-9947-573867ed4f3d was deleted successfully."
 *
 * @apiErrorExample {json} Error Response
 *    HTTP/1.1 404 Not Found
 *    {
 *      "error": "Rule not found."
 *    }
 * @apiErrorExample {json} Error Response
 *    HTTP/1.1 500 Internal Server Error
 *
 */
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

function hasConflictOneDay(old_rule, new_rule) {
  switch (old_rule.rule_type) {
    case 'ONE_DAY':
      if (old_rule.day === new_rule.day && hasIntervalConflict(old_rule, new_rule))
        return true;

      break;

    case 'DAILY':
      if (hasIntervalConflict(old_rule, new_rule))
        return true;

      break;

    case 'WEEKLY':
      for (let d of old_rule.week_days)
        if (d === moment(new_rule.day, 'DD-MM-YYYY', true).day() && hasIntervalConflict(old_rule, new_rule))
          return true;

  }

  return false;
}

function hasConflictWeekly(old_rule, new_rule) {
  switch (old_rule.rule_type) {
    case 'ONE_DAY':
      for (let d of new_rule.week_days) {
        if (d === moment(old_rule.day, 'DD-MM-YYYY', true).day() && hasIntervalConflict(old_rule, new_rule))
          return true;
      }

      break;

    case 'DAILY':
      if (hasIntervalConflict(old_rule, new_rule))
        return true;

      break;

    case 'WEEKLY':
      for (let d of new_rule.week_days)
        if (old_rule.week_days.includes(d) && hasIntervalConflict(old_rule, new_rule))
          return true;

  }

  return false;
}

function hasIntervalConflict(old_rule, new_rule) {
  for (let h of old_rule.intervals) {
    let rule_start = moment(h.start, 'HH:mm', true);
    let rule_end = moment(h.end, 'HH:mm', true);

    for (let g of new_rule.intervals) {
      let new_rule_start = moment(g.start, 'HH:mm', true);
      let new_rule_end = moment(g.end, 'HH:mm', true);

      if (rule_end.isBefore(new_rule_start) || new_rule_end.isBefore(rule_start))
        return false;

      if (rule_start.isSameOrBefore(new_rule_end) || new_rule_start.isSameOrBefore(rule_end))
        return true;
    }
  }

  return false;
}

module.exports = router;
