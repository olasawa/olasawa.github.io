window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;


window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange


const clientsList = [{id:"1", name:"Jan", lastname:"Kowalski", email:"abc@wp.pl", }];


let db;
var request = window.indexedDB.open("newDatabase", 10);
request.onerror = function (event) {
  console.log("error: The database is opened failed");
};

request.onsuccess = function (event) {
  db = request.result;
  console.log("success: The database " + db + " is opened successfully");
  // createList();
};

request.onupgradeneeded = function (event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("client", {
    keyPath: "id"
  });

  for (var i in clientsList) {
    objectStore.add(clientsList[i]);
  }

}

function createTable(){
  
}

function addClient(){
  var clientID = $('#add_id').val();
  var name = $('#add_name').val();
  var lastname = $('#add_lastname').val();
  var request = db.transaction(["client"], "readwrite")
      .objectStore("clientsList")
      .add({
          id: clientID,
          name: name,
          lastname: lastname,
      });


  request.onsuccess = function (event) {
      // createList();
      // clean labels
  };

  request.onerror = function (event) {
      alert("error");
  }
}














// ----------------------------------------------
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

let items = document.querySelectorAll('.list .listelem')

items.forEach(item => {

item.addEventListener('dragstart', handleDragStart)
item.addEventListener('dragend', handleDragEnd)
item.addEventListener('dragover', handleDragOver);
item.addEventListener('dragenter', handleDragEnter);
item.addEventListener('dragleave', handleDragLeave);
item.addEventListener('drop', handleDrop);
})
 