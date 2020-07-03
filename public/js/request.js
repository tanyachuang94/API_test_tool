const headers = document.getElementById('headers');
const body = document.getElementById('body');
const headersText = document.getElementById('headersText');
const bodyText = document.getElementById('bodyText');
const reqForm = document.getElementById('request');
const reqBtn = document.getElementById('reqBtn');

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


