const clientQuotesEl = document.querySelector(".client-quotes");

let ratingData = null;
async function getRatings() {
  if (!ratingData) {
    // Simulating a slow API call.
    await new Promise(resolve => setTimeout(resolve, 200 + (Math.random() * 2000)));
    const response = await fetch("api/get-ratings.json");
    ratingData = await response.json();
  }

  return ratingData;
}

async function initRatings() {
  const { ratings } = await getRatings();
  
  ratings.forEach(rating => {
    const quoteEl = document.createElement("li");
    quoteEl.classList.add("quote");

    const ratingEl = document.createElement("div");
    ratingEl.classList.add("rating");
    ratingEl.dataset.stars = rating.rating;
    quoteEl.appendChild(ratingEl);

    const authorEl = document.createElement("div");
    authorEl.classList.add("author");

    const avatarEl = document.createElement("img");
    avatarEl.src = "assets/avatar.png";
    avatarEl.alt = `${rating.author}'s avatar picture`;
    avatarEl.classList.add("avatar");
    authorEl.appendChild(avatarEl);
    authorEl.appendChild(document.createTextNode(` ${rating.author}`));
    quoteEl.appendChild(authorEl);
    
    const quoteTextEl = document.createElement("p");
    quoteTextEl.textContent = rating.quote;
    quoteEl.appendChild(quoteTextEl);

    clientQuotesEl.appendChild(quoteEl);

    const startsEl = document.createElement("div");
    startsEl.classList.add("stars");
    startsEl.style.width = `${ratingEl.dataset.stars * 1.5}rem`;
    ratingEl.appendChild(startsEl);
  
    // And a hidden element for screen readers.
    const srText = document.createElement("div");
    srText.classList.add("sr-only");
    srText.textContent = `${ratingEl.dataset.stars} out of 5 stars`;
    ratingEl.appendChild(srText);
  });
}

function displayLoadingSpinner(parentEl) {
  const spinnerEl = document.createElement("div");
  spinnerEl.classList.add("spinner");
  parentEl.appendChild(spinnerEl);

  document.documentElement.classList.add("loading");
}

function removeLoadingSpinner(parentEl) {
  const spinnerEl = parentEl.querySelector(".spinner");
  parentEl.removeChild(spinnerEl);

  document.documentElement.classList.remove("loading");
}

displayLoadingSpinner(clientQuotesEl);
initRatings().then(() => removeLoadingSpinner(clientQuotesEl));
