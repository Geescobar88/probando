window.addEventListener('load', function () {
    for (i = 0; i < articulos.length; i++) {

    if (articulos[i].DESCRIPCION != "ANULAR") {
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
    }
});

function elegir() {
    let articulo = document.getElementById('listaArt').value;
    let index = articulos.findIndex(object => {
        return object.DESCRIPCION === articulo;
    })
    console.log(index);
    document.getElementById('codArt').innerText = articulos[index].CODARTICULO;
    document.getElementById('cantDepo').innerText = articulos[index].STOCKENDEPOSITO;
    document.getElementById('cantFarm').innerText = articulos[index].STOCKENDISPENSACION;

}

function borrar() {
    document.getElementById('listaArt').value = "";
    document.getElementById('codArt').innerText = "";
    document.getElementById('cantDepo').innerText = "";
    document.getElementById('cantFarm').innerText = "";
}