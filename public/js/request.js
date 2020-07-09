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
  bodyText.style.backgroundColor= 'rgb(247, 247, 247)';
  headers.style.color = 'rgb(150, 178, 202)';
  body.style.color = 'rgb(70, 112, 148)';
})

function send() {
  let domain = document.getElementById("domain").value
  let endpoint = document.getElementById("endpoint").value

  if (domain.length == 0 || endpoint.length == 0){
    window.alert("Please input Domain and Endpoint.");
  }
  else{
    let protocol = document.getElementById("protocol").value
    let method = document.getElementById("method").value
    var data = {protocol:protocol, domain:domain, endpoint:endpoint,method:method}
    console.log(document.getElementById("headersText").value)

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
      console.log(json)
      document.getElementById('divResData').innerHTML = JSON.stringify(json)
    })
  }
}