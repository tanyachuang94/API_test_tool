document.getElementById('scrPage').classList.add('current');

let scriptList = document.getElementById('scriptList');
function addScript() {
  scriptList.setAttribute('style', 'display: none');
  scriptList = 'new';
  document.getElementById('script').setAttribute('style', 'display: block; font-size:0.8em; width:300px; height:30px; margin: 7px');
  document.getElementById('add').setAttribute('style', 'display: none');
}
fetch('/api/specs')
  .then((res) =>　res.json())
  .then((json) => {
    for (let i = 0; i < json.length; i += 1) {
      const opt = document.createElement('option');
      opt.setAttribute('value', json[i].id);
      // opt.setAttribute('id', json.spec_name[i]);
      opt.innerHTML = json[i].spec_name;
      document.getElementById('spec1').appendChild(opt);
    }
  });

fetch('/api/scrpits')
  .then((res) =>　res.json())
  .then((json) => {
    for (let i = 0; i < json.length; i += 1) {
      const opt = document.createElement('option');
      opt.setAttribute('value', json[i].id);
      // opt.setAttribute('id', json.spec_name[i]);
      opt.innerHTML = json[i].script_name;
      document.getElementById('scriptList').appendChild(opt);
    }
  });

function load(script) {
  fetch(`/api/script?id=${script}`)
    .then((res) =>　res.json())
    .then((json) => {
      document.getElementById('spec1').value = json.spec_id;
      document.getElementById('startDate').setAttribute('value', json.start_date);
      document.getElementById('endDate').setAttribute('value', json.end_date);
      document.getElementById('startTime').value = json.start_time;
      // document.getElementById('frequency').value = json.frequency;
    });
}
function readScript(selectObject) {
  const script = selectObject.value;
  load(script);
}
function saveScript() {
  const data = {};
  data.spec_id = [document.getElementById('spec1').value];
  data.start_date = document.getElementById('startDate').value;
  data.end_date = document.getElementById('endDate').value;
  data.start_time = document.getElementById('startTime').value;
  // data.frequency = document.getElementById('frequency').value;
  if (scriptList == 'new') {
    data.script_name = document.getElementById('script').value;
  } else {
    scriptList = document.getElementById('scriptList').value;
  }
  fetch(`/api/script?id=${scriptList}`, {
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
    .then((res) =>　res.json())
    .then((json) => {
      scriptList = '';
      window.location.href = './script.html';
    });
}
