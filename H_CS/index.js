async function fetchDatos() {
    const listadoResponse = await fetch('./data/stock.json')
    const dbResponse = await fetch('./data/DB.json')

    const listadoData = await listadoResponse.json()
    const dbData = await dbResponse.json()

    generarArray(listadoData, dbData);
}

function generarArray(listadoData, dbData) {

    const total = listadoData.map(obj1 => {
        const matchingObj2 = dbData.find(obj2 => obj2.CODARTICULO === obj1.CODARTICULO);
        if (matchingObj2) {
            return { ...obj1, ...matchingObj2 };
        } else {
            return obj1;
        }
    });

    carga(total);
    cambio(total)
}

fetchDatos()

function carga(total) {
    filtroArt = document.getElementById('fNombre')
    filtroCM = document.getElementById('fCodigoMin')

    filtroArt.addEventListener('change', function () {
        if (filtroArt.checked) {
            const datalist = document.getElementById('medicacion');
            const entrada = document.getElementById('entrada')
            datalist.innerHTML = '';
            entrada.value = '';
            for (let i = 0; i < total.length; i++) {
                if (total[i].HABILITADO != "NO") {
                    const newOption = document.createElement("option");
                    const lista = document.getElementById('medicacion');
                    const atribValue = document.createAttribute("value");
                    atribValue.value = total[i].MEDICACION;
                    newOption.setAttributeNode(atribValue);
                    lista.appendChild(newOption);
                }
            }
        }
    })

    filtroCM.addEventListener('change', function () {
        if (filtroCM.checked) {
            const datalist = document.getElementById('medicacion');
            const entrada = document.getElementById('entrada')
            datalist.innerHTML = '';
            entrada.value = '';
            for (let i = 0; i < total.length; i++) {
                if (total[i].HABILITADO != "NO") {
                    const newOption = document.createElement("option");
                    const lista = document.getElementById('medicacion');
                    const atribValue = document.createAttribute("value");
                    atribValue.value = total[i].CODARTICULO;
                    newOption.setAttributeNode(atribValue);
                    lista.appendChild(newOption);
                }
            }
        }
    })

}

function cambio(total) {
    let articuloBuscado = document.getElementById('entrada')
    articuloBuscado.addEventListener('change', function () {
        console.log(articuloBuscado.value)
    })
}










