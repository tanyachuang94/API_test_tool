const line = document.getElementById('line')
if(line.style.display == 'none'){
  line.style.display = 'block'

  const divView2 = document.createElement('div')
  divView2.setAttribute('id','view2');
  divView2.setAttribute('class','view');
  divView2.setAttribute('style','text-align:center');
  line.parentNode.insertBefore(divView2, line.nextSibling)
  
  const divRes = document.createElement('div')
  divRes.setAttribute('id','response');
  divRes.setAttribute('style','font-size:20px');
  divRes.innerHTML = '<br>Response<br><br>'
  document.getElementById('view2').appendChild(divRes)

  const divResStatus = document.createElement('div')
  divResStatus.setAttribute('id','resStatus');
  divRes.parentNode.insertBefore(divResStatus, divRes.nextSibling)
  // const divResTime = document.createElement('div')
  // divResTime.setAttribute('id','resTime');
  // divResStatus.parentNode.insertBefore(divResTime, divResStatus.nextSibling)

  const divResData = document.createElement('div')
  divResData.setAttribute('class','content');
  divResData.setAttribute('id','act_data');
  divResData.setAttribute('style','border:solid 1px grey; width:70%; height:300px; overflow:scroll; text-align: left');
  divResStatus.parentNode.insertBefore(divResData, divResStatus.nextSibling)
  
}
else{
  
}
