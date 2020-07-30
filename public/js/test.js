document.getElementById('testPage').classList.add('current');

function load() {
  fetch('/api/load', { protocol: 'https' }) // fix request http
    .then((res) =>　res.json())
    .then((res) => {
      for (let i = 0; i < res.domain.length; i += 1) {
        const opt = document.createElement('option');
        opt.setAttribute('value', res.domain[i]);
        opt.setAttribute('id', res.domain[i]);
        opt.innerHTML = res.domain[i];
        document.getElementById('domain').appendChild(opt);
      }
      for (let j = 0; j < res.endpoint.length; j += 1) {
        const opt = document.createElement('option');
        opt.setAttribute('value', res.endpoint[j]);
        opt.setAttribute('id', res.endpoint[j]);
        opt.innerHTML = res.endpoint[j];
        document.getElementById('endpoint').appendChild(opt);
      }
    });
}
load();

async function readApi() {
  const parent = document.getElementById('specList');
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
  // fix : clear spec list before readapi
  fetch('/api/readapi', {
    body: JSON.stringify({
      protocol: document.getElementById('protocol').value,
      domain: document.getElementById('domain').value,
      endpoint: document.getElementById('endpoint').value,
    }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
    .then((result) => result.json())
    .then((json) => {
      for (let i = 0; i < json.length; i += 1) {
        const divApi = document.createElement('li');
        divApi.setAttribute('class', 'item');
        divApi.setAttribute('id', `api${json[i].id}`);
        document.getElementById('specList').appendChild(divApi);
        const aSpec = document.createElement('a');
        aSpec.setAttribute('href', `./test_detail.html?id=${json[i].id}`);
        document.getElementById(`api${json[i].id}`).appendChild(aSpec);
        // divApi.parentNode.insertBefore(aApi, divApi.nextSibling)
        aSpec.innerHTML = json[i].spec_name;
      }
    });
}
async function addSpec() {
  const domain = document.getElementById('add_domain').value;
  const test = document.getElementById('add_test').value;
  if (domain.length == 0) {
    sweetAlert('Please input Domain.');
  }
  if (test.length == 0) {
    sweetAlert('Please input Test Case Name.');
  } else {
    fetch('/api/addspec', {
      body: JSON.stringify({
        protocol: document.getElementById('add_protocol').value,
        domain,
        endpoint: document.getElementById('add_endpoint').value,
        test,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
      .then((result) => result.json())
      .then((json) => {
        window.location = `./test_detail.html?id=${json}`;
      });
  }
}
