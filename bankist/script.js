'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const navLinks = document.querySelectorAll(".nav__link");
const navBar = document.querySelector(".nav__links");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const header = document.querySelector(".header");
const sections = document.querySelectorAll(".section");
const lazyImages = document.querySelectorAll("img[data-src]");



const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn =>  btn.addEventListener('click', openModal)
  );

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
// /////////////////////////////////////////////////////////////
// Smooth scrolling

btnScrollTo.addEventListener("click", function (e) {
section1.scrollIntoView({behavior: "smooth"});
});



// ////////////////////////////////////////////////////////////////////
// Page Navigation
// Event Deligation

navBar.addEventListener("click", function(e){
  const id = e.target.getAttribute("href");
  if(e.target.classList.contains("nav__link")){
    e.preventDefault();
  document.querySelector(id).scrollIntoView({behavior: "smooth"});
  }
});

// Tabbed Componenets

tabsContainer.addEventListener("click", function(e){
  const clicked = e.target.closest(".operations__tab");

  // Guard Clause
  if(!clicked) return;

  // Active tab
  tabs.forEach((tab) => {
    tab.classList.remove("operations__tab--active");
  });
  clicked.classList.add("operations__tab--active");
  tabsContent.forEach((content) => {
    content.classList.remove("operations__content--active")
  });
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");


});

// Menu Fade Animation
const handleHover = function(e){
  if(e.target.classList.contains("nav__link")){
    const hovered = e.target;
    const siblings = hovered.closest(".nav").querySelectorAll(".nav__link");
    const logo = hovered.closest(".nav").querySelector("img");


    siblings.forEach(nav => {nav.style.opacity = this});
    logo.style.opacity = this;
    hovered.style.opacity = "1";
  }
}


// Passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));


// const initialCoords = section1.getBoundingClientRect();

// Sticky NAVIGATION: Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = (entries, observer) => {
  const [entry] = entries
  if(!entry.isIntersecting) {
  nav.classList.add("sticky");
  }
  else nav.classList.remove("sticky");
};

const obsPref = {
  root: null,
  treshold: 0,
  rootMargin: `-${navHeight}px`,
};

const observer = new IntersectionObserver(stickyNav, obsPref);
observer.observe(header);

///////////////////////////////////
// Reveal Elements on scroll
const standardPref = {
  root: null,
  threshold: 0.15
};

const revealSection = (sections, observer) => {
  sections.forEach((section) => {
  if(section.isIntersecting) {
    section.target.classList.remove("section--hidden");
    observer.unobserve(section.target);
  }

})
};
const sectionObserver = new IntersectionObserver(revealSection, standardPref);
sections.forEach((section, i) => {
  section.classList.add("section--hidden")
  sectionObserver.observe(section)
});

// Lazy loading images
const loadImages = (images, observer) => {
  const [image] = images;
    if(!image.isIntersecting) return;
    image.target.src = image.target.dataset.src;
    image.target.addEventListener("load", () => image.target.classList.remove("lazy-img"))

    observer.unobserve(image.target);
    
};

const imageObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0,
  rootMargin: "200px"
});
lazyImages.forEach(img => imageObserver.observe(img));



// Slider Component
const slider = function() {
const slides = document.querySelectorAll(".slide");
const btnRight = document.querySelector(".slider__btn--right");
const btnLeft = document.querySelector(".slider__btn--left");
const dotContainer = document.querySelector(".dots");
let curSlide = 0;
const maxSlides = slides.length;

// INIT FUNCTION

const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML("beforeend", 
    `<button class="dots__dot" data-slide="${i}"></button>`);
  })
};


const activateDot = function(slide) {
  const dots =  document.querySelectorAll(".dots__dot");
  dots.forEach(dot => dot.classList.remove("dots__dot--active"));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"`)
    .classList.add("dots__dot--active");
};

const slide = function(slide, i) {
  slide.style.transform = `translateX(${(i - curSlide) * 100}%)`;
};



const init = function() {
  // initial Slide positions
  slides.forEach(slide);
  // Create Dots
  createDots();
  // Activate Dot
  activateDot(curSlide);
}

init();

// Next Slide
const nextSlide = () => {
  if(curSlide == maxSlides - 1) curSlide = 0
  else curSlide++;
  slides.forEach(slide);
  activateDot(curSlide);
}
// Previous Slide
const prevSlide =  () => {
  if(curSlide == 0) curSlide = maxSlides - 1
  else curSlide--;
  slides.forEach(slide);
  activateDot(curSlide);
}


// Event Handlers

btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);
document.addEventListener("keydown", (e) => {
  e.key == "ArrowRight" && nextSlide();
  e.key == "ArrowLeft" && prevSlide();
});
dotContainer.addEventListener("click", function(e) {
  if(!e.target.classList.contains("dots__dot")) return;
  curSlide = e.target.dataset.slide;
  slides.forEach(slide);
  activateDot(curSlide);
});
}
slider();
// Sticky Navigation
// PRIMITIVE
/*
window.addEventListener("scroll", function(){

  if(window.scrollY > initialCoords.top) nav.classList.add("sticky")
  else nav.classList.remove("sticky");

});
*/

// PRIMITIVE
/*
document.querySelectorAll(".nav__link").forEach(function(el) {
  el.addEventListener("click", function(e) {
    e.preventDefault();
    
    const id = this.getAttribute("href");
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: "smooth"});
  });
});
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);


console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements

const message = document.createElement("div");
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improves fuctionality and alatytics';
message.innerHTML = 'We use cookies for improves fuctionality and alatytics. <button class="btn btn--close-cookie">Got it!</button>';

header.prepend(message);
header.append(message);

// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click', () => message.remove());

// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.width);

console.log(getComputedStyle(message).color);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 48 + "px";

document.documentElement.style.setProperty("--color-primary", 'orangered');

// Attributes
const logo = document.querySelector(".nav__logo");
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

const link = document.querySelector(".twitter-link");
console.log(link.getAttribute("href"));
console.log(link.href)

console.log(logo.dataset.foodId);

// Classes
*/
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // const btnCoord = e.target.getBoundingClientRect();
  // console.log(btnCoord);
  // console.log(`Current scroll (X/Y): ${window.pageXOffset} ${window.pageYOffset}`);
  // console.log("HEIGHT/WIDTH VIEWPORT", document.documentElement.clientHeight, document.documentElement.clientWidth);


  // Scrolling
  // window.scrollTo(s1coords.left, s1coords.top + window.pageYOffset);

//   window.scrollTo({
//     left: s1coords.left + window.pageXOffset,
//     top: s1coords.top + window.pageYOffset,
//     behavior:  "smooth"
// });


/*
const h1 = document.querySelector("h1");
const displayE = function(e) {
  alert("Yeah I get it, you can read");
  h1.removeEventListener("mouseenter", displayE);
};
h1.addEventListener("mouseenter", displayE)

// h1.onmouseenter = displayE;

*

// rgb(255, 255, 255);

const randomInt = (min, max) => Math.floor(Math.random() * (max - min) +  min);

const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;


document.querySelector(".nav__link").addEventListener("click", function(e) {
  this.style.backgroundColor = randomColor();
  console.log("LINK", e.target);

  // Stop Propagation
  // e.stopPropagation();
});

document.querySelector(".nav__links").addEventListener("click", function(e) {
  this.style.backgroundColor = randomColor();
  console.log("CONTAINER", e.target);

});

document.querySelector(".nav").addEventListener("click", function(e) {
  this.style.backgroundColor = randomColor();
  console.log("NAV", e.target);
});

const h1 = document.querySelector("h1");

// Going downwards: child;
console.log(h1.querySelectorAll(".highlight"));
console.log(h1.children);
h1.lastElementChild.style.color = "red";

// Going Upwards: Parents:
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest(".header").style.background = `var(--gradient-secondary)`;
h1.closest("h1").style.background = `var(--gradient-primary)`;

// Sideways: Siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function(el){
  if(el !== h1) el.style.transform = "scale(0.5)"
});



window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = "";
})
*/