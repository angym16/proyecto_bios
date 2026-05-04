console.log("JS cargado");
document.addEventListener("DOMContentLoaded", () => {

  /* HERO */
  const heroSlides = document.querySelectorAll('.hero-slider .slide');
  let heroIndex = 0;

  if (heroSlides.length > 0) {
    setInterval(() => {
      heroSlides[heroIndex].classList.remove('active');
      heroIndex = (heroIndex + 1) % heroSlides.length;
      heroSlides[heroIndex].classList.add('active');
    }, 4000);
  }

  /* SLIDER CARD */
  const cardSlides = document.querySelectorAll('.slider .slide');
  let cardIndex = 0;

  if (cardSlides.length > 0) {
    setInterval(() => {
      cardSlides[cardIndex].classList.remove('active');
      cardIndex = (cardIndex + 1) % cardSlides.length;
      cardSlides[cardIndex].classList.add('active');
    }, 4000);
  }

});