# WebTransport connection statistics

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/webtransport-getstats/)** ⬅️

This demo connects to a public WebTransport echo server and displays snapshots from [`WebTransport.getStats()`](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport/getStats). Connect for an initial snapshot, then send a datagram to generate traffic; the stats refresh about one second after sending. You can also click **Refresh stats** at any time. It lists every measurement in the specification's [connection](https://w3c.github.io/webtransport/#dictdef-webtransportconnectionstats) and [datagram](https://w3c.github.io/webtransport/#dictdef-webtransportdatagramstats) statistics dictionaries, including fields that your browser does not return. The `datagrams` object itself is not displayed as a row; its measurements appear under **Datagram statistics**.

The **This connection** column compares each field against the actual response. A returned `0` is a measured zero; a returned `null` means no estimate; **Not returned** means the field is absent, which alone cannot distinguish unsupported fields from temporarily unavailable or privacy-restricted fields. The demo does not guess support from the browser version or a hardcoded implementation list. The raw response is also available below the table.

## Requirements

Use a browser that supports `WebTransport.getStats()` and a network that permits WebTransport connections. Chromium's source includes the method behind the experimental `WebTransportStats` feature as far back as milestone 124; this does **not** mean it shipped enabled by default in Chrome or Edge 124. While the method is experimental in a Chromium-based browser, enable Experimental Web Platform features at [about://flags/#enable-experimental-web-platform-features](about://flags/#enable-experimental-web-platform-features) and relaunch, or start the browser with `--enable-experimental-web-platform-features`. The demo checks for the method at runtime and reports when it is unavailable.

The page is hosted on GitHub Pages, but the WebTransport connection goes to the public Chicago or Amsterdam echo servers listed in the [W3C WebTransport Basic Echo samples](https://github.com/w3c/webtransport/blob/main/README.md#samples). The [W3C echo sample page](https://github.com/w3c/webtransport/blob/main/samples/echo/index.html) uses the Chicago endpoint. The browser sends its origin to the server when connecting. The server echoes the datagrams sent by the demo; it does not provide the statistics, which come from the browser. A connection can fail if the server is unavailable or the network blocks WebTransport.

## Use the demo

1. Select an echo server and click **Connect**.
2. Inspect the snapshot in the table or expand the raw response. Click **Refresh stats** whenever you want another snapshot.
3. Click **Send datagram** to generate traffic and see the echoed datagram count; a new stats snapshot appears about a second after sending. Click **Disconnect** when finished.
