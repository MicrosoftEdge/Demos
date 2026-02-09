const notes = document.querySelector('#notes');
const form = document.querySelector("form");
const item = document.querySelector("input[type='text']");
const price = document.querySelector("input[type='number']");
const priceList = document.querySelector("ul");
const totalOutput = document.querySelector("#total");
const budgetText = document.querySelector("#budget")


let budget = 20;
let total = 0;

function updateTotal() {
  totalOutput.textContent = `Total: £${Number(total).toFixed(2)}`;
}
function addItemToList(item, price) {
  // if it gets here, it meets budget limit
  const listItem = document.createElement("li");
  listItem.setAttribute("data-item", item);
  listItem.setAttribute("data-price", price);
  listItem.textContent = `${item}: £${Number(price).toFixed(2)}`;
  const btn = document.createElement("button");
  btn.textContent = `Remove ${item}`;

  priceList.appendChild(listItem);
  listItem.appendChild(btn);

  btn.addEventListener("click", (e) => {
    const listItem = e.target.parentNode;
    total -= Number(listItem.getAttribute("data-price"));
    updateTotal();
    document.ariaNotify(
      `${listItem.getAttribute(
        "data-item",
      )} removed. Total is now £${total.toFixed(2)}.`,
      {
        priority: "normal",
      },
    );
    console.log("Announcement: Item removed and updated total amount")
    listItem.remove();
  });
}
form.addEventListener("submit", (e) => {
  event.preventDefault();
  if (parseInt(price.value, 10) + total <= 20) {
    addItemToList(item.value, price.value);
    total += Number(price.value);
    updateTotal();
    document.ariaNotify(
      `Item ${item.value}, price £${
        price.value
      }, added to list. Total is now £${total.toFixed(2)}.`,
      {
        priority: "normal",
      },
    );
    console.log("Announcement: Item added and total updated")
    budgetText.style.color = '#000000'
    price.style.border = "1px solid #ccc";
    price.style.backgroundColor = "#fff";
    item.value = "";
    price.value = "";
  } else {
    budgetText.style.color = '#fc3535'
    price.style.border = "2px solid red";
    price.style.backgroundColor = "#ffe5e5";
    document.ariaNotify(
      `Submission failed. Item ${item.value}, price £${
        price.value
      }, goes over budget £${total.toFixed(2)}.`,
      {
        priority: "normal",
      },
    );
    console.log("Announcement: Item addition failed")
  }
});

// This event fires whenever the cursor moves or text is highlighted

notes.addEventListener('keydown', (e) => {
    // Check for Ctrl+B or Cmd+B
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        
        // We use a timeout to let the browser finish applying the bold style
        setTimeout(() => {
            let isBold = document.queryCommandState('bold');

            if (isBold) {
                document.ariaNotify(`bold on`, {
                    priority: "normal",
                });
                console.log("Announcement: Bold state true");
            } else {
                document.ariaNotify(`bold off`, {
                    priority: "normal",
                });
                console.log("Announcement: Bold state false");
            }
        }, 10); 
    }
});

