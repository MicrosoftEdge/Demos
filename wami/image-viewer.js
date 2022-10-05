export class ImageViewer {
  constructor(containerDialog) {
    this.containerDialog = containerDialog;
    this.currentImageContainer = containerDialog.querySelector('.current-image');
    this.listOfImagesElement = containerDialog.querySelector('.list-of-images');
    this.beforeImage = containerDialog.querySelector('.before img');
    this.afterImage = containerDialog.querySelector('.after img');

    this.updateSwipe = this.updateSwipe.bind(this);

    this.containerDialog.addEventListener('mousedown', () => {
      addEventListener('mousemove', this.updateSwipe);
      addEventListener('mouseup', () => {
        removeEventListener('mousemove', this.updateSwipe);
      }, { once: true });
    });

    this.input = [];
    this.output = [];
  }

  show() {
    this.containerDialog.showModal();
  }

  populateFromOutput(images) {
    this.input = images;
    this.output = [];
    this.render();
  }
  
  populateFromInputAndOutput(inputImages, outputImages) {
    this.input = inputImages;
    this.output = outputImages;
    this.render();
  }

  render() {
    // Clear the UI.
    this.listOfImagesElement.innerHTML = '';

    // Generate images in the list-of-images elements, based on the output images.
    for (let i = 0; i < this.output.length; i++) {
      const li = document.createElement('li');

      let image = this.output[i];
      const imgEl = document.createElement('img');
      imgEl.src = image.src;
      li.appendChild(imgEl);

      li.addEventListener('click', () => this.viewImage(i));

      this.listOfImagesElement.appendChild(li);
    }

    this.viewImage(0);
  }

  viewImage(index) {
    if (index < 0 || index >= this.output.length) {
      return;
    }

    this.beforeImage.src = this.input[index].src;
    this.afterImage.src = this.output[index].src;

    this.updateSwipe();
  }

  updateSwipe(e) {
    let value = 50;
    if (e) {
      // Calculate the position of the mouse relative to the image container.
      value = (e.layerX - this.currentImageContainer.offsetLeft) * 100 / this.currentImageContainer.offsetWidth;
    }

    // Clamp value between 0 and 100.
    value = Math.round(Math.max(0, Math.min(100, value)));
    
    const beforeClip = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
    const afterClip = `polygon(${value}% 0, 100% 0, 100% 100%, ${value}% 100%)`;
    
    this.beforeImage.style.clipPath = beforeClip;
    this.afterImage.style.clipPath = afterClip;

    this.containerDialog.style.setProperty('--pos', value + '%');
  }
}
