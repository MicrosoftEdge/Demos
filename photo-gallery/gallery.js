let IMAGES = [];
let AUTHORS = {};

const galleryEl = document.querySelector(".gallery");
const filterEl = document.querySelector(".filters");
const filesEl = document.querySelector('.files');

function formatDate(data) {
  const date = new Date(data.DateTime.substring(0, 10).replace(/:/g, '/'));
  return date.toLocaleDateString();
}

function formatMakeAndModel(data) {
  if (data.Make === 'Canon') {
    return data.Model;
  }
  return `${data.Make} ${data.Model}`;
}

function formatExposureTime(data) {
  if (data.ExposureTime >= 1) {
    return `${data.ExposureTime}s`;
  }
  return `1/${1 / data.ExposureTime}s`;
}

function formatFNumber(data) {
  return `f/${data.FNumber}`;
}

function formatFocalLength(data) {
  if (data.FocalLengthIn35mmFilm) {
    return `${data.FocalLengthIn35mmFilm}mm`;
  }
  return `${data.FocalLength}mm`;
}

function formatISO(data) {
  return `${data.ISOSpeedRatings}`;
}

function filterByCamera(camera) {
  populateGallery(IMAGES.filter(image => {
    if (!camera) return true;
    return camera === formatMakeAndModel(image.meta);
  }));
}

function filterByAperture(aperture) {
  populateGallery(IMAGES.filter(image => {
    if (!aperture) return true;
    return aperture === formatFNumber(image.meta);
  }));
}

function filterByExposure(exposure) {
  populateGallery(IMAGES.filter(image => {
    if (!exposure) return true;
    return exposure === formatExposureTime(image.meta);
  }));
}

function filterByFocalLength(focalLength) {
  populateGallery(IMAGES.filter(image => {
    if (!focalLength) return true;
    return focalLength === formatFocalLength(image.meta);
  }));
}

function filterByISO(iso) {
  populateGallery(IMAGES.filter(image => {
    if (!iso) return true;
    return iso === formatISO(image.meta);
  }));
}

function populateFilters() {
  const cameras = new Set();
  const apertures = new Set();
  const exposures = new Set();
  const focalLengths = new Set();
  const isos = new Set();

  IMAGES.forEach(image => {
    cameras.add(formatMakeAndModel(image.meta));
    apertures.add(formatFNumber(image.meta));
    exposures.add(formatExposureTime(image.meta));
    focalLengths.add(formatFocalLength(image.meta));
    isos.add(formatISO(image.meta));
  });

  const cameraEl = document.getElementById('camera-filter');
  Array.from(cameras).sort().forEach(camera => {
    const optionEl = document.createElement("option");
    optionEl.value = camera;
    optionEl.textContent = camera;
    cameraEl.appendChild(optionEl);
  });

  const apertureEl = document.getElementById('aperture-filter');
  Array.from(apertures).sort((a, b) => {
    return parseFloat(a.substring(2)) - parseFloat(b.substring(2));
  }).forEach(aperture => {
    const optionEl = document.createElement("option");
    optionEl.value = aperture;
    optionEl.textContent = aperture;
    apertureEl.appendChild(optionEl);
  });

  const exposureEl = document.getElementById('exposure-filter');
  Array.from(exposures).sort((a, b) => {
    return eval(a.substring(0, a.length - 1)) - eval(b.substring(0, b.length - 1));
  }).forEach(exposure => {
    const optionEl = document.createElement("option");
    optionEl.value = exposure;
    optionEl.textContent = exposure;
    exposureEl.appendChild(optionEl);
  });

  const focalLengthEl = document.getElementById('focal-length-filter');
  Array.from(focalLengths).sort((a, b) => {
    return parseFloat(a.substring(0, a.length - 2)) - parseFloat(b.substring(0, b.length - 2));
  }).forEach(focalLength => {
    const optionEl = document.createElement("option");
    optionEl.value = focalLength;
    optionEl.textContent = focalLength;
    focalLengthEl.appendChild(optionEl);
  });

  const isoEl = document.getElementById('iso-filter');
  Array.from(isos).sort((a, b) => {
    return parseInt(a) - parseInt(b);
  }).forEach(iso => {
    const optionEl = document.createElement("option");
    optionEl.value = iso;
    optionEl.textContent = iso;
    isoEl.appendChild(optionEl);
  });
}

function populateFiles(images) {
  filesEl.innerHTML = '';

  images.forEach(({ file, w, h }) => {
    const liEl = document.createElement("li");
    liEl.classList.add('file');
    liEl.setAttribute('tabindex', '0');

    const iconEl = document.createElement("div");
    iconEl.classList.add('icon');
    iconEl.style.backgroundImage = `url(img/300/${file})`;
    liEl.appendChild(iconEl);

    const nameEl = document.createElement("div");
    nameEl.classList.add('name');
    nameEl.textContent = file;
    liEl.appendChild(nameEl);

    const dimensionEl = document.createElement("div");
    dimensionEl.classList.add('dimension');
    dimensionEl.textContent = `${w}px × ${h}px`;
    liEl.appendChild(dimensionEl);

    filesEl.appendChild(liEl);
  });
}

async function getImageData() {
  const response = await fetch('data.json');
  const data = await response.json();
  return data;
}

function populateGallery(images) {
  galleryEl.innerHTML = '';

  images.forEach(({ file, user, description, w, h, meta }) => {
    const liEl = document.createElement("li");
    liEl.classList.add('photo');
    liEl.setAttribute('tabindex', '0');

    const socialEl = document.createElement("div");
    socialEl.classList.add('social');
    socialEl.innerHTML = `
      <button class="more-actions">...</button>
      <div class="user">
        <p class="name"><a href="#">${user}</a></p>
        <div class="avatar" style="background-color:${AUTHORS[user].color};"></div>
      </div>
    `;
    liEl.appendChild(socialEl);

    const photoWrapperEl = document.createElement("div");
    photoWrapperEl.classList.add('photo-wrapper');
    liEl.appendChild(photoWrapperEl);

    const photoButtonWrapper = document.createElement("div");
    photoButtonWrapper.classList.add('photo-buttons');
    photoWrapperEl.appendChild(photoButtonWrapper);

    const likeEl = document.createElement("button");
    likeEl.classList.add('like');
    likeEl.setAttribute('title', 'Click to like this photo');
    photoButtonWrapper.appendChild(likeEl);

    const plusEl = document.createElement("button");
    plusEl.classList.add('plus');
    plusEl.setAttribute('title', 'Click to add this photo to your collection');
    photoButtonWrapper.appendChild(plusEl);

    const shareEl = document.createElement("button");
    shareEl.classList.add('share');
    shareEl.setAttribute('title', 'Click to share this photo');
    photoButtonWrapper.appendChild(shareEl);

    const beforeShadowEl = document.createElement("div");
    beforeShadowEl.classList.add('before-shadow');
    beforeShadowEl.style = `width:${w}px;left:${(300 - w)/2}px;`;
    photoWrapperEl.appendChild(beforeShadowEl);
    
    const afterShadowEl = document.createElement("div");
    afterShadowEl.classList.add('after-shadow');
    afterShadowEl.style = `width:${w}px;left:${(300 - w)/2}px;bottom:0;`;
    photoWrapperEl.appendChild(afterShadowEl);

    const imageEl = document.createElement("img");
    imageEl.src = `img/300/${file}`;
    imageEl.setAttribute('alt', description);
    imageEl.setAttribute('width', w);
    imageEl.setAttribute('height', h);
    imageEl.setAttribute('title', 'Click to view full size');
    photoWrapperEl.appendChild(imageEl);

    const metaEl = document.createElement("ul");
    metaEl.classList.add('meta');
    liEl.appendChild(metaEl);
    metaEl.innerHTML = `
      <li class="description"><span>${description}</span></li>
      <li class="date gallery-icon--date">
        <strong></strong>
      </li>
      <li class="camera gallery-icon--camera">
        <strong></strong>
        <button class="filter" title="Filter photos"><span>Filter</span></button>
      </li>
      <li class="aperture gallery-icon--aperture">
        <strong></strong>
        <button class="filter" title="Filter photos"><span>Filter</span></button>
      </li>
      <li class="exposure gallery-icon--exposure">
        <strong></strong>
        <button class="filter" title="Filter photos"><span>Filter</span></button>
      </li>
      <li class="focal-length gallery-icon--focal-length">
        <strong></strong>
        <button class="filter" title="Filter photos"><span>Filter</span></button>
      </li>
      <li class="iso gallery-icon--iso">
        <strong></strong>
        <button class="filter" title="Filter photos"><span>Filter</span></button>
      </li>
    `;

    const dialogEl = document.createElement("dialog");
    const dialogFormEl = document.createElement("form");
    dialogFormEl.setAttribute("method", "dialog");
    dialogEl.appendChild(dialogFormEl);

    const dialogCloseEl = document.createElement("button");
    dialogCloseEl.classList.add('close');
    dialogCloseEl.setAttribute("type", "submit");
    dialogCloseEl.setAttribute("value", "close");
    dialogCloseEl.setAttribute("title", "Close");
    dialogCloseEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path d="M19.3 4.7l-1.4-1.4L12 10.6 4.7 3.3 3.3 4.7 10.6 12l-7.3 7.3 1.4 1.4L12 13.4l7.3 7.3 1.4-1.4L13.4 12z"/>
      </svg>
    `;
    dialogFormEl.appendChild(dialogCloseEl);
    liEl.appendChild(dialogEl);

    galleryEl.appendChild(liEl);

    metaEl.querySelector('.date strong').textContent = formatDate(meta);
    metaEl.querySelector('.camera strong').textContent = formatMakeAndModel(meta);
    metaEl.querySelector('.aperture strong').textContent = formatFNumber(meta);
    metaEl.querySelector('.exposure strong').textContent = formatExposureTime(meta);
    metaEl.querySelector('.focal-length strong').textContent = formatFocalLength(meta);
    metaEl.querySelector('.iso strong').textContent = formatISO(meta);
  });
}

getImageData().then(imageData => {
  IMAGES = imageData.images;
  AUTHORS = imageData.authors;

  populateGallery(IMAGES);
  populateFilters();
});

addEventListener('input', e => {
  const filter = e.target.closest('.filter select');
  if (filter) {
    // Reset the other filters
    filterEl.querySelectorAll('.filter select').forEach(select => {
      if (select !== filter) {
        select.selectedIndex = 0;
      }
    });

    switch (filter.id) {
      case 'camera-filter':
        filterByCamera(filter.value);
        break;
      case 'aperture-filter':
        filterByAperture(filter.value);
        break;
      case 'exposure-filter':
        filterByExposure(filter.value);
        break;
      case 'focal-length-filter':
        filterByFocalLength(filter.value);
        break;
      case 'iso-filter':
        filterByISO(filter.value);
        break;
    }
  }
});

addEventListener('click', e => {
  const clickedPhoto = e.target.tagName === 'IMG' && e.target.closest('.photo');
  if (!clickedPhoto) {
    return;
  }

  selectPhoto(clickedPhoto);
});

addEventListener('click', e => {
  const clickedLike = e.target.classList.contains('like') && e.target.closest('.photo');
  if (!clickedLike) {
    return;
  }

  e.target.closest('.photo').classList.toggle('liked');
});

addEventListener('click', e => {
  const clickedPlus = e.target.classList.contains('plus') && e.target.closest('.photo');
  if (!clickedPlus) {
    return;
  }

  e.target.closest('.photo').classList.toggle('plussed');
});

addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    selectPhoto();
  } else if (e.key === 'Enter') {
    // Check if a photo is currently focused.
    const focusedPhoto = document.querySelector('.photo:focus');
    focusedPhoto && selectPhoto(focusedPhoto);
  }
});

function loadPhoto(fileName) {
  return new Promise(resolve => {
    const imageEl = document.createElement("img");
    imageEl.src = fileName;
    imageEl.addEventListener('load', () => {
      resolve(imageEl);
    }, { once: true });
  });
}

function selectPhoto(clickedPhoto) {
  // Also remove the currently selected photo.
  galleryEl.querySelectorAll('.photo.selected').forEach(photo => {
    if (!clickedPhoto || photo !== clickedPhoto) photo.classList.remove('selected');
  });

  if (clickedPhoto) {
    const isSelected = clickedPhoto.classList.contains('selected');
    clickedPhoto.classList.toggle('selected', !isSelected);
    const clickedImg = clickedPhoto.querySelector('img');
    const wrapper = clickedImg.parentNode;

    if (!isSelected) {
      loadPhoto(clickedImg.src.replace('/300/', '/1920/')).then(img => {
        img.setAttribute('width', clickedImg.getAttribute('width'));
        img.setAttribute('height', clickedImg.getAttribute('height'));
        wrapper.replaceChild(img, clickedImg);
      });
    } else {
      loadPhoto(clickedImg.src.replace('/1920/', '/300/')).then(img => {
        img.setAttribute('width', clickedImg.getAttribute('width'));
        img.setAttribute('height', clickedImg.getAttribute('height'));
        wrapper.replaceChild(img, clickedImg);
      });
    }
  }
}
