if (!localStorage.getItem('token') && !localStorage.getItem('name')) {
  const homeSignup = document.getElementById('homeSignup');
  const modal = document.getElementById('modal');
  homeSignup.addEventListener('click', () => {
    modal.style.display = 'block';
  });
}
let slideIndex = 1;
function showSlides() {
  let i;
  const slides = document.getElementsByClassName('mySlides');
  const dots = document.getElementsByClassName('dot');
  for (i = 0; i < slides.length; i += 1) {
    slides[i].style.display = 'none';
  }
  slideIndex += 1;
  if (slideIndex > slides.length) { slideIndex = 1; }
  for (i = 0; i < dots.length; i += 1) {
    dots[i].className = dots[i].className.replace(' active', '');
  }
  slides[slideIndex - 1].style.display = 'block';
  dots[slideIndex - 1].className += ' active';
  setTimeout(showSlides, 2800);
}
function currentSlide(n) { // Fix 2 round when click dot
  showSlides(slideIndex = n);
}
showSlides();
