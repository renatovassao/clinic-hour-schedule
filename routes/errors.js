module.exports = {
  InvalidDay: { status: 400, message: "Invalid day. Valid date format is: 'DD-MM-YYYY'" },
  InvalidTime: { status: 400, message: "Invalid time. Valid time format is: 'HH:mm'" },
  InvalidRuleType: { status: 400, message: "Invalid rule_type. Valid rules types are: 'ONE_DAY', 'DAILY' and 'WEEKLY" },
  InvalidWeekDaysType: { status: 400, message: "Invalid week_days type. Valid week days type is: non-empty Array" },
  InvalidWeekDaysElementType: { status: 400, message: "Invalid week_days' element type. Valid week_days' element type is: int between 0 and 6" },
  InvalidIntervalsType: { status: 400, message: "Invalid intervals type. Valid intervals type is: non-empty Array" },
  InvalidInterval: { status: 400, message: "Invalid interval. Valid interval start and end format is: 'DD-MM-YYYY'" },
  RuleNotFound: { status: 404, message: "Rule not found." }
}
