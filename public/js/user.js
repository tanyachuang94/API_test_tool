const nav_login = document.getElementById('nav_login');
const nav_signup = document.getElementById('nav_signup');
const home_signup = document.getElementById('home_signup');
const login_form = document.getElementById('login_form');
const signup_form = document.getElementById('signup_form');
const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');

const modal_2 = document.getElementById('myModal_2');
const myBtn = document.getElementById('myBtn');
const userIcon = document.getElementById('userIcon');
const user = document.getElementById('user');
const name = localStorage.getItem('name');
const token = localStorage.getItem('token');

if (name) { // Fix check token valid
  userIcon.style.display = 'block';
  const img = document.createElement('img');
  img.setAttribute('src', 'imgs/user.png');
  userIcon.appendChild(img);
  user.style.display = 'block';
  user.setAttribute('style', 'color:white');
  user.innerHTML = name;
  myBtn.style.display = 'block';
  myBtn.innerHTML = 'Log out';
  document.getElementById('testPage').style.display = 'block';
  document.getElementById('scrPage').style.display = 'block';
  document.getElementById('repPage').style.display = 'block';
} else {
  // Fix redirect to login page in non-login status
}

nav_login.addEventListener('click', () => {
  signup_form.style.display = 'none';
  login_form.style.display = 'block';
  nav_signup.style.background = 'none';
  nav_login.style.background = 'white';
});

nav_signup.addEventListener('click', () => {
  signup_form.style.display = 'block';
  login_form.style.display = 'none';
  nav_signup.style.background = 'white';
  nav_login.style.background = 'none';
});

myBtn.onclick = function () { // login button
  // if (!localStorage.getItem('token')) {
  if (myBtn.innerHTML == 'Login') {
    modal_2.style.display = 'block';
  } else {
    localStorage.clear();
    window.location.href = './index.html';
  }
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal_2) {
    modal_2.style.display = 'none';
  }
};

function postData(url, data) {
  return fetch(url, {
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.error) {
        alert(result.error);
      } else {
        localStorage.setItem('name', result.name);
        localStorage.setItem('token', result.token);
        window.location.href = './index.html';
      }
    })
    .catch((err) => console.log(err));
}

signupBtn.addEventListener('click', () => {
  // modal_2.style.display = 'none';
  const name = document.getElementById('signup_name').value;
  if (!name) {
    alert('Please enter your name.');
    return;
  }
  const email = document.getElementById('signup_email').value;
  if (!email) {
    alert('Please enter your email.');
    return;
  }
  const password = document.getElementById('signup_password').value;
  if (!password) {
    alert('Please enter your password.');
    return;
  }
  const data = {
    name, email, password,
  };
  postData('/api/signup', data);
});

loginBtn.addEventListener('click', () => {
  const email = document.getElementById('login_email').value;
  if (!email) {
    alert('Please enter your email.');
    return;
  }
  const password = document.getElementById('login_password').value;
  if (!password) {
    alert('Please enter your password.');
    return;
  }
  const data = { email, password };
  postData('/api/login', data);
});
