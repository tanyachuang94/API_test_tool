let getURL = location.href; //用location.href取得網址，並存入變數
let url = new URL(getURL)  //將網址 (字串轉成URL)
let getID = url.searchParams.get('id') //回傳url的id參數
let expected = ''
let actual = ''

fetch('/api/spec_test?id=' + getID)
.then(res =>　res.json()) 
.then(json => {
  document.getElementById('method').innerHTML = json[0].method +' &nbsp;&nbsp;'
  document.getElementById('res_check').innerHTML = json[0].res_check +' &nbsp;&nbsp;'
  document.getElementById('spec_name').innerHTML = json[0].spec_name +'<br>'
  document.getElementById('req_header').value = json[0].req_header;
  document.getElementById('req_body').value = json[0].req_body;
  document.getElementById('res_data').innerHTML = json[0].res_data;
  expected = String(json[0].res_data)
})

async function sendTest() {
  const data = {}
  
  const result = await fetch('/api/runtest?id=' + getID)
  .then(res =>　res.json()) 
  .then(json => {
    data.protocol= json[0].protocol;
    data.domain=json[0].domain;
    data.endpoint=json[0].endpoint;
    data.method=json[0].method;
    data.headers=json[0].req_header;
    data.body=json[0].req_body;
    return data
  })
  
  fetch('/api/request',{
    body: JSON.stringify(result),
    headers: {'Content-Type':'application/json'},
    method: 'POST'
  })
  .then((result)=> {
    return result.json();
  })
  .then((json) =>{ //  Fix client err: Cannot set property 'innerHTML' of null
    // document.getElementById('resStatus').innerHTML = 'Code Status : ' + JSON.stringify(json.status) + '  Time : ' + JSON.stringify(json.time) + ' ms  Network : ' + navigator.connection.effectiveType + '<br><br>'
    document.getElementById('act_data').innerHTML = JSON.stringify(json.body)
    actual = JSON.stringify(json.body)
    if (actual == expected){
      console.log('pass')
    } else {
      console.log('fail')
    }

  })
}
