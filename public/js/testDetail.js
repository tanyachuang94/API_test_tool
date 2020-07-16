const getURL = location.href;  // 用location.href取得網址，並存入變數
const url = new URL(getURL)  // 將網址 (字串轉成URL)
const getID = url.searchParams.get('id') //回傳url的id參數
let expected = '';
// const actual = '';
let specCheck = '';
let specTime = 0;
let specCode = 0;

fetch('/api/spec_test?id=' + getID)  // display spec in test detail page
  .then(res => res.json())
  .then(json => {
    document.getElementById(json.method).selected = true;
    document.getElementById(json.res_check).selected = true;
    document.getElementById('spec_name').value = json.spec_name;
    document.getElementById('req_header').value = json.req_header;
    document.getElementById('req_body').value = json.req_body;
    document.getElementById('res_data').innerHTML = json.res_data;
    document.getElementById('code').value = json.res_code;
    document.getElementById('time').value = json.res_time;
    expected = json.res_data;
    specCheck = json.res_check;
    specTime = json.res_time;
    specCode = json.res_code;
  });

async function sendTest() {
  const data = {};
  // let code = 0;
  // let time = 0;

  const testDetail = await fetch('/api/test_detail?id=' + getID)  // 同時拿api url和spec test
    .then(res => res.json())
    .then(json => {
      // code = json[0].res_code;
      // time = json[0].res_time;
      data.protocol = json[0].protocol;
      data.domain = json[0].domain;
      data.endpoint = json[0].endpoint;
      data.method = json[0].method;
      data.headers = json[0].req_header;
      data.body = json[0].req_body;
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
  const resultDetail = await fetch('/api/request', {
    body: JSON.stringify(testDetail),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
    .then((result) => {
      return result.json();
    })
    .then((json) => { //  Fix client err: Cannot set property 'innerHTML' of null
      document.getElementById('act_data').innerHTML = JSON.stringify(json.body);
      return json;
    })
    .catch((err) => {
      console.log(err);
    });
  const compare = {
    id: getID,
    specCheck: specCheck,
    spec_res: expected,
    specCode: specCode,
    specTime: specTime,
    response: resultDetail,
  };

  fetch('/api/compare', {
    body: JSON.stringify(compare),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
    .then((result) => {
      return result.json();
    })
    .then((json) => { 
      if (json.data == 'fail') {
        document.getElementById('actual').setAttribute('style', 'color:red');
      }
      document.getElementById('resStatus').innerHTML = 'Test Result : '+ json.result +' / Code Status : '+json.code+' / Time : '+json.time + ' (ms)'
    });
}

async function saveTest() {

}
