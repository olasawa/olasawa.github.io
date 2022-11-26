window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;


window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

const list = document.getElementById('list');
const id = document.getElementById('add_id');
const name = document.getElementById('add_name');
const lastname = document.getElementById('add_lastname');
const id_num = document.getElementById('add_id_num');
const postcode = document.getElementById('add_post_code');
const email = document.getElementById('add_email');
const phone = document.getElementById('add_phone');

const clientsList = [{id:"1", name:"Jan", lastname:"Kowalski",}];


let db;
var request = window.indexedDB.open("clientList", 10);
request.onerror = function (event) {
  console.log("error: The database is opened failed");
};

request.onsuccess = function (event) {
  db = request.result;
  console.log("success: The database " + db + " is opened successfully");
  createList();
};

request.onupgradeneeded = function (event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("clientList", {
    keyPath: "id"
  });

  for (var i in clientsList) {
    objectStore.add(clientsList[i]);
  }

}

function createListItem(contents) {
  const listItem = document.createElement('li');
  listItem.setAttribute('class', 'listelem');
  listItem.setAttribute('draggable', 'true');
  listItem.textContent = contents;
  return listItem;
};

function createList(){
  while (list.firstChild) {
    list.removeChild(list.lastChild);
  }

  let objectStore = db.transaction("clientList").objectStore("clientList");

  objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;
    if(cursor){
      const id = cursor.value.id;
      const name = cursor.value.name;
      const lastname = cursor.value.lastname;
      const elemText = `${id} — ${name}, ${lastname}`;
      const listItem = createListItem(elemText);
      listItem.style.color = 'rgba(0, 0, 0, 1)';
      list.appendChild(listItem);
      cursor.continue();
    }
  };
}

function addClient(){
  var clientID = document.getElementById('add_id').value ;
  var name = document.getElementById('add_name').value ;
  var lastname = document.getElementById('add_lastname').value;
  var request = db.transaction(["clientList"], "readwrite")
      .objectStore("clientList")
      .add({
          id: clientID,
          name: name,
          lastname: lastname
      });

  request.onsuccess = function (event) {
      createList();
      document.getElementById('add_id').value="";
      document.getElementById('add_name').value="";
      document.getElementById('add_lastname').value="";
  };

  request.onerror = function (event) {
      alert("Id must be unique!");
  }
}

function removeClient(){
  var clientID = document.getElementById('delete_id').value;
  var request = db.transaction(["clientList"], "readwrite")
  .objectStore("clientList")
  .delete(clientID);

  request.onsuccess = function (event) {
    createList();
    document.getElementById('delete_id').value="";
  };

  request.onerror = function (event) {
    alert("Id must exist in list!");
}
}












// ----------------------------------------------
let items = document.querySelectorAll('.list .listelem')

items.forEach(item => {

item.addEventListener('dragstart', handleDragStart)
item.addEventListener('dragend', handleDragEnd)
item.addEventListener('dragover', handleDragOver);
item.addEventListener('dragenter', handleDragEnter);
item.addEventListener('dragleave', handleDragLeave);
item.addEventListener('drop', handleDrop);
})

function handleDragStart(e) {
  this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
  this.style.opacity = '1';

  items.forEach(function (item) {
    item.classList.remove('over');
  });
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
  }

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    e.stopPropagation();
    if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
}