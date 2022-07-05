export class Visualizer {
  constructor(player, canvasEl) {
    this.player = player;
    this.canvasEl = canvasEl;
    this.ctx = this.canvasEl.getContext('2d');
    this.drawLoop = null;
  }

  reinit() {
    this.stop();

    // Create the audio context.
    // This context will not have any destination, only a source and an analyser.
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Set the source to the player audio stream.
    // Note that this will fail for cross-origin audio.
    let source = null;
    try {
      const stream = this.player.audio.captureStream();
      source = audioCtx.createMediaStreamSource(stream);
      this.fakeStream = false;
    } catch (e) {
      console.log('Could not create audio stream, drawing a fake visualization');
      this.fakeStream = true;
      return;
    }

    // Attach an analyser node.
    this.analyser = audioCtx.createAnalyser();
    source.connect(this.analyser);

    this.analyser.fftSize = 2048;
    this.bufferLength = this.analyser.fftSize;
    this.dataArray = new Uint8Array(this.bufferLength);
  }

  start() {
    this.reinit();
    this.draw();
  }

  stop() {
    cancelAnimationFrame(this.drawLoop);
  }

  draw() {
    this.drawLoop = requestAnimationFrame(this.draw.bind(this));

    if (!this.fakeStream) {
      this.analyser.getByteTimeDomainData(this.dataArray);
    }

    this.canvasEl.width = this.canvasEl.width;

    this.ctx.fillStyle = '#FFF2';

    this.ctx.beginPath();

    const delta = 200;
    const length = !this.fakeStream ? this.bufferLength : 2048;
    const sliceWidth = delta * this.canvasEl.width / length;

    let x = 0;
    let initialY = 0;
    let lastY = 0;
    let lastX = 0;

    for (let i = 0; i < length; i += delta) {
      const v = !this.fakeStream ? this.dataArray[i] / 128 : Math.random() * 2;
      const y = v * this.canvasEl.height / 2;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
        initialY = y;
      } else {
        const xc = (lastX + x) / 2;
        const yc = (lastY + y) / 2;
        this.ctx.quadraticCurveTo(lastX, lastY, xc, yc);
      }

      lastY = y;
      lastX = x;
      
      x += sliceWidth;
    }

    this.ctx.lineTo(this.canvasEl.width, lastY);
    this.ctx.lineTo(this.canvasEl.width, this.canvasEl.height);
    this.ctx.lineTo(0, this.canvasEl.height);
    this.ctx.lineTo(0, initialY);

    this.ctx.lineTo(this.canvasEl.width, this.canvasEl.height / 2);
    this.ctx.fill();
  }
}
