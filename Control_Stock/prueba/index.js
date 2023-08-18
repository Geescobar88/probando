async function datos() {
    const lista = await fetch ('./prueba1.json')
    const response = await lista.json()

    generarArray(response)
}

datos()

function generarArray(response) {

    const total = response.ArregloOriginal.map(listado1 => {
        const coincidencia = response.Arreglo2.find(listado2 => listado2.CODARTICULO === listado1.CODARTICULO);
        if (coincidencia) {
            return { ...listado1, ...coincidencia };
        } else {
            return listado1;
        }
    });

console.log(total)

const texto = document.getElementById('texto')
const boton = document.getElementById('boton')

boton.addEventListener('click', () => {
    texto.textContent = JSON.stringify(total)
})

}