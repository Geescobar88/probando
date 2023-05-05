// opcion1 = document.getElementById("elegir_rojo");
// opcion2 = document.getElementById("elegir_verde");

// var documento;

// opcion1.addEventListener('click', function click() {
//     document.body.style.backgroundColor = ('red')
// })

window.addEventListener('load', async function CargarData() {
    const response = await fetch('./DB_Prueba.json')
    const data = await response.json()
    console.log(typeof(data))
    const lista = document.createElement('ul')
    document.body.appendChild(lista)
    lista.setAttribute('id','lista')
    const elLista = document.getElementById('lista');


    for (const articulo in data) {
        console.log(data)
        const item = elLista.createElement('li')
        document.item.appendChild(item)
        item.setAttribute('id','item'+[i])
        item.setAttribute('innerHTML', data[i].CODARTICULO)

        }
    

})
