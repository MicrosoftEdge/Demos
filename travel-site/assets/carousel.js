const carouselEls = document.querySelectorAll('.carousel');

carouselEls.forEach(carouselEl => {
  const quotes = carouselEl.querySelectorAll('.quote');
  let currentQuote = 0;
  const prevBtn = carouselEl.querySelector('.carousel-prev');
  const nextBtn = carouselEl.querySelector('.carousel-next');

  prevBtn.addEventListener("click", () => {
    if (currentQuote === 0) {
      return;
    }

    currentQuote--;
    quotes[currentQuote].scrollIntoView({ behavior: 'smooth' });
  });

  nextBtn.addEventListener("click", () => {
    if (currentQuote === quotes.length - 1) {
      return;
    }

    currentQuote++;
    quotes[currentQuote].scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
