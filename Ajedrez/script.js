function allowDrop(ev) {
  ev.preventDefault();
}
  
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}
  
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

var x = document.getElementById("prueba");
if (x.children.length > 0) {
  console.log("El elemento tiene hijos.")
} else {
  console.log("El elemento no tiene hijos.")
}