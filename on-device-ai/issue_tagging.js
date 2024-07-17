import { Init, Query, Abort } from "./model.js";

const descriptionEl = document.getElementById("description");
const form = document.getElementById("form");
const button = document.getElementById("submit-button");
const tags = document.getElementById("tags");
let isCheckingComment = false;

const PROMPT = `Classify the comments below as one of the following categories:
1. Bug
2. Feature Request
3. Documentation
4. Other

<|COMMENT|>
I am using a local app
Repro steps

1. Open devtools
2. Select a component
3. Click open in editor

Result "The path '/data:application/json;base64,asdgasdg/HeaderLogo.tsx:41' does not exist on this computer."

How often does this bug happen?
Every time 
<|END|>

<|CATEGORY|>
Bug
<|END|>

<|COMMENT|>
I wanted to use ref from props while also creating a local ref as a fallback, but I got into this problem #17200.
I know this could be resolved with a little code, though I think this behavior should belong natively to React. There is even a package for that https://www.npmjs.com/package/react-merge-refs with ~1 million downloads/week, which confirms necessity of this for the React users.

I would propose something like

function Component(props: { ref?: Ref<HTMLDivElement> }) {
  const fallbackRef = useRef<HTMLDivElement>(null)
  return <div ref={[props.ref, fallbackRef]} />
}
<|END|>

<|CATEGORY|>
Feature Request
<|END|>

<|COMMENT|>
[COMMENT]
<|END|>

<|CATEGORY|>

`;

function showAsLoading() {
  button.textContent = "Checking your comment ...";
  button.classList.add("loading");
  button.disabled = true;
}

function showAsNormal() {
  button.textContent = "Submit new issue";
  button.classList.remove("loading");
  button.disabled = false;
}

async function startApp() {
  await Init();

  form.onsubmit = (e) => {
    if (isCheckingComment) {
      return;
    }

    showAsLoading();
    isCheckingComment = true;

    e.preventDefault();
    const prompt = PROMPT.replace("[COMMENT]", descriptionEl.value);
    let data = "";
    Query(prompt, (word) => {
      data = word;
      console.log(word);
      if (word.includes("<|END|>")) {
        Abort();
      }
    }).then(() => {
      // Extract the text between <|CATEGORY|> and <|END|>.
      const category = data.match(/<\|CATEGORY\|>([\s\S]*?)<\|END\|>/)[1];
      tags.innerHTML = `<li>${category.trim()}</li>`;
      showAsNormal();
      isCheckingComment = false;
    });
  };
}

window.onload = () => {
  startApp();
};
