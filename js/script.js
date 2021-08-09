const clear = document.querySelector('.clear');
const date = document.querySelector('#date');
const list = document.querySelector('#list');
const input = document.querySelector('#input');
const plus = document.querySelector('.addItem img');

const CHECK = 'done';
const UNCHECK = 'co';
const binAttr = './img/bin.png';
const checkedAttr = './img/done.png';
const uncheckedAttr = './img/task.png';
const crossed = 'lineThrough';

let arrList;
let id;

function addTask(task, id, done, bin) {
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

const today = new Date();
const options = { weekday: 'long', month: 'short', day: 'numeric' };
date.innerHTML = today.toLocaleDateString('en-GB', options);

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
