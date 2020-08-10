const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment-timezone');
const app = require('../app');
const Test = require('../server/controllers/test_controller.js');
const Report = require('../server/controllers/report_controller.js');

const should = chai.should();
chai.use(chaiHttp);

describe('getTest', () => {
  it('Test spec id = 5', async () => {
    const req = { query: { id: 5 } };
    const res = {
      send: (data) => {
        if (data.id !== 5) {
          throw new Error('cannot get test by ID');
        }
      },
    };
    await Test.getTest(req, res);
    // getTest should return value testSpec[0]
    // Test.getTest(req, res).then((data) => {
    //   if (data.id !== 5) {
    //     throw new Error('cannot get test by ID');
    //   }
    // });
    // const data = await Test.getTest(req, res);
    // if (data.id !== 5) {
    //   throw new Error('cannot get test by ID');
    // }
  });
});

describe('getReport', () => {
  it('sortby test time', async () => {
    const req = { query: { sort: 'test_time' } };
    const res = {
      send: (reports) => {
        if (!reports) {
          throw new Error('No report');
        } else {
          for (let i = 1; i < reports.length; i += 1) {
            if (moment(reports[i].test_time, 'lll').valueOf()
              > moment(reports[i - 1].test_time, 'lll').valueOf()) {
              throw new Error('Sort failed');
            }
          }
        }
      },
    };
    await Report.getReport(req, res);
  });
});

describe('compare', () => {
  it('when code status differ from test spec ', async () => {
    const req = {
      body: {
        specCode: 200,
        specId: '1',
        apiId: 1,
        specCheck: 'TYPE',
        specRes: '{"data": [{"id": "number", "story": "string", "picture": "string", "product_id": "number"}, {"id": "number", "story": "string", "picture": "string", "product_id": "number"}, {"id": "number", "story": "string", "picture": "string", "product_id": "number"}]}',
        specTime: 1000,
        response: { time: 500, status: 300, body: { data: [] } },
        network: '4g',
      },
    };
    const res = {
      status(s) { this.statusCode = s; return this; },
      send() {},
    };
    res.send = (returnResult) => {
      if (returnResult.result !== '<font color="red">Fail</font>' || returnResult.code !== '<font color="red">300</font>') {
        throw new Error('Fail to compare code status');
      }
    };
    await Test.compare(req, res);
  });
});

describe('home page connection', () => {
  it('should get status 200', (done) => {
    chai.request(app)
      .get('/index.html')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
