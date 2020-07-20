const headers = document.getElementById('headers');
const body = document.getElementById('body');
const headersText = document.getElementById('headersText');
const bodyText = document.getElementById('bodyText');

document.getElementById('reqPage').classList.add("current");

headers.addEventListener('click', () => {
  bodyText.style.display = 'none';
  headersText.style.display = 'block';
  body.style.color = '#8FC5B9';
  headers.style.color = '#494949';
});

body.addEventListener('click', () => {
  headersText.style.display = 'none';
  bodyText.style.display = 'block';
  bodyText.style.backgroundColor= '#F7F7F7';
  headers.style.color = '#8FC5B9';
  body.style.color = '#494949';
});

function send() {
  let domain = document.getElementById("domain").value
  if (domain.length == 0){
    window.alert("Please input Domain.");
  }
  else{
    let protocol = document.getElementById("protocol").value
    let method = document.getElementById("method").value
    var data = {protocol:protocol, domain:domain, method:method}

    if (document.getElementById("endpoint").value.length > 0){
      data.endpoint = document.getElementById("endpoint").value}
    if (document.getElementById("headersText").value.length > 0){
      data.headers = document.getElementById("headersText").value
    } if (document.getElementById("bodyText").value.length > 0){
      data.body = document.getElementById("bodyText").value
    } 
  
    fetch('/api/request',{
      body: JSON.stringify(data),
      headers: {'Content-Type':'application/json'},
      method: 'POST'
    })
    .then((result)=> {
      if (result != undefined){  // result is response status
        function include(file) { 
          var script  = document.createElement('script'); 
          script.src  = file; 
          script.type = 'text/javascript'; 
          script.defer = true; 
          document.getElementById('view1').appendChild(script); 
        } 
        include('js/response.js')
      }
      return result.json();
    })
    .then((json) =>{ //  Fix client err: Cannot set property 'innerHTML' of null
      document.getElementById('resStatus').innerHTML = '  Code Status : ' + JSON.stringify(json.status) + ' / Time : ' + JSON.stringify(json.time) + ' ms / Network : ' + navigator.connection.effectiveType + '<br><br>'
      document.getElementById('act_data').innerHTML = JSON.stringify(json.body)
    })
  }
}