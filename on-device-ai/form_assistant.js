import { Init, Query, Abort } from "./model.js";

const PROMPT = `Extract personal contact information from text, and produce a structured JSON output.

Info: Mitsuko Kennedy, 1281 Merry Diversion, Ketchikan, Illinois, 62805 United States, 618-555-0189
Output: {"firstname":"Mituko","lastname":"Kennedy","address1":"1281 Merry Diversion","address2":"","city":"Ketchikan","state":"Illinois","zip":"62805","country":"United States","phone":"618-555-0189","email":"","bio":""}

Info: John Doe, 1234 Main St, Springfield, IL 62701, 217-555-1234, j.doe@outlook.com
Output: {"firstname":"John","lastname":"Doe","address1":"1234 Main St","address2":"","city":"Springfield","state":"IL","zip":"62701","country":"","phone":"217-555-1234","email":"j.doe@outlook.com","bio":""}

Info: [INFO]
Output: `;

const assistantForm = document.getElementById("assistant-form");
const assistant = document.getElementById("assistant");
const analyzeInfo = document.getElementById("analyze-info-button");

const form = document.getElementById("form");
const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
const address1 = document.getElementById("address1");
const address2 = document.getElementById("address2");
const city = document.getElementById("city");
const state = document.getElementById("state");
const zip = document.getElementById("zip");
const country = document.getElementById("country");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const bio = document.getElementById("bio");

let isAnalyzingForm = false;

function showAsLoading() {
  analyzeInfo.textContent = "Analyzing your data ...";
  analyzeInfo.classList.add("loading");
  analyzeInfo.disabled = true;
}

function showAsNormal() {
  analyzeInfo.textContent = "Fill the form for me";
  analyzeInfo.classList.remove("loading");
  analyzeInfo.disabled = false;
}

async function startApp() {
  await Init();

  form.onsubmit = (e) => {
    e.preventDefault();
  };

  assistantForm.onsubmit = (e) => {
    e.preventDefault();

    if (isAnalyzingForm) {
      return;
    }

    showAsLoading();
    isAnalyzingForm = true;

    const prompt = PROMPT.replace("[INFO]", assistant.value);
    let data = "";
    Query(prompt, (word) => {
      data = word;
      if (word.includes("}")) {
        Abort();
      }
    }).then(() => {
      const json = data.match(/\{.*\}/);
      if (json) {
        const obj = JSON.parse(json[0]);
        firstName.value = obj.firstname;
        lastName.value = obj.lastname;
        address1.value = obj.address1;
        address2.value = obj.address2;
        city.value = obj.city;
        state.value = obj.state;
        zip.value = obj.zip;
        country.value = obj.country;
        phone.value = obj.phone;
        email.value = obj.email;
        bio.value = obj.bio;
      }
      
      showAsNormal();
      isAnalyzingForm = false;
    });
  };
}

window.onload = () => {
  startApp();
};
