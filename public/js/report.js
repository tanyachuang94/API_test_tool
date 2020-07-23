let sort = document.getElementById('sort').value;
const data = document.getElementById('data');

function load() {
  fetch('/api/report?sort=' + sort)
    .then(res =>　res.json())
    .then(json => {
      for (let i = 0; i < json.length; i += 1) {
        let tr = document.createElement('tr');
        data.appendChild(tr);
        let td1 = document.createElement('td');
        tr.appendChild(td1);
        td1.innerHTML = json[i].spec_name
        let td2 = document.createElement('td');
        td2.setAttribute('align', 'center');
        tr.appendChild(td2);
        let img = document.createElement('img');
        td2.appendChild(img);
        if (json[i].test_result == 'Fail') {
          img.setAttribute('src', 'imgs/fail.png');
        } else if (json[i].test_result == 'Pass') {
          img.setAttribute('src', 'imgs/pass.png');
        }
        img.setAttribute('width', '23px');
        let td3 = document.createElement('td');
        tr.appendChild(td3);
        td3.innerHTML = json[i].test_time;
      }
    });
}
load();

function sortby(selectObject) {
  const parent = document.getElementById('data');
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
  sort = selectObject.value;
  load();
}
