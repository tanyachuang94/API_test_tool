document.getElementById('repPage').classList.add('current');

const getURL = location.href;
const url = new URL(getURL);
const getID = url.searchParams.get('id');
fetch(`/api/report_detail?id=${getID}`)
  .then((res) => res.json())
  .then((json) => {
    let result = json.test_result;
    let res_code = json.test_res_code;
    let res_time = json.test_res_time;
    document.getElementById('method').innerHTML = json.method;
    document.getElementById('res_check').innerHTML = json.res_check;
    document.getElementById('spec_name').innerHTML = json.spec_name;
    document.getElementById('req_header').innerHTML = json.req_header;
    document.getElementById('req_body').innerHTML = json.req_body;
    document.getElementById('res_data').innerHTML = JSON.stringify(JSON.parse(json.res_data), null, 2);
    document.getElementById('act_data').innerHTML = JSON.stringify(JSON.parse(json.test_res_body), null, 2);
    document.getElementById('code').innerHTML = json.res_code;
    document.getElementById('time').innerHTML = json.res_time;
    expected = json.res_data;
    specCheck = json.res_check;
    specTime = json.res_time;
    specCode = json.res_code;

    if (result == 'Fail') { result = '<font color="red">Fail</font>'; } else { result = '<font color="green">Pass</font>'; }
    const fails = JSON.parse(json.test_fails); // string轉array
    if (fails) {
      for (let i = 0; i < fails.length; i += 1) {
        if (fails[i] == 'time') { res_time = `<font color="red">${res_time}</font>`; }
        if (fails[i] == 'code') { res_code = `<font color="red">${res_code}</font>`; }
        if (fails[i] == 'data') { document.getElementById('actual').setAttribute('style', 'color:red'); }
      }
    }

    document.getElementById('resStatus').innerHTML = `Test Result : ${result} / Code Status : ${res_code} / Time : ${res_time} (ms)` + ` / Network : ${json.network}`;
  })
  .catch((err) => {
    console.log(err);
  });
