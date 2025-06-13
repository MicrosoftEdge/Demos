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
    console.log("Checking if your device supports the summarizer API...");
    await checkSummarizerAPIAvailability();
  } catch (e) {
    summarizerSystemCheckEl.textContent = `Your device doesn't support summarizing reviews.`;
  }
  console.log("Summarizer API is available.");

  try {
    console.log("Checking if your device supports the Prompt API...");
    await checkPromptAPIAvailability();
  } catch (e) {
    moderationSystemCheckEl.textContent = `Your device doesn't support review checking. Your review will be checked later.`;
  }
  console.log("Prompt API is available.");

  let summarizerSessionIsReady = false;
  let promptSessionIsReady = false;

  const summarizerOptions = {
    sharedContext: "This is a list of user reviews for a pair of hiking boots.",
    type: "key-points",
    format: "plain-text",
    length: "medium"
  }

  console.log("Creating summarizer session with options...", summarizerOptions);
  const summarizerSessionPromise = getSummarizerSession({
    sharedContext: summarizerOptions.sharedContext,
    type: summarizerOptions.type,
    format: summarizerOptions.format,
    length: summarizerOptions.length,
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

  const promptOptions = {
    initialPrompts: [
      {
        role: "system",
        content: "You are an AI model designed to moderate the user-provided review of a pair of hiking shoes being sold on a website.\nYour goal is to detect whether the provided review is OK to publish on the website for other users to see or not.\nAnalyze the review and respond whether the review is OK to publish or not.\n\nFollow these guidelines:\n- Identify whether the user-provided content is actually a review of the hiking shoes product.\n- If the content is not relevant to the product, respond with 'unrelated'.\n- If the content is relevant to the product, analyze if it contains toxic, hateful, violent, or abusive language.\n- If the review contains toxic, hateful, violent, or abusive language, respond with 'KO'.\n- If the review is ok to publish, respond with 'OK'.\n- If the review is unclear, default to 'OK'.\n\nYour response should be structured and concise, adhering to the defined output schema."
      }
    ],
    responseConstraint: {
      "type": "object",
      "required": ["moderation"],
      "additionalProperties": false,
      "properties": {
        "moderation": {
          "type": "string",
          "enum": ["unrelated", "OK", "KO"],
          "description": "The result of the moderation of the user review."
        },
      }
    }
  };

  console.log("Creating prompt session with options...", promptOptions);
  const promptSessionPromise = getLanguageModelSession({
    initialPrompts: promptOptions.initialPrompts,
    responseConstraint: promptOptions.responseConstraint,
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
    console.log("Summarizing review...");

    if (!summarizerSessionIsReady) {
      console.log("Summarizer session is not ready yet. Model is still downloading.");
      summarizerSystemCheckEl.textContent = `Model is still downloading. Please wait.`;
      return;
    }

    console.log("Summarizer session is ready. Proceeding with summarization.");
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

    console.log("Reviews to summarize:", reviews);
    const stream = summarizerSession.summarizeStreaming(reviews);

    for await (const chunk of stream) {
      console.log(`Received chunk: "${chunk}"`);
      summaryOutputEl.textContent += chunk;
    }

    summarizeReviewBtn.removeAttribute("disabled");
    summarizeReviewBtn.textContent = "Summarize reviews";
  });

  moderateReviewBtn.addEventListener("click", async (e) => {
    console.log("Moderating new review...");
    if (!promptSessionIsReady) {
      console.log("Prompt session is not ready yet. Model is still downloading.");
      moderationSystemCheckEl.textContent = `Model is still downloading. Please wait.`;
      return;
    }

    console.log("Prompt session is ready. Proceeding with moderation.");
    reviewMessageEl.textContent = "";
    moderateReviewBtn.setAttribute("disabled", "true");
    moderateReviewBtn.textContent = "Checking review...";
    const text = `${reviewTitleEl.value}. ${reviewDescriptionEl.value}`;

    const promptSession = await promptSessionPromise;
    // Clone the session each time, we don't want previous results to affect this next one.
    console.log("Cloning the prompt session.");
    const newSession = await promptSession.clone();

    console.log("Prompting the new session with text:", text);
    const response = await newSession.prompt(text);

    if (response === "OK") {
      reviewMessageEl.textContent = "Thank you for your review!";
      reviewMessageEl.classList.add("success");
      reviewMessageEl.classList.remove("error");

      addReview(reviewTitleEl.value, reviewDescriptionEl.value, "en", reviewFormEl.querySelector(".star-rating[selected]")?.dataset.rating);
    } else if (response === "KO") {
      reviewMessageEl.textContent = "Your review is not acceptable as written. Please refrain from using toxic, hateful, or abusive language.";
      reviewMessageEl.classList.add("error");
      reviewMessageEl.classList.remove("success");
    } else if (response === "unrelated") {
      reviewMessageEl.textContent = "You didn't provide a valid review of the product. Please try again.";
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