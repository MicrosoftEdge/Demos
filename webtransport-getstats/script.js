const serverSelect = document.getElementById("server");
const connectButton = document.getElementById("connect");
const sendButton = document.getElementById("send");
const refreshButton = document.getElementById("refresh");
const disconnectButton = document.getElementById("disconnect");
const status = document.getElementById("status");
const received = document.getElementById("received");
const updated = document.getElementById("updated");
const statsOutput = document.getElementById("stats");
const connectionStatsBody = document.getElementById("connection-stats");
const datagramStatsBody = document.getElementById("datagram-stats");

const connectionFields = [
  "smoothedRtt", "rttVariation", "minRtt", "estimatedSendRate",
  "atSendCapacity",
  "bytesSent", "bytesSentOverhead", "bytesAcknowledged", "packetsSent",
  "bytesLost", "packetsLost", "bytesReceived", "packetsReceived",
];
const datagramFields = [
  "droppedIncoming", "expiredIncoming", "expiredOutgoing", "lostOutgoing",
];

function addStatRows(fields, body) {
  return fields.map((name) => {
    const row = document.createElement("tr");
    const labelCell = document.createElement("th");
    const code = document.createElement("code");
    code.textContent = name;
    labelCell.scope = "row";
    labelCell.append(code);

    const valueCell = document.createElement("td");
    const statusCell = document.createElement("td");
    row.append(labelCell, valueCell, statusCell);
    body.append(row);
    return { name, valueCell, statusCell };
  });
}

const connectionRows = addStatRows(connectionFields, connectionStatsBody);
const datagramRows = addStatRows(datagramFields, datagramStatsBody);

function updateRows(rows, stats) {
  for (const { name, valueCell, statusCell } of rows) {
    if (stats === undefined) {
      valueCell.textContent = "—";
      statusCell.textContent = "Awaiting snapshot";
    } else if (stats !== null && Object.hasOwn(stats, name)) {
      const result = stats[name];
      valueCell.textContent = String(result);
      statusCell.textContent = result === null ? "Returned (null)" : "Returned";
    } else {
      valueCell.textContent = "—";
      statusCell.textContent = "Not returned";
    }
  }
}

function showStats(stats) {
  updateRows(connectionRows, stats);
  updateRows(datagramRows, stats.datagrams ?? null);
  statsOutput.textContent = JSON.stringify(stats, null, 2);
}

updateRows(connectionRows, undefined);
updateRows(datagramRows, undefined);

let transport = null;
let statsInFlight = false;
let connectionState = "disconnected";
let sendRefreshTimer = null;

const supported = typeof WebTransport !== "undefined" &&
  typeof WebTransport.prototype.getStats === "function";

status.textContent = supported
  ? "Select a server and connect."
  : "WebTransport.getStats() is unavailable in this browser. Try enabling Experimental Web Platform features.";
connectButton.disabled = !supported;

function setControls() {
  const connected = connectionState === "connected";
  connectButton.disabled = !supported || connectionState !== "disconnected";
  serverSelect.disabled = connectionState !== "disconnected";
  sendButton.disabled = !connected || !transport?.datagrams?.writable;
  refreshButton.disabled = !connected || statsInFlight;
  disconnectButton.disabled = !connected;
}

function finishConnection(connection, message) {
  if (transport !== connection) {
    return;
  }
  clearTimeout(sendRefreshTimer);
  sendRefreshTimer = null;
  transport = null;
  connectionState = "disconnected";
  statsInFlight = false;
  status.textContent = message;
  setControls();
}

async function refreshStats(connection) {
  if (transport !== connection || statsInFlight) {
    return;
  }
  statsInFlight = true;
  setControls();
  try {
    const stats = await connection.getStats();
    if (transport === connection) {
      showStats(stats);
      updated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
      if (status.textContent.startsWith("Could not read statistics:")) {
        status.textContent = `Connected to ${serverSelect.selectedOptions[0].text}.`;
      }
    }
  } catch (error) {
    if (transport === connection) {
      status.textContent = `Could not read statistics: ${error}`;
    }
  } finally {
    if (transport === connection) {
      statsInFlight = false;
      setControls();
    }
  }
}

function refreshAfterSend(connection) {
  clearTimeout(sendRefreshTimer);
  sendRefreshTimer = setTimeout(() => {
    sendRefreshTimer = null;
    if (transport !== connection || connectionState !== "connected") {
      return;
    }
    if (statsInFlight) {
      refreshAfterSend(connection);
    } else {
      void refreshStats(connection);
    }
  }, 1000);
}

async function readDatagrams(connection) {
  const readable = connection.datagrams?.readable;
  if (!readable) {
    return;
  }
  let reader;
  try {
    reader = readable.getReader();
    while (true) {
      const { done } = await reader.read();
      if (done) {
        break;
      }
      if (transport === connection) {
        received.value = String(Number(received.value) + 1);
      }
    }
  } catch (error) {
    if (transport === connection) {
      status.textContent = `Could not read echoed datagrams: ${error}`;
    }
  } finally {
    reader?.releaseLock();
  }
}

async function connect() {
  if (!supported || connectionState !== "disconnected") {
    return;
  }
  connectionState = "connecting";
  status.textContent = "Connecting...";
  statsOutput.textContent = "Waiting for connection...";
  updateRows(connectionRows, undefined);
  updateRows(datagramRows, undefined);
  updated.textContent = "No statistics yet.";
  received.value = "0";

  let connection;
  try {
    connection = new WebTransport(serverSelect.value);
  } catch (error) {
    connectionState = "disconnected";
    status.textContent = `Could not create connection: ${error}`;
    setControls();
    return;
  }
  transport = connection;
  setControls();
  connection.closed.then(
    () => finishConnection(connection, "Connection closed."),
    (error) => finishConnection(connection, `Connection closed with an error: ${error}`),
  );

  try {
    await connection.ready;
  } catch (error) {
    finishConnection(connection, `Connection failed: ${error}`);
    return;
  }
  if (transport !== connection) {
    return;
  }
  connectionState = "connected";
  status.textContent = `Connected to ${serverSelect.selectedOptions[0].text}.`;
  setControls();
  void readDatagrams(connection);
  await refreshStats(connection);
}

async function sendDatagram() {
  const connection = transport;
  if (connectionState !== "connected" || !connection?.datagrams?.writable) {
    return;
  }
  sendButton.disabled = true;
  let writer;
  try {
    writer = connection.datagrams.writable.getWriter();
    await writer.write(new TextEncoder().encode("WebTransport getStats demo"));
    if (transport === connection && connectionState === "connected") {
      refreshAfterSend(connection);
    }
  } catch (error) {
    if (transport === connection) {
      status.textContent = `Could not send datagram: ${error}`;
    }
  } finally {
    writer?.releaseLock();
    if (transport === connection) {
      setControls();
    }
  }
}

function requestStats() {
  if (transport) {
    void refreshStats(transport);
  }
}

function disconnect() {
  if (connectionState !== "connected" || !transport) {
    return;
  }
  connectionState = "closing";
  status.textContent = "Disconnecting...";
  setControls();
  try {
    transport.close();
  } catch (error) {
    connectionState = "connected";
    status.textContent = `Could not disconnect: ${error}`;
    setControls();
  }
}

connectButton.addEventListener("click", connect);
sendButton.addEventListener("click", sendDatagram);
refreshButton.addEventListener("click", requestStats);
disconnectButton.addEventListener("click", disconnect);
