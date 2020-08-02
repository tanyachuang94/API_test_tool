document.getElementById('repPage').classList.add('current');

let sort = document.getElementById('sort').value;
const data = document.getElementById('data');

function load() {
  fetch(`/api/report?sort=${sort}`)
    .then((res) =>　res.json())
    .then((json) => {
      for (let i = 0; i < json.length; i += 1) {
        const tr = document.createElement('tr');
        data.appendChild(tr);
        const td1 = document.createElement('td');
        tr.appendChild(td1);
        const aTest = document.createElement('a');
        aTest.setAttribute('href', `report_detail.html?id=${json[i].id}`);
        td1.appendChild(aTest);
        // divApi.parentNode.insertBefore(aApi, divApi.nextSibling)
        aTest.innerHTML = json[i].spec_name;

        // td1.innerHTML = `<a href="report_detail.html?id=${json[i].id}>${json[i].spec_name}</a>`;
        const td2 = document.createElement('td');
        td2.setAttribute('align', 'center');
        tr.appendChild(td2);
        const img = document.createElement('img');
        td2.appendChild(img);
        if (json[i].test_result == 'Fail') {
          img.setAttribute('src', 'imgs/fail.png');
        } else if (json[i].test_result == 'Pass') {
          img.setAttribute('src', 'imgs/pass.png');
        }
        img.setAttribute('width', '23px');
        const td3 = document.createElement('td');
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
