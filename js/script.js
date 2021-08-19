const clear = document.querySelector('#clear');
const date = document.querySelector('#date');
const list = document.querySelector('#list');
const input = document.querySelector('#input');
const plus = document.querySelector('.addItem img');

// const CHECK = 'done';
// const UNCHECK = 'co';
const binAttr = './img/bin.png';
// const checkedAttr = './img/done.png';
// const uncheckedAttr = './img/task.png';
// const crossed = 'lineThrough';

let listDB;

window.addEventListener('load', function () {
    let request = window.indexedDB.open('list_db', 2);

    request.addEventListener('error', () => {
        console.error('Database is failed to open');
    });

    request.addEventListener('success', () => {
        console.log('Database is opened successfully');
        listDB = request.result;
        displayData();
    });

    request.addEventListener('upgradeneeded', function (e) {
        let dbRequest = e.target.result;
        let objectStore = dbRequest.createObjectStore('list_os', {
            keyPath: 'id',
            autoIncrement: true,
        });

        objectStore.createIndex('input', 'input', { unique: false });

        console.log('Database setup is complete');
    });

    plus.addEventListener('click', addData);

    function displayData() {
        console.log('displayData function will be here');

        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }

        let displayObjectStore = listDB.transaction('list_os').objectStore('list_os');
        displayObjectStore.openCursor().addEventListener('success', function (e) {
            let cursor = e.target.result;
            // console.log(cursor);

            if (cursor) {
                const listItem = document.createElement('li');
                listItem.classList.add('item');
                listItem.setAttribute('data-note-id', cursor.value.id);
                list.appendChild(listItem);
                const itemText = document.createElement('p');
                itemText.classList.add('text');
                itemText.textContent = cursor.value.input;
                const bin = document.createElement('img');
                bin.classList.add('de');
                bin.setAttribute('src', binAttr);
                listItem.appendChild(itemText);
                listItem.appendChild(bin);
                bin.addEventListener('click', deleteItem);
                cursor.continue();
            } else {
                if (!list.firstChild) {
                    const listItem = document.createElement('li');
                    listItem.classList.add('item');
                    listItem.textContent = 'No notes stored.';
                    list.appendChild(listItem);
                }
                console.log('Notes are displayed');
            }
        });
    }

    function addData(e) {
        e.preventDefault();
        console.log('addData function will be here');

        let newItem = { input: input.value };
        let transaction = listDB.transaction(['list_os'], 'readwrite');
        let addDataObjStore = transaction.objectStore('list_os');
        // console.log(addDataObjStore);
        let request = addDataObjStore.add(newItem);

        request.addEventListener('success', () => {
            input.value = '';
        });

        transaction.addEventListener('complete', () => {
            console.log('Transaction completed');
            displayData();
        });

        transaction.addEventListener('error', () => {
            console.error('Transaction cannot be opened due to error');
        });
    }

    function deleteItem(e) {
        let noteId = Number(e.target.parentNode.getAttribute('data-note-id'));
        let transaction = listDB.transaction(['list_os'], 'readwrite');
        let delItemObjectStore = transaction.objectStore('list_os');
        let request = delItemObjectStore.delete(noteId);

        transaction.addEventListener('complete', function () {
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
            console.log(`Note ${noteId} has been deleted`);

            if (!list.firstChild) {
                let listItem = document.createElement('li');
                listItem.textContent = 'No notes are stored!';
                list.appendChild(listItem);
            }
        });
    }

    function getObjectStore(store_name, mode) {
        let tx = listDB.transaction(store_name, mode);
        return tx.objectStore(store_name);
    }

    function clearStore() {
        let store = getObjectStore('list_os', 'readwrite');
        // console.log(list.childNodes);
        let req = store.clear();
        list.remove(list.childNodes.childNodes);

        req.onsuccess = function () {
            console.log('Store cleared');
            if (!list.childNodes) {
                const listItem = document.createElement('li');
                listItem.textContent = 'No notes are stored!';
                list.appendChild(listItem);
            }
        };
        req.onerror = function (e) {
            console.error('clearObjectStore:', e.target.errorCode);
        };
    }

    clear.addEventListener('click', clearStore);
});

const today = new Date();
const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
date.innerHTML = today.toLocaleDateString('en-GB', options);
// ====================================================================
// let arrList;
// let id;

/*function addTask(task, id, done, bin) {
    if (bin) {
        return;
    }
    const DONE = done ? CHECK : UNCHECK;
    const ATTRSRC = done ? checkedAttr : uncheckedAttr;
    const LINE = done ? crossed : '';
    const text = `<li class="item">
                    <img class="${DONE}" src="${ATTRSRC}" 
                    alt="" job="complete" id="${id}" />
                    <p class="text ${LINE}">${task}</p>
                    <img class="de" src="${binAttr}" alt="bin"
                    job="delete" id="${id}" />
                </li>`;
    const position = 'beforeend';
    list.insertAdjacentHTML(position, text);
}

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        const inputValue = input.value;
        if (inputValue) {
            addTask(inputValue, id, false, false);
            arrList.push({
                name: inputValue,
                id: id,
                done: false,
                bin: false,
            });
            // localStorage.setItem('TODO', JSON.stringify(arrList));
            id++;
        }
        input.value = '';
    }
});

plus.addEventListener('click', function (e) {
    const inputValue = input.value;
    if (inputValue) {
        addTask(inputValue, id, false, false);
        arrList.push({
            name: inputValue,
            id: id,
            done: false,
            bin: false,
        });
        // localStorage.setItem('TODO', JSON.stringify(arrList));
        id++;
    }
    input.value = '';
});

function completeTask(el) {
    el.classList.toggle(CHECK);
    el.classList.toggle(UNCHECK);
    if (el.className === CHECK) {
        el.setAttribute('src', checkedAttr);
    }
    if (el.className === UNCHECK) {
        el.setAttribute('src', uncheckedAttr);
    }
    el.parentNode.querySelector('.text').classList.toggle(crossed);
    arrList[el.id].done = arrList[el.id].done ? false : true;
}

function removeTask(el) {
    el.parentNode.parentNode.removeChild(el.parentNode);
    arrList[el.id].bin = true;
}

list.addEventListener('click', function (e) {
    let element = e.target;
    let elementJob = e.target.attributes.job.value;
    if (elementJob === 'complete') {
        completeTask(element);
    } else if (elementJob === 'delete') {
        removeTask(element);
    }
    // localStorage.setItem('TODO', JSON.stringify(arrList));
});
*/

// let data = localStorage.getItem('TODO');

/*if (data) {
    arrList = JSON.parse(data);
    id = arrList.length;
    loadList(arrList);
} else {
    arrList = [];
    id = 0;
}

function loadList(arr) {
    arr.forEach((item) => {
        addTask(item.name, item.id, item.done, item.bin);
    });
}

clear.addEventListener('click', function () {
    localStorage.clear();
    location.reload();
});*/
