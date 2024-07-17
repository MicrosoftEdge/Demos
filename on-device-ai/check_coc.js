import { Init, Query, Abort } from "./model.js";

const CoC = `
Participation in the community must be a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, caste, color, religion, or sexual identity and orientation.

Interactions must happen in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.

Examples of unacceptable behavior include:

- The use of sexualized language or imagery, and sexual attention or advances of any kind
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Disruptive behavior
- Publishing others' private information, such as a physical or email address, without their explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting
`;

const PROMPT = `
<|CODE OF CONDUCT|>
${CoC}
<|END|>

<|COMMENT|>
{
  "comment": "Thank you for this project, very useful to me!",
  "isAcceptableBasedOnCodeOfConduct": true
}
<|END|>

<|COMMENT|>
{
  "comment": "I found a bug in the code, when I try to run the code in Edge, it doesn't work."
  "isAcceptableBasedOnCodeOfConduct": true
}
<|END|>

<|COMMENT|>
{
  "comment": "What is this pile of garbage code? It doesn't work at all!"
  "isAcceptableBasedOnCodeOfConduct": false,
  "reason": "The comment is disrespectful and derogatory."
}
<|END|>

<|COMMENT|>
{
  "comment": "[COMMENT]",
  "isAcceptableBasedOnCodeOfConduct": `;

const descriptionEl = document.getElementById("description");
const form = document.getElementById("form");
const button = document.getElementById("submit-button");
const message = document.getElementById("message");

let isCheckingComment = false;

function showAsLoading() {
  displayMessage();
  button.textContent = "Checking your comment ...";
  button.classList.add("loading");
  button.disabled = true;
}

function showAsNormal() {
  button.textContent = "Submit new issue";
  button.classList.remove("loading");
  button.disabled = false;
}

function displayMessage(str) {
  message.textContent = str;
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
      try {
        const result = JSON.parse(
          '{"isAcceptableBasedOnCodeOfConduct":' + data.substring(0, data.indexOf("<|END|>"))
        );
  
        if (!result.isAcceptableBasedOnCodeOfConduct) {
          displayMessage(result.reason + " Please review the Code of Conduct and modify your comment accordingly.");
        } else {
          displayMessage();
        }
      } catch (e) {
        displayMessage();
      }
      
      showAsNormal();
      isCheckingComment = false;
    });
  };
}

window.onload = () => {
  startApp();
};
