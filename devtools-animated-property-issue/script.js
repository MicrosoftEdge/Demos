document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const { value } = document.querySelector("input");
  const x = [];
  for (let i = 0; i < parseInt(value, 10); i++) {
    x.push(Math.random() * 1000);
  }
});