console.clear();

let rowCount = 0;
function singleRow(name) {
    let html = function (identifier) {
        let id = `${identifier}-${rowCount}`;
        return `<div class="form-group row" id="wrapper-${id}">
            <label for="${id}" class="col-sm col-form-label">${identifier}</label>
            <div class="col-sm-6">
              <input type="text" class="form-control float-left" id="${id}" placeholder="0" style="width:60%">
              <button class="btn btn-danger btn-sm float-left ml-1" id="delete-${id}" style="height:100% !important" onclick="deleteField(this)"><i class="fal fa-minus"></i></button>
            </div>
</div>`;
    };

    if (Array.isArray(name)) {
        let build = [];
        name.forEach(function (n) {
            build.push(html(n));
        });
        rowCount++;
        return build.join("");
    }

    rowCount++;
    return html(name);
}

let cardCount = 0;
function singleCard(inner) {
    cardCount++;
    return `<div class="col-md-4" style="min-height:300px">
        <div card="${cardCount}" class="border p-2 m-2">
        ${inner}
        </div>
      </div>`;
}

populateField();
function populateField() {
    let wrapper = document.getElementById("card-wrapper");
    for (let i = 0; i < 7; i++) {
        wrapper.innerHTML += singleCard(
            singleRow(["item name", "attack", "def", "protect", "pierce", "crush", "resistance", "block", "crit"])
        );
    }
}

/**
 * @type {Array}
 */
let listDeleted = formSaver2Storage.get("listWrapper", []);

/**
 *
 * @param {HTMLButtonElement} el
 */
function deleteField(el) {
    listDeleted.push(el.parentElement.parentElement.id);
    el.parentElement.parentElement.remove();
    formSaver2Storage.set("listWrapper", listDeleted);
}

function reset() {
    formSaver2Storage.set("listWrapper", []);
    listDeleted = [];
    populateField();
}

setTimeout(() => {
    formsaver(false);

    listDeleted.map((id) => {
        document.getElementById(id).remove();
    });
}, 500);
