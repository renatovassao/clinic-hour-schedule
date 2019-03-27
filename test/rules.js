const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');

process.env.NODE_ENV = 'test';

const app = require('../app');

chai.use(chaiHttp);

const oneDayRule = {
  rule_type: "ONE_DAY",
  day: "28-03-2019",
  intervals: [{
    start: "01:00",
    end: "02:00"
  },{
    start: "03:00",
    end: "04:00"
  }]
};

const dailyRule = {
  rule_type: "DAILY",
  intervals: [{
    start: "07:00",
    end: "08:00"
  }]
};

const weeklyRule = {
  rule_type: "WEEKLY",
  week_days: [1, 3, 5],
  intervals: [{
    start: "09:00",
    end: "10:00"
  },{
    start: "11:00",
    end: "12:00"
  }]
};

const hours = [
  {
    day: "26-03-2019",
    intervals: [
      {
        start: "07:00",
        end: "08:00"
      }
    ]
  },
  {
    day: "27-03-2019",
    intervals: [
      {
        start: "07:00",
        end: "08:00"
      },
      {
        start: "09:00",
        end: "10:00"
      },
      {
        start: "11:00",
        end: "12:00"
      }
    ]
  },
  {
    day: "28-03-2019",
    intervals: [
      {
        start: "01:00",
        end: "02:00"
      },
      {
        start: "03:00",
        end: "04:00"
      },
      {
        start: "07:00",
        end: "08:00"
      }
    ]
  },
  {
    day: "29-03-2019",
    intervals: [
      {
        start: "07:00",
        end: "08:00"
      },
      {
        start: "09:00",
        end: "10:00"
      },
      {
        start: "11:00",
        end: "12:00"
      }
    ]
  }
];

const start = '26-03-2019';
const end = '29-03-2019'

describe('CLINIC HOUR TEST', function() {

  // delete all test rules before test
  before(() => {
    try {
      const files = fs.readdirSync(app.get('db_path'));

      for (let f of files) {
        if (f === '.gitignore')
          continue;

        fs.unlinkSync(path.join(app.get('db_path'), f));
      }

      } catch (err) {
        throw err;
      }
  });

  describe('POST /rules', function() {
    it('should register a one day rule', function(done) {
      chai.request(app)
        .post('/rules')
        .send(oneDayRule)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.have.property('body');
          expect(res.body).to.have.property('id').which.is.a('string').with.length(36);
          expect(res.body).to.have.property('rule_type').which.is.equal(oneDayRule.rule_type);
          expect(res.body).to.have.property('day').which.is.equal(oneDayRule.day);

          expect(res.body).to.have.property('intervals').which.is.a('array').with.length(oneDayRule.intervals.length);
          for (let i = 0; i < oneDayRule.intervals.length; i++) {
            expect(res.body.intervals[i]).to.have.property('start');
            expect(res.body.intervals[i]).to.have.property('end');
            expect(res.body.intervals[i].start).to.be.equal(oneDayRule.intervals[i].start);
            expect(res.body.intervals[i].end).to.be.equal(oneDayRule.intervals[i].end);
          }

          oneDayRule.id = res.body.id;

          done();
        });
    });

    it('should register a daily rule', function(done) {
      chai.request(app)
        .post('/rules')
        .send(dailyRule)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.have.property('body');
          expect(res.body).to.have.property('id').which.is.a('string').with.length(36);
          expect(res.body).to.have.property('rule_type').which.is.equal(dailyRule.rule_type);

          expect(res.body).to.have.property('intervals').which.is.a('array').with.length(dailyRule.intervals.length);
          for (let i = 0; i < dailyRule.intervals.length; i++) {
            expect(res.body.intervals[i]).to.have.property('start');
            expect(res.body.intervals[i]).to.have.property('end');
            expect(res.body.intervals[i].start).to.be.equal(dailyRule.intervals[i].start);
            expect(res.body.intervals[i].end).to.be.equal(dailyRule.intervals[i].end);
          }

          dailyRule.id = res.body.id;

          done();
        });
    });

    it('should register a weekly rule', function(done) {
      chai.request(app)
        .post('/rules')
        .send(weeklyRule)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.have.property('body');
          expect(res.body).to.have.property('id').which.is.a('string').with.length(36);
          expect(res.body).to.have.property('rule_type').which.is.equal(weeklyRule.rule_type);

          expect(res.body).to.have.property('intervals').which.is.a('array').with.length(weeklyRule.intervals.length);
          for (let i = 0; i < weeklyRule.intervals.length; i++) {
            expect(res.body.intervals[i]).to.have.property('start');
            expect(res.body.intervals[i]).to.have.property('end');
            expect(res.body.intervals[i].start).to.be.equal(weeklyRule.intervals[i].start);
            expect(res.body.intervals[i].end).to.be.equal(weeklyRule.intervals[i].end);
          }

          expect(res.body).to.have.property('week_days').which.is.a('array').with.length(weeklyRule.week_days.length);
          for (let i = 0; i < weeklyRule.week_days.length; i++)
            expect(res.body.week_days[i]).to.be.equal(weeklyRule.week_days[i]);

          weeklyRule.id = res.body.id;

          done();
        });
    });
  });

  describe('GET /rules', function() {
    it('should list all rules', function(done) {
      chai.request(app)
        .get('/rules')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.have.property('body').which.is.a('array').with.length(3);;

          // one day rule test
          expect(res.body[0]).to.have.property('id').which.is.equal(oneDayRule.id);
          expect(res.body[0]).to.have.property('rule_type').which.is.equal(oneDayRule.rule_type);
          expect(res.body[0]).to.have.property('day').which.is.equal(oneDayRule.day);

          expect(res.body[0]).to.have.property('intervals').which.is.a('array').with.length(oneDayRule.intervals.length);
          for (let i = 0; i < oneDayRule.intervals.length; i++) {
            expect(res.body[0].intervals[i]).to.have.property('start');
            expect(res.body[0].intervals[i]).to.have.property('end');
            expect(res.body[0].intervals[i].start).to.be.equal(oneDayRule.intervals[i].start);
            expect(res.body[0].intervals[i].end).to.be.equal(oneDayRule.intervals[i].end);
          }

          // daily rule test
          expect(res.body[1]).to.have.property('id').which.is.equal(dailyRule.id);
          expect(res.body[1]).to.have.property('rule_type').which.is.equal(dailyRule.rule_type);

          expect(res.body[1]).to.have.property('intervals').which.is.a('array').with.length(dailyRule.intervals.length);
          for (let i = 0; i < dailyRule.intervals.length; i++) {
            expect(res.body[1].intervals[i]).to.have.property('start');
            expect(res.body[1].intervals[i]).to.have.property('end');
            expect(res.body[1].intervals[i].start).to.be.equal(dailyRule.intervals[i].start);
            expect(res.body[1].intervals[i].end).to.be.equal(dailyRule.intervals[i].end);
          }

          // weekly rule test
          expect(res.body[2]).to.have.property('id').which.is.equal(weeklyRule.id);
          expect(res.body[2]).to.have.property('rule_type').which.is.equal(weeklyRule.rule_type);

          expect(res.body[2]).to.have.property('intervals').which.is.a('array').with.length(weeklyRule.intervals.length);
          for (let i = 0; i < weeklyRule.intervals.length; i++) {
            expect(res.body[2].intervals[i]).to.have.property('start');
            expect(res.body[2].intervals[i]).to.have.property('end');
            expect(res.body[2].intervals[i].start).to.be.equal(weeklyRule.intervals[i].start);
            expect(res.body[2].intervals[i].end).to.be.equal(weeklyRule.intervals[i].end);
          }

          expect(res.body[2]).to.have.property('week_days').which.is.a('array').with.length(weeklyRule.week_days.length);
          for (let i = 0; i < weeklyRule.week_days.length; i++)
            expect(res.body[2].week_days[i]).to.be.equal(weeklyRule.week_days[i]);

          done();
        });
    });
  });

  describe(`GET /hours?start=${start}&end=${end}`, function() {
    it('should list available hours', function(done) {
      chai.request(app)
        .get('/hours')
        .query({start: start, end: end})
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.have.property('body').which.is.a('array').with.length(hours.length);;

          for (let i = 0; i < hours.length; i++) {
            expect(res.body[i]).to.have.property('day').which.is.equal(hours[i].day);

            expect(res.body[i]).to.have.property('intervals').which.is.a('array').with.length(hours[i].intervals.length);
            for (let j = 0; j < hours[i].intervals.length; j++) {
              expect(res.body[i].intervals[j]).to.have.property('start');
              expect(res.body[i].intervals[j]).to.have.property('end');
              expect(res.body[i].intervals[j].start).to.be.equal(hours[i].intervals[j].start);
              expect(res.body[i].intervals[j].end).to.be.equal(hours[i].intervals[j].end);
            }
          }
          
          done();
        });
    });
  });

  describe('DELETE /rules/:id', function() {
    it('should delete one day rule', function(done) {
      chai.request(app)
        .delete(`/rules/${oneDayRule.id}`)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.have.property('body');
          expect(res.body).to.be.equal(`Rule ${oneDayRule.id} was deleted successfully.`);
          done();
        });
    });
  });

  describe('DELETE /rules/:id', function() {
    it('should fail when trying to delete one day rule again', function(done) {
      chai.request(app)
        .delete(`/rules/${oneDayRule.id}`)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res).to.have.property('body');
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.equal('Rule not found.');
          done();
        });
    });
  });

});
