export class ImageViewer {
  constructor(containerDialog) {
    this.containerDialog = containerDialog;
    this.listOfImagesElement = containerDialog.querySelector('.list-of-images');
    this.beforeImage = containerDialog.querySelector('.before img');
    this.afterImage = containerDialog.querySelector('.after img');
    this.sliderRange = containerDialog.querySelector('.slider input');

    this.sliderRange.addEventListener('input', () => {
      this.updateSwipe();
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

    this.sliderRange.value = this.sliderRange.max / 2;

    // Wait for the after image to load before resizing the slider.
    this.afterImage.onload = () => {
      this.sliderRange.style.width = this.afterImage.offsetWidth + 'px';
    };
    this.sliderRange.style.width = this.afterImage.offsetWidth + 'px';

    this.updateSwipe();
  }

  updateSwipe() {
    const value = Math.round(this.sliderRange.value / 10);

    const beforeClip = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
    const afterClip = `polygon(${value}% 0, 100% 0, 100% 100%, ${value}% 100%)`;
    
    this.beforeImage.style.clipPath = beforeClip;
    this.afterImage.style.clipPath = afterClip;

    this.containerDialog.style.setProperty('--pos', value + '%');
  }
}
