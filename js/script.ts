let siteName = document.getElementById("siteName") as HTMLInputElement;
let siteAddress = document.getElementById("siteAddress") as HTMLInputElement;
let search = document.getElementById("search") as HTMLInputElement;
let addToListBtn = document.getElementById("addToList") as HTMLButtonElement;
let tableBody = document.querySelector(".tableBody") as HTMLTableSectionElement;
let modalBtn = document.querySelector(".click") as HTMLButtonElement;

const pattern = new RegExp(
  "^(https?:\\/\\/)?" +
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
    "((\\d{1,3}\\.){3}\\d{1,3}))" +
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
    "(\\?[;&a-z\\d%_.~+=-]*)?" +
    "(\\#[-a-z\\d_]*)?$",
  "i"
);

let listItems: ListItem[] = [];

type ListItem = {
  name: string;
  address: string;
};

(function loadSaved() {
  document.addEventListener("DOMContentLoaded", () => {
    const storedItems = localStorage.getItem("listItems");
    if (storedItems) {
      listItems = JSON.parse(storedItems);
      updateList(listItems);
    }
  });
})();

function saveToLocalStorage() {
  localStorage.setItem("listItems", JSON.stringify(listItems));
}

(function addToList() {
  let newTemp: ListItem;
  let switchBox = document.getElementById("switchBox") as HTMLInputElement;
  addToListBtn.addEventListener("click", () => {
    newTemp = { name: siteName.value, address: siteAddress.value };
    if (!pattern.test(newTemp.address) || newTemp.name.length < 3) {
      modalBtn.click();
    } else {
      listItems.unshift(newTemp);
      updateList(listItems);
      saveToLocalStorage();
      if (!switchBox.checked) {
        siteName.value = "";
        siteAddress.value = "";
      }
    }
  });
})();

(function validationInputs() {
  function validateInputsClasses(
    inpEle: HTMLInputElement,
    validate: (value: string) => boolean
  ) {
    const isValid = validate(inpEle.value);
    inpEle.classList.toggle("is-valid", isValid);
    inpEle.classList.toggle("is-invalid", !isValid);
  }
  const validateSiteName = (value: string) => value.length >= 3;
  siteName.addEventListener("input", () =>
    validateInputsClasses(siteName, validateSiteName)
  );
  const validateSiteAddress = (value: string) => pattern.test(value);
  siteAddress.addEventListener("input", () =>
    validateInputsClasses(siteAddress, validateSiteAddress)
  );
})();

search.addEventListener("input", () => {
  const query = search.value.toLowerCase();
  const filteredItems = listItems.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query)
  );
  updateList(filteredItems);
});

function updateList(items: ListItem[]) {
  tableBody.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    tableBody.innerHTML += `<tr class="fading">
        <td>${i + 1}</td>
        <td>${items[i].name}</td>
        <td>${items[i].address}</td>
        <td>
        <button class="btn edit" id="edit"><i class="fa-regular fa-pen-to-square"></i></button>
        <button class="btn delete" id="del"><i class="fa-solid fa-trash-can"></i></button>
        </td>
      </tr>`;
  }
  deleteItem();
  editItem();
}

function deleteItem() {
  let delBtns = document.querySelectorAll(".btn.delete");
  for (let i = 0; i < delBtns.length; i++) {
    delBtns[i].addEventListener("click", () => {
      listItems.splice(i, 1);
      updateList(listItems);
      saveToLocalStorage();
    });
  }
}

function editItem() {
  let editBtns = document.querySelectorAll(".btn.edit");
  for (let i = 0; i < editBtns.length; i++) {
    editBtns[i].addEventListener("click", () => {
      let temp = listItems[i];
      siteName.value = temp.name;
      siteAddress.value = temp.address;
      listItems.splice(i, 1);
      updateList(listItems);
      saveToLocalStorage();
    });
  }
}

// Animation
