class PlaygroundMetrics {
  constructor() {
    this.startTime = null;
    this.sessionCreatedTime = null;
    this.streamStartTime = null;
    this.tokenCount = null;

    this.initLatencyMetricEl = document.querySelector("#init-latency-metric");
    this.firstTokenLatencyMetricEl = document.querySelector("#first-token-latency-metric");
    this.tokensMetricEl = document.querySelector("#tokens-metric");
    this.tokenRateMetricEl = document.querySelector("#token-rate-metric");
    this.totalTimeMetricEl = document.querySelector("#total-time-metric");

    if (!this.checkMetricsElements()) {
      console.error("Metrics elements not found in the DOM.");
    }
  }
  
  checkMetricsElements() {
    return this.initLatencyMetricEl && this.firstTokenLatencyMetricEl && this.tokensMetricEl && this.tokenRateMetricEl;
  }

  setNoStreamMode() {
    if (!this.checkMetricsElements()) {
      return;
    }

    this.initLatencyMetricEl.parentElement.parentElement.classList.add("no-stream-mode");
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
    this.tokenCount = 0;
  }

  signalOnStreamToken() {
    if (!this.checkMetricsElements()) {
      return;
    }

    if (this.tokenCount === 0) {
      this.firstTokenLatencyMetricEl.innerText = Math.round(performance.now() - this.streamStartTime);
    }

    this.tokenCount++;
    this.tokensMetricEl.innerText = this.tokenCount;

    const rate = this.tokenCount / ((performance.now() - this.streamStartTime) / 1000);
    this.tokenRateMetricEl.innerText = rate.toFixed(1);
  }

  signalOnAfterResult() {
    if (!this.checkMetricsElements()) {
      return;
    }

    const totalTime = performance.now() - this.startTime;
    this.totalTimeMetricEl.innerText = Math.round(totalTime);
  }
}
