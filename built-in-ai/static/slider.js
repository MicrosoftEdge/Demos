(function () {
  function updateRangeProgress(el) {
    const percent = (el.value - el.min) / (el.max - el.min) * 100;
    el.style.setProperty("--value", `${percent}%`);
  }

  document.querySelectorAll(".slider input[type='range']").forEach(inputRangeEl => {
    inputRangeEl.addEventListener("input", e => {
      updateRangeProgress(inputRangeEl);
    });

    updateRangeProgress(inputRangeEl);
  });
})();
