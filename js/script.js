const clear = document.querySelector('.clear');
const date = document.querySelector('#date');
const list = document.querySelector('#list');
const input = document.querySelector('#input');

const CHECK = 'done';
const UNCHECK = 'co';
const binAttr = '../img/bin.png';
const checkedAttr = '../img/done.png';
const uncheckedAttr = '../img/task.png';
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
