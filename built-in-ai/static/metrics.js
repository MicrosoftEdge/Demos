class PlaygroundMetrics {
  constructor() {
    this.startTime = null;
    this.sessionCreatedTime = null;
    this.streamStartTime = null;
    this.chunkCount = null;

    this.initLatencyMetricEl = document.querySelector("#init-latency-metric");
    this.firstChunkLatencyMetricEl = document.querySelector("#first-chunk-latency-metric");
    this.chunksMetricEl = document.querySelector("#chunks-metric");
    this.chunkRateMetricEl = document.querySelector("#chunk-rate-metric");

    if (!this.checkMetricsElements()) {
      console.error("Metrics elements not found in the DOM.");
    }
  }

  checkMetricsElements() {
    return this.initLatencyMetricEl && this.firstChunkLatencyMetricEl && this.chunksMetricEl && this.chunkRateMetricEl;
  }

  signalOnBeforeCreateSession() {
    if (!this.checkMetricsElements()) {
      return;
    }

    this.startTime = performance.now();
  }

  signalOnAfterSessionCreated() {
    if (!this.checkMetricsElements()) {
      return;
    }

    this.sessionCreatedTime = performance.now();
    this.initLatencyMetricEl.innerText = Math.round(this.sessionCreatedTime - this.startTime);
  }

  signalOnBeforeStream() {
    if (!this.checkMetricsElements()) {
      return;
    }

    this.streamStartTime = performance.now();
    this.chunkCount = 0;
  }

  signalOnStreamChunk() {
    if (!this.checkMetricsElements()) {
      return;
    }

    if (this.chunkCount === 0) {
      this.firstChunkLatencyMetricEl.innerText = Math.round(performance.now() - this.streamStartTime);
    }

    this.chunkCount++;
    this.chunksMetricEl.innerText = this.chunkCount;

    const rate = this.chunkCount / ((performance.now() - this.streamStartTime) / 1000);
    this.chunkRateMetricEl.innerText = rate.toFixed(1);
  }
}
