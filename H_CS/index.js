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
    const nomArticulo = document.getElementById('nombreArticulo')
    const codMinisterial = document.getElementById('codMinisterial')
    const estado = document.getElementById('estadoStock')
    const stockDeposito = document.getElementById('stockDeposito')
    const stockFarmacia = document.getElementById('stockFarmacia')
    articuloBuscado.addEventListener('change', function () {
        const objEncontrado = total.find( obj => {
            return obj.CODARTICULO === articuloBuscado.value || obj.MEDICACION === articuloBuscado.value
        })
        console.log(objEncontrado)
    nomArticulo.textContent = objEncontrado.MEDICACION
    codMinisterial.textContent = objEncontrado.CODARTICULO
    stockDeposito.textContent = objEncontrado.STOCKENDEPOSITO
    stockFarmacia.textContent = objEncontrado.STOCKENDISPENSACION
    
    if (objEncontrado.STOCKENDEPOSITO <= objEncontrado.STOCK_MIN) {
        console.log("stock critico")
        estadoStock.style.backgroundColor = "Red";
        estadoStock.style.color = "White";

    }   else if 
        (objEncontrado.STOCKENDEPOSITO > (objEncontrado.STOCK_MIN*2)) {
        console.log("stock normal")
        estadoStock.style.backgroundColor = "Green";
        estadoStock.style.color = "White";
        }
        else {
            console.log("stock minimo")
            estadoStock.style.backgroundColor = "Yellow";
            estadoStock.style.color = "Black";
        }
    })
}
