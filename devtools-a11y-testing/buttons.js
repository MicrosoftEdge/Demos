const donations = document.querySelector('#donate');
const sitenav = document.querySelector('#sitenavigation');
let currentbutton = null;
let currentnav = document.querySelector('#sitenavigation li');

sitenav.addEventListener('click', e => {
  e.preventDefault();
  let t = e.target;
  if (t.href) {
    if (currentnav) { currentnav.classList.remove('current'); }
    t.parentNode.classList.add('current');
    currentnav = t.parentNode;
    e.preventDefault();
  }
});


donations.addEventListener('click', e => {
  let t = e.target;
  if (t.classList.contains('donationbutton')) {
    if (currentbutton) { currentbutton.classList.remove('current'); }
    t.classList.add('current');
    currentbutton = t;
    e.preventDefault();
  }
  if (t.classList.contains('submitbutton')) {
    alert('Thanks for your donation!')
  } 
})