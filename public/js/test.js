function load(){
  fetch('/api/load', {protocol: 'https'})  //fix request http
  .then(res =>　res.json()) 
  .then(res => {
    for (let i=0;i<res.domain.length;i++){
      const opt = document.createElement('option')
      opt.setAttribute('value',res.domain[i]);
      opt.setAttribute('id',res.domain[i]);
      opt.innerHTML = res.domain[i]
      document.getElementById('domain').appendChild(opt)
    }
    for (let j=0;j<res.endpoint.length;j++){
      const opt = document.createElement('option')
      opt.setAttribute('value',res.endpoint[j]);
      opt.setAttribute('id',res.endpoint[j]);
      opt.innerHTML = res.endpoint[j]
      document.getElementById('endpoint').appendChild(opt)
    }
  })
}
load()

async function readApi(){
  const parent = document.getElementById("specList");
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
  // fix : clear spec list before readapi
  fetch('/api/readapi',{
    body: JSON.stringify({
    protocol : document.getElementById("protocol").value,
    domain : document.getElementById("domain").value,
    endpoint : document.getElementById("endpoint").value
    }),
    headers: {'Content-Type':'application/json'},
    method: 'POST'
  })
  .then((result)=> {
    return result.json();
  })
  .then((json)=>{
    for (let i=0;i<json.length;i++){
      const divApi = document.createElement('li')
      divApi.setAttribute('class','item');
      divApi.setAttribute('id','api'+json[i].id);
      document.getElementById('specList').appendChild(divApi)
      const aSpec = document.createElement('a')
      aSpec.setAttribute('href','./test_detail.html?id='+json[i].id);
      document.getElementById('api'+json[i].id).appendChild(aSpec)
      // divApi.parentNode.insertBefore(aApi, divApi.nextSibling)
      aSpec.innerHTML = json[i].spec_name
    }
  })

}

document.getElementById('testPage').classList.add("current");
