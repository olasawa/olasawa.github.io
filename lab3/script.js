function randomColor(){
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
}

function drawRect(){
    var c = document.getElementById("rect-area");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.rect(20, 20, 150, 100);
    ctx.fillRect(20, 20, 150, 100);
    ctx.stroke();
}

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
 