
function cargar() {
    let lista = document.getElementById('listaArt').value;
    console.log(lista)
} 

window.addEventListener('load', function() {
console.log(articulos[1].DESCRIPCION);
for (i = 0 ; i < articulos.length ; i++) {
const newOption = document.createElement("option");
const lista = document.getElementById('medicacion');
const atribId = document.createAttribute("id");
atribId.value = "option" + i;
const atribValue = document.createAttribute("value");
atribValue.value = articulos[i].DESCRIPCION;
newOption.setAttributeNode(atribId);
newOption.setAttributeNode(atribValue);
lista.appendChild(newOption);
}    
});

function elegir() {
    let articulo = document.getElementById('listaArt').value;
    console.log(articulo);
    let deposito = document.getElementById('cantDepo').textContent;
    let farmacia = document.getElementById('cantFarm').textContent;



}