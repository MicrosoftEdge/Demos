const summarizeReviewBtn = document.querySelector("#summarize-reviews");
const summaryOutputEl = document.querySelector("#review-summary-output");
const summarizerSystemCheckEl = document.querySelector("#review-summary-check");
const userReviewsEl = document.querySelector(".user-reviews");
const reviewFormEl = document.querySelector("#review-form");
const moderateReviewBtn = reviewFormEl.querySelector("button[type='submit']");
const moderationSystemCheckEl = document.querySelector("#review-moderation-check");
const reviewTitleEl = reviewFormEl.querySelector("#review-title");
const reviewDescriptionEl = reviewFormEl.querySelector("#review-description");
const reviewMessageEl = reviewFormEl.querySelector(".message-bar");
const reviewCountEl = document.querySelector("#review-count");
const averageRatingEl = document.querySelector("#average-rating");
const tutorialPopoverStep1 = document.querySelector(".tutorial-popover.step1");
const tutorialPopoverStep2 = document.querySelector(".tutorial-popover.step2");

function addReview(headline, description, lang, rating) {
  const li = document.createElement("li");
  li.setAttribute("lang", lang);
  li.innerHTML = `<h3 class="review-title">${headline}</h3>
    <p class="review-description">${description}</p>
    <div class="star-rating" data-rating="${rating}"></div>
  `;
  userReviewsEl.prepend(li);

  reviewCountEl.textContent = userReviewsEl.querySelectorAll("li").length;

  const ratingAverage = [...userReviewsEl.querySelectorAll(".star-rating")].reduce((acc, r) => {
    const rating = parseInt(r.dataset.rating, 10);
    return acc + rating;
  }, 0) / userReviewsEl.querySelectorAll(".star-rating").length;

  averageRatingEl.dataset.rating = ratingAverage.toFixed(1);
}

addEventListener("DOMContentLoaded", async () => {
  reviewFormEl.addEventListener("click", e => {
    const ratingEl = e.target.closest(".star-rating");
    if (!ratingEl) {
      return;
    }

    // Mark all other ratings as unselected.
    const allRatings = [...reviewFormEl.querySelectorAll(".star-rating")];
    allRatings.forEach(r => {
      r.removeAttribute("aria-checked");
      r.removeAttribute("selected");
    });

    // Mark the selected rating as selected.
    ratingEl.setAttribute("aria-checked", "true");
    ratingEl.setAttribute("selected", "true");
  });

  try {
    await checkSummarizerAPIAvailability();
  } catch (e) {
    summarizerSystemCheckEl.textContent = `Your device doesn't support summarizing reviews.`;
  }

  try {
    await checkPromptAPIAvailability();
  } catch (e) {
    moderationSystemCheckEl.textContent = `Your device doesn't support review checking. Your review will be checked later.`;
  }

  let summarizerSessionIsReady = false;
  let promptSessionIsReady = false;
  let rewriterSessionIsReady = false;

  const summarizerSessionPromise = getSummarizerSession({
    sharedContext: "This is a list of user reviews for a pair of hiking boots.",
    type: "headline",
    format: "plain-text",
    length: "medium",
    monitor: m => {
      m.addEventListener("downloadprogress", e => {
        const current = (e.loaded / e.total) * 100;
        summarizerSystemCheckEl.textContent = `You'll be able to summarize reviews soon. Downloading model (${current.toFixed(1)}%).`;
        if (e.loaded == e.total) {
          summarizerSystemCheckEl.textContent = "";
          summarizeReviewBtn.removeAttribute("disabled");
          summarizerSessionIsReady = true;
        }
      });
    }
  });

  const promptSessionPromise = getLanguageModelSession({
    initialPrompts: [
      { role: "system", content: "Classify the following product reviews as either OK or Not OK.", },
      { role: "user", content: "Great shoes! I was surprised at how comfortable these boots are for the price. They fit well and are very lightweight." },
      { role: "assistant", content: "OK" },
      { role: "user", content: "Bad quality. I bought these boots for a trip to the mountains, but they fell apart after a few days of hiking. I wouldn't recommend them." },
      { role: "assistant", content: "OK" },
      { role: "user", content: "These boots are awful and anyone who buys them is an idiot." },
      { role: "assistant", content: "Not OK" },
      { role: "user", content: "Terrible product. The manufacturer must be completely incompetent." },
      { role: "assistant", content: "Not OK" },
      { role: "user", content: "Worst purchase ever. I hope this company goes out of business." },
      { role: "assistant", content: "Not OK" },
      { role: "user", content: "Could be better. Nice quality overall, but for the price I was expecting something more waterproof" },
      { role: "assistant", content: "OK" }
    ],
    monitor: m => {
      m.addEventListener("downloadprogress", e => {
        const current = (e.loaded / e.total) * 100;
        moderationSystemCheckEl.textContent = `Downloading the review checking model (${current.toFixed(1)}%). You can still submit your review, but it will be checked and posted later, rather than immediately.`;
        if (e.loaded == e.total) {
          promptSessionIsReady = true;
          moderationSystemCheckEl.textContent = "";
        }
      });
    }
  });

  summarizeReviewBtn.addEventListener("click", async () => {
    if (!summarizerSessionIsReady) {
      summarizerSystemCheckEl.textContent = `Model is still downloading. Please wait.`;
      return;
    }

    const summarizerSession = await summarizerSessionPromise;

    summaryOutputEl.textContent = "";
    summarizeReviewBtn.setAttribute("disabled", "true");
    summarizeReviewBtn.textContent = "Summarizing...";

    const reviews = [...userReviewsEl.querySelectorAll("li")].map(li => {
      const title = li.querySelector(".review-title").textContent;
      const description = li.querySelector(".review-description").textContent;
      const lang = li.getAttribute("lang") || "en";
      return `Review (language: ${lang}): ${title}\nDescription: ${description}`;
    }).join("\n---\n");

    const stream = summarizerSession.summarizeStreaming(reviews);

    for await (const chunk of stream) {
      summaryOutputEl.textContent += chunk;
    }

    summarizeReviewBtn.removeAttribute("disabled");
    summarizeReviewBtn.textContent = "Summarize reviews";
  });

  moderateReviewBtn.addEventListener("click", async (e) => {
    if (!promptSessionIsReady) {
      moderationSystemCheckEl.textContent = `Model is still downloading. Please wait.`;
      return;
    }

    reviewMessageEl.textContent = "";
    moderateReviewBtn.setAttribute("disabled", "true");
    moderateReviewBtn.textContent = "Checking review...";
    const text = `${reviewTitleEl.value}. ${reviewDescriptionEl.value}`;

    const promptSession = await promptSessionPromise;
    // Clone the session each time, we don't want previous results to affect this next one.
    const newSession = await promptSession.clone();
    const response = await newSession.prompt(text);

    if (response === "OK") {
      reviewMessageEl.textContent = "Thank you for your review!";
      reviewMessageEl.classList.add("success");
      reviewMessageEl.classList.remove("error");

      addReview(reviewTitleEl.value, reviewDescriptionEl.value, "en", reviewFormEl.querySelector(".star-rating[selected]")?.dataset.rating);
    } else {
      reviewMessageEl.textContent = "Your review is not acceptable as written. Please refrain from using toxic, hateful, or abusive language.";
      reviewMessageEl.classList.add("error");
      reviewMessageEl.classList.remove("success");
    }

    moderateReviewBtn.removeAttribute("disabled");
    moderateReviewBtn.textContent = "Submit review";
  });

  // Show the first tutorial popover when the app starts.
  tutorialPopoverStep1.showPopover();
  // Listen to the next button in the first popover.
  tutorialPopoverStep1.querySelector(".next").addEventListener("click", () => {
    tutorialPopoverStep1.hidePopover();
    // Show the second popover.
    tutorialPopoverStep2.showPopover();
  });
  tutorialPopoverStep2.querySelector(".next").addEventListener("click", (e) => {
    e.preventDefault();
    tutorialPopoverStep2.hidePopover();
  });
});

// TODO: ADD A LOT OF NICE CONSOLE LOGGING SO DEVS CAN FOLLOW WHAT'S HAPPENING