const headers = document.getElementById('headers');
const body = document.getElementById('body');
const headersText = document.getElementById('headersText');
const bodyText = document.getElementById('bodyText');

document.getElementById('reqPage').classList.add('current');

headers.addEventListener('click', () => {
  bodyText.style.display = 'none';
  headersText.style.display = 'block';
  body.style.color = '#8FC5B9';
  headers.style.color = '#494949';
});

body.addEventListener('click', () => {
  headersText.style.display = 'none';
  bodyText.style.display = 'block';
  bodyText.style.backgroundColor = '#F7F7F7';
  headers.style.color = '#8FC5B9';
  body.style.color = '#494949';
});

function send() {
  const domain = document.getElementById('domain').value;
  if (domain.length == 0) {
    window.alert('Please input Domain.');
  } else {
    const protocol = document.getElementById('protocol').value;
    const method = document.getElementById('method').value;
    const data = { protocol, domain, method };

    if (document.getElementById('endpoint').value.length > 0) {
      data.endpoint = document.getElementById('endpoint').value;
    }
    if (document.getElementById('headersText').value.length > 0) {
      data.headers = document.getElementById('headersText').value;
    } if (document.getElementById('bodyText').value.length > 0) {
      data.body = document.getElementById('bodyText').value;
    }

    fetch('/api/request', {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
      .then((result) => {
        if (result != undefined) { // result is response status
          // const script = document.createElement('script');
          // script.src = file;
          // script.type = 'text/javascript';
          // script.defer = true;
          // document.getElementById('view1').appendChild(script);

          const line = document.getElementById('line');

          line.style.display = 'block';

          const divView2 = document.createElement('div');
          divView2.setAttribute('id', 'view2');
          divView2.setAttribute('class', 'view');
          divView2.setAttribute('style', 'text-align:center;');

          line.parentNode.insertBefore(divView2, line.nextSibling);

          const divRes = document.createElement('div');
          divRes.setAttribute('id', 'response');
          divRes.setAttribute('style', 'font-size:20px');
          divRes.innerHTML = '<br>Response<br><br>';
          document.getElementById('view2').appendChild(divRes);

          const divResStatus = document.createElement('div');
          divResStatus.setAttribute('id', 'resStatus');
          divRes.parentNode.insertBefore(divResStatus, divRes.nextSibling);

          const divResData = document.createElement('pre');
          divResData.setAttribute('class', 'content');
          divResData.setAttribute('id', 'act_data');
          divResData.setAttribute('style', 'border:solid 1px grey; width:70%; height:300px; overflow:scroll; text-align: left;border-radius: 5px');
          divResStatus.parentNode.insertBefore(divResData, divResStatus.nextSibling);
        }
        return result.json();
      })
      .then((json) => {
        document.getElementById('resStatus').innerHTML = `  Code Status : ${JSON.stringify(json.status)} / Time : ${JSON.stringify(json.time)} ms / Network : ${navigator.connection.effectiveType}<br><br>`;
        document.getElementById('act_data').innerHTML = JSON.stringify(json.body, null, 2);
        document.getElementById('clear').style.display = 'block';
      });
  }
}
