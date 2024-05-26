var siteName = document.getElementById("siteName");
var siteAddress = document.getElementById("siteAddress");
var search = document.getElementById("search");
var addToListBtn = document.getElementById("addToList");
var tableBody = document.querySelector(".tableBody");
var modalBtn = document.querySelector(".click");
var pattern = new RegExp("^(https?:\\/\\/)?" +
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
    "((\\d{1,3}\\.){3}\\d{1,3}))" +
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
    "(\\?[;&a-z\\d%_.~+=-]*)?" +
    "(\\#[-a-z\\d_]*)?$", "i");
var listItems = [];
(function loadSaved() {
    document.addEventListener("DOMContentLoaded", function () {
        var storedItems = localStorage.getItem("listItems");
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
    var newTemp;
    var switchBox = document.getElementById("switchBox");
    addToListBtn.addEventListener("click", function () {
        newTemp = { name: siteName.value, address: siteAddress.value };
        if (!pattern.test(newTemp.address) || newTemp.name.length < 3) {
            modalBtn.click();
        }
        else {
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
    function validateInputsClasses(inpEle, validate) {
        var isValid = validate(inpEle.value);
        inpEle.classList.toggle("is-valid", isValid);
        inpEle.classList.toggle("is-invalid", !isValid);
    }
    var validateSiteName = function (value) { return value.length >= 3; };
    siteName.addEventListener("input", function () {
        return validateInputsClasses(siteName, validateSiteName);
    });
    var validateSiteAddress = function (value) { return pattern.test(value); };
    siteAddress.addEventListener("input", function () {
        return validateInputsClasses(siteAddress, validateSiteAddress);
    });
})();
search.addEventListener("input", function () {
    var query = search.value.toLowerCase();
    var filteredItems = listItems.filter(function (item) {
        return item.name.toLowerCase().includes(query) ||
            item.address.toLowerCase().includes(query);
    });
    updateList(filteredItems);
});
function updateList(items) {
    tableBody.innerHTML = "";
    for (var i = 0; i < items.length; i++) {
        tableBody.innerHTML += "<tr class=\"fading\">\n        <td>".concat(i + 1, "</td>\n        <td>").concat(items[i].name, "</td>\n        <td>").concat(items[i].address, "</td>\n        <td>\n        <button class=\"btn edit\" id=\"edit\"><i class=\"fa-regular fa-pen-to-square\"></i></button>\n        <button class=\"btn delete\" id=\"del\"><i class=\"fa-solid fa-trash-can\"></i></button>\n        </td>\n      </tr>");
    }
    deleteItem();
    editItem();
}
function deleteItem() {
    var delBtns = document.querySelectorAll(".btn.delete");
    var _loop_1 = function (i) {
        delBtns[i].addEventListener("click", function () {
            listItems.splice(i, 1);
            updateList(listItems);
            saveToLocalStorage();
        });
    };
    for (var i = 0; i < delBtns.length; i++) {
        _loop_1(i);
    }
}
function editItem() {
    var editBtns = document.querySelectorAll(".btn.edit");
    var _loop_2 = function (i) {
        editBtns[i].addEventListener("click", function () {
            var temp = listItems[i];
            siteName.value = temp.name;
            siteAddress.value = temp.address;
            listItems.splice(i, 1);
            updateList(listItems);
            saveToLocalStorage();
        });
    };
    for (var i = 0; i < editBtns.length; i++) {
        _loop_2(i);
    }
}
// Animation
