// opcion1 = document.getElementById("elegir_rojo");
// opcion2 = document.getElementById("elegir_verde");

// var documento;

// opcion1.addEventListener('click', function click() {
//     document.body.style.backgroundColor = ('red')
// })

window.addEventListener('load', async function CargarData() {
    const response = await fetch('./DB_Prueba.json')
    const data = await response.json()

    const lista = document.createElement('ul')
    document.body.appendChild(lista)
    lista.setAttribute('id','lista')
    const items = document.getElementById('lista')
    
    for (i = 0 ; i < data.length ; i++){
        const item = document.createElement('li');
        item.setAttribute('id','item_' + i)
        document.getElementById('lista').appendChild(item)
        const itemTxT = document.createTextNode(data[i].CODARTICULO)
        item.appendChild(itemTxT)
        console.log(i)
    }
    



});

