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

const clientsList = [{id:"1", name:"Jan", lastname:"Kowalski", id_num:"ABC101010", postcode:"66-400", email:"jan@gmail.com", phone:"666-111-444"}];


let db;
var request = window.indexedDB.open("clientList", 1);
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


function createList(){
  var clients = "";
  $('.clientList').remove();

  var objectStore = db.transaction("clientList").objectStore("clientList");

  objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;
    if(cursor){
      clients = clients.concat(
        '<tr class="clientList">' +
        '<td class="ID">' + cursor.key + '</td>' +
        '<td class="Imie">' + cursor.value.name + '</td>' +
        '<td class="Nazwisko">' + cursor.value.lastname + '</td>' +
        '<td class="NrDow">' + cursor.value.id_num + '</td>' +
        '<td class="KodPocztowy">' + cursor.value.postcode + '</td>' +
        '<td class="Email">' + cursor.value.email + '</td>' +
        '<td class="Phone">' + cursor.value.phone + '</td>' +
        '<td><button style="background-color:red;" onClick="deleteClient(\'' + cursor.key + '\')">Remove</button>' +
        '<td><button style="background-color:blue;" onClick="editClient(\'' + cursor.key + '\')">Edit</button>' +
        '</tr>');
        cursor.continue();
        
        } 
        else {
          $('thead').after(clients);
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


function addClient() {
  var clientID = document.getElementById('add_id').value ;
  var name = document.getElementById('add_name').value ;
  var lastname = document.getElementById('add_lastname').value;
  var id_num = document.getElementById('add_id_num').value;
  var postcode = document.getElementById('add_post_code').value;
  var email = document.getElementById('add_email').value;
  var phone = document.getElementById('add_phone').value;
  if(clientID=="" || name == "" || lastname == "" || id_num == "" || postcode == "" || email == "" ||phone ==""){
    alert("Fill with input!");
    return;
  }
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
var editedClientId;
function editClient(x){
  editedClientId = x;
  document.getElementById('buttonSave').disabled = false;
  var objectStore = db.transaction(["clientList"], "readwrite").objectStore("clientList").get(editedClientId);
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
  var clientID = editedClientId;
  var request = db.transaction(["clientList"], "readwrite")
  .objectStore("clientList")
  .delete(clientID);

  request.onsuccess = function (event) {
    alert("Edited.");
  };

  request.onerror = function (event) {
    alert("Id must exist in list!");
  }
  document.getElementById('add_id').value = clientID;
  addClient();
  document.getElementById('buttonSave').disabled = true;
}

function deleteClient(x) {
  var clientID = x;
  var request = db.transaction(["clientList"], "readwrite")
      .objectStore("clientList")
      .delete(clientID);

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
}

function searchtable() {
  var clients = "";
  $('.clientList').remove();

  var objectStore = db.transaction("clientList").objectStore("clientList");

  objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;
    if(cursor){
      if((cursor.value.id.toString() +
          cursor.value.name.toLowerCase() +
          cursor.value.lastname.toLowerCase() +
          cursor.value.id_num.toLowerCase() + 
          cursor.value.postcode.toString() +
          cursor.value.email.toLowerCase() +
          cursor.value.phone.toString()).includes($('#search').val().toLowerCase().replace(/ /g,''))){
            clients = clients.concat(
              '<tr class="clientList">' +
              '<td class="ID">' + cursor.key + '</td>' +
              '<td class="Imie">' + cursor.value.name + '</td>' +
              '<td class="Nazwisko">' + cursor.value.lastname + '</td>' +
              '<td class="NrDow">' + cursor.value.id_num + '</td>' +
              '<td class="KodPocztowy">' + cursor.value.post_code + '</td>' +
              '<td class="Email">' + cursor.value.email + '</td>' +
              '<td class="Phone">' + cursor.value.phone + '</td>' +
              '<td><button style="background-color:red;" onClick="deleteClient(\'' + cursor.key + '\')">Remove</button>' +
              '<td><button style="background-color:blue;" onClick="editClient(\'' + cursor.key + '\')">Edit</button>' +
              '</tr>');
          }
          cursor.continue();  
        }
       else{
          $('thead').after(clients);
           } 
                   
    };
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