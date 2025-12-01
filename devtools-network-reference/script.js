const xhrButton = document.getElementById("xhr");
const iframesButton = document.getElementById("iframes");
const iframesPlaceholderEl = document.getElementById("iframes-placeholder");
const streamSseButton = document.getElementById("stream-sse");
const formDataButton = document.getElementById("form-data");
const encodedQueryParamsButton = document.getElementById("encoded-query-params");

xhrButton.addEventListener("click", () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "./data.json");
  xhr.onload = () => {
    if (xhr.status === 200) {
      console.log("XHR Response:", JSON.parse(xhr.responseText));
    } else {
      console.error("XHR Error:", xhr.statusText);
    }
  };
  xhr.onerror = () => {
    console.error("XHR Request failed");
  };
  xhr.send();
});

iframesButton.addEventListener("click", () => {
  [
    "../detached-elements/",
    "../demo-to-do/",
    "../edit-context/"
  ].forEach(url => {
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframesPlaceholderEl.appendChild(iframe);
  });
});

streamSseButton.addEventListener("click", () => {
  const eventSource = new EventSource('https://network-tool-sse-demo.netlify.app/sse');

  eventSource.addEventListener('message', event => {
    console.log(event.data);
  }, false);
});

formDataButton.addEventListener("click", async () => {
  const formData = new FormData();
  formData.append("username", "Danas Barkus");
  formData.append("timestamp", new Date().toISOString());
  formData.append("file", new Blob(["Hello World"], { type: "text/plain" }), "hello.txt");
  
  await fetch("./form-data-endpoint?hasfile=true", {
    method: "POST",
    body: formData
  });
});


encodedQueryParamsButton.addEventListener("click", async () => {
  const params = new URLSearchParams();
  params.append("name", "Danas Barkus");
  params.append("url", "https://contoso.com/àéèôçл");

  await fetch(`./encoded-query-params-endpoint?${params.toString()}`, {
    method: "GET"
  });
});
