window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;


window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

//-------------------------------------------------------------------- random database data
const ids = ["6","2","3","4","5"]; //replace with rand?
const names = ["Ania", "Frania", "Jan", "Pawel", "Jakub"];
const lastnames = ["Kot", "Nowak", "Ryba", "Gan", "Kowalski"];
const id_nums = ["AAA111111", "BBB222222", "CCC333333", "DDD444444", "EEE555555"];
const postcodes = ["11-222", "22-333", "33-444", "44-555", "55-666"];
const emails = ["a@gmail.com", "b@gmail.com", "c@gmail.com", "d@gmail.com", "e@gmail.com"];
const phones = ["600-111-222", "600-222-333", "600-333-444", "600-444-555", "600-555-666"];
//---------------------------------------------------------------------------------------

const list = document.getElementById('list');
const id = document.getElementById('add_id');
const name = document.getElementById('add_name');
const lastname = document.getElementById('add_lastname');
const id_num = document.getElementById('add_id_num');
const postcode = document.getElementById('add_post_code');
const email = document.getElementById('add_email');
const phone = document.getElementById('add_phone');

const clientsList = [{id:"1", name:"Jan", lastname:"Kowalski", id_num:"ABC101010", postcode:"66-400", email:"jan@gmail.com", phone:"666-111-444"}];


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
      const id_num = cursor.value.id_num;
      const postcode = cursor.value.postcode;
      const email = cursor.value.email;
      const phone = cursor.value.phone;
      const elemText = `${id} ??? ${name}, ${lastname}, ${id_num}, ${postcode}, ${email}, ${phone}`;
      const listItem = createListItem(elemText);
      listItem.style.color = 'rgba(0, 0, 0, 1)';
      list.appendChild(listItem);
      cursor.continue();
    }
  };
}

function generateClient(){
  const random = Math.floor(Math.random() * ids.length);
  var clientID = ids[random]; //replace with random
  var name = names[random];
  var lastname = lastnames[random];
  var id_num = id_nums[random];
  var postcode = postcodes[random];
  var email = emails[random];
  var phone = phones[random];

  document.getElementById('add_id').value = clientID;
  document.getElementById('add_name').value = name;
  document.getElementById('add_lastname').value=lastname;
  document.getElementById('add_id_num').value=id_num;
  document.getElementById('add_post_code').value=postcode;
  document.getElementById('add_email').value=email;
  document.getElementById('add_phone').value=phone;

}


function addClient(){
  var clientID = document.getElementById('add_id').value ;
  var name = document.getElementById('add_name').value ;
  var lastname = document.getElementById('add_lastname').value;
  var id_num = document.getElementById('add_id_num').value;
  var postcode = document.getElementById('add_post_code').value;
  var email = document.getElementById('add_email').value;
  var phone = document.getElementById('add_phone').value;
  var request = db.transaction(["clientList"], "readwrite")
      .objectStore("clientList")
      .add({
          id: clientID,
          name: name,
          lastname: lastname,
          id_num: id_num,
          postcode: postcode,
          email: email,
          phone: phone
      });

  request.onsuccess = function (event) {
      createList();
      document.getElementById('add_id').value="";
      document.getElementById('add_name').value="";
      document.getElementById('add_lastname').value="";
      document.getElementById('add_id_num').value="";
      document.getElementById('add_post_code').value="";
      document.getElementById('add_email').value="";
      document.getElementById('add_phone').value="";
  };

  request.onerror = function (event) {
      alert("Id must be unique!");
  }
}
// var editedClientID = 0;
function editClient(){
  var clientID = document.getElementById('edit_id').value;

  var objectStore = db.transaction(["clientList"], "readwrite").objectStore("clientList").get(clientID);
  // var objectStoreRequest = objectStore.get(clientID);
  
  objectStore.onsuccess = function(e) {

    const myRecord = objectStore.result;
    document.getElementById('add_id').value=myRecord.id;
    document.getElementById('add_name').value=myRecord.name;
    document.getElementById('add_lastname').value=myRecord.lastname;
    document.getElementById('add_id_num').value=myRecord.id_num;
    document.getElementById('add_post_code').value=myRecord.postcode;
    document.getElementById('add_email').value=myRecord.email;
    document.getElementById('add_phone').value=myRecord.phone;

  };
}

function saveClient(){
  var clientID = document.getElementById('edit_id').value;
  var request = db.transaction(["clientList"], "readwrite")
  .objectStore("clientList")
  .delete(clientID);

  request.onsuccess = function (event) {
    document.getElementById('edit_id').value="";
  };

  request.onerror = function (event) {
    alert("Id must exist in list!");
  }
  document.getElementById('add_id').value = clientID;
  addClient();
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