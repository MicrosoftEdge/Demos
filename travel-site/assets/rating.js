
// <div class="rating" data-stars="5"></div>

const ratingEls = document.querySelectorAll(".rating");

ratingEls.forEach(el => {
  const ratingEl = document.createElement("div");
  ratingEl.classList.add("stars");
  ratingEl.style.width = `${el.dataset.stars * 1.5}rem`;
  el.appendChild(ratingEl);

  // And a hidden element for screen readers.
  const srText = document.createElement("div");
  srText.classList.add("sr-only");
  srText.textContent = `${el.dataset.stars} out of 5 stars`;
  el.appendChild(srText);
});
