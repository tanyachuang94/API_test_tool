const headers = document.getElementById('headers');
const body = document.getElementById('body');
const headersText = document.getElementById('headersText');
const bodyText = document.getElementById('bodyText');

document.getElementById('reqPage').classList.add("current");

headers.addEventListener('click', () => {
  bodyText.style.display = 'none';
  headersText.style.display = 'block';
  body.style.color = 'rgb(150, 178, 202)';
  headers.style.color = 'rgb(70, 112, 148)';
})

body.addEventListener('click', () => {
  headersText.style.display = 'none';
  bodyText.style.display = 'block';
  bodyText.style.backgroundColor= 'rgb(238,238,238)';
  headers.style.color = 'rgb(150, 178, 202)';
  body.style.color = 'rgb(70, 112, 148)';
})

function send() {
  let protocol = document.getElementById("protocol").value
  let domain = document.getElementById("domain").value
  let endpoint = document.getElementById("endpoint").value
  let method = document.getElementById("method").value

  // let headers = document.getElementById("headersText").value
  // let body = document.getElementById("bodyText").value
  var data = {protocol:protocol, domain:domain, endpoint:endpoint,method:method}
    fetch('/api/request',{
      body: JSON.stringify(data),
      headers: {'Content-Type':'application/json'},
      method: 'POST'
    })
  }