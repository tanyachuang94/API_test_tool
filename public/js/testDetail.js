const getURL = location.href; // 用location.href取得網址，並存入變數
const url = new URL(getURL); // 將網址 (字串轉成URL)
const getID = url.searchParams.get('id'); // 回傳url的id參數 (testId)
let expected = '';
// const actual = '';
let specCheck = '';
let specTime = 0;
let specCode = 0;

fetch(`/api/spec_test?id=${getID}`) // display spec in test detail page
  .then((res) => res.json())
  .then((json) => {
    document.getElementById(json.method).selected = true;
    document.getElementById(json.res_check).selected = true;
    document.getElementById('spec_name').value = json.spec_name;
    document.getElementById('req_header').value = json.req_header;
    document.getElementById('req_body').value = json.req_body;
    document.getElementById('res_data').innerHTML = JSON.stringify(JSON.parse(json.res_data), null, 2);
    document.getElementById('code').value = json.res_code;
    document.getElementById('time').value = json.res_time;
    expected = json.res_data;
    specCheck = json.res_check;
    specTime = json.res_time;
    specCode = json.res_code;
  })
  .catch((err) => {
    console.log(err);
  });

async function sendTest() {
  const data = {};
  let apiId = 0;
  const network = navigator.connection.effectiveType;

  const testDetail = await fetch(`/api/test_detail?id=${getID}`) // 同時拿api url和spec test
    .then((res) => res.json())
    .then((json) => {
      apiId = json[0].api_id;
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
    .then((result) => result.json())
    .then((json) => {
      document.getElementById('act_data').innerHTML = JSON.stringify(json.body, null, 2);
      return json;
    })
    .catch((err) => {
      console.log(err);
    });

  const compare = {
    specId: getID,
    apiId,
    specCheck,
    spec_res: expected,
    specCode,
    specTime,
    response: resultDetail,
    network,
  };

  fetch('/api/compare', {
    body: JSON.stringify(compare),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
    .then((result) => result.json())
    .then((json) => {
      if (json.data == 'fail') {
        document.getElementById('actual').setAttribute('style', 'color:red');
      } else {
        document.getElementById('actual').setAttribute('style', 'color:green');
      }
      document.getElementById('resStatus').innerHTML = `Test Result : ${json.result} / Code Status : ${json.code} / Time : ${json.time} (ms)` + ` / Network : ${network}`;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function saveTest() {
  const testSpec = {
    spec_name: document.getElementById('spec_name').value,
    method: document.getElementById('method').value,
    res_check: document.getElementById('res_check').value,
    res_code: document.getElementById('code').value,
    res_time: document.getElementById('time').value,
    req_header: document.getElementById('req_header').value,
    req_body: document.getElementById('req_body').value,
    res_data: document.getElementById('res_data').value,
  };
  fetch(`/api/test_detail?id=${getID}`, {
    body: JSON.stringify(testSpec),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
    .then((result) =>　result.json())
    .then((json) => { // reload page after saving
      if (json.result == 'save') {
        window.location = `test_detail.html?id=${getID}`;
      } else {
        sweetAlert(json.result);
      }
    });
}
