const composeBtn = document.querySelector('.new');
const resetBtn = document.querySelector('.compose-form [type="reset"]');
const composeEl = document.querySelector('.compose');
const composeFormToField = document.querySelector('.compose-form [name="to"]');

composeBtn.addEventListener('click', startCompose);
resetBtn.addEventListener('click', resetCompose);

function startCompose() {
  composeEl.classList.add('visible');
}

function resetCompose() {
  composeEl.classList.remove('visible');
}

// The app's protocol handling will mailto requests to the index.html page with a GET parameter.
// Let's check if there's one, and if so, send it to the compose form.
const searchStr = decodeURIComponent(document.location.search);
if (searchStr.startsWith('?newmailto')) {
  startCompose();
  const email = searchStr.substring(18);
  composeFormToField.value = email;
}
