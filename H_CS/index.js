async function fetchDatos() {
    const listadoResponse = await fetch('https://geescobar88.github.io/probando/Control_Stock/data/stock.json')
    const dbResponse = await fetch('./data/DB.json')

    const listadoData = await listadoResponse.json()
    const dbData = await dbResponse.json()

    generarArray(listadoData, dbData);
}

function generarArray(listadoData, dbData) {

    const total = listadoData.map(listado1 => {
        const coincidencia = dbData.find(listado2 => listado2.CODARTICULO === listado1.CODARTICULO);
        if (coincidencia) {
            return { ...listado1, ...coincidencia };
        } else {
            return listado1;
        }
    });

    cargar(total);
    cambiar(total);
    listar(total);

}

fetchDatos()

function cargar(total) {
    const filtroArt = document.getElementById('fNombre')
    const filtroCM = document.getElementById('fCodigoMin')    
    const filtroCheckArt = document.getElementById('filtroCheckArt')
    const filtroCheckCm = document.getElementById('filtroCheckCm')
    const datalist = document.getElementById('medicacion');
    const entrada = document.getElementById('entrada')

    filtroArt.addEventListener('change', function () {
        if (filtroArt.checked) {

            filtroCheckArt.style.color = "white"
            filtroCheckArt.style.backgroundColor = "green"
            filtroCheckCm.style.color = "black"
            filtroCheckCm.style.backgroundColor = "white"
            entrada.disabled = false
            datalist.innerHTML = '';
            entrada.value = '';
            for (let i = 0; i < total.length; i++) {
                if (total[i].HABILITADO != "NO") {
                    const newOption = document.createElement("option");
                    const lista = document.getElementById('medicacion');
                    const atribValue = document.createAttribute("value");
                    atribValue.value = total[i].DESCRIPCION; 
                    newOption.setAttributeNode(atribValue);
                    lista.appendChild(newOption);
                }
            }
        }
    })

    filtroCM.addEventListener('change', function () {
        if (filtroCM.checked) {
            filtroCheckCm.style.color = "white"
            filtroCheckCm.style.backgroundColor = "green"
            filtroCheckArt.style.color = "black"
            filtroCheckArt.style.backgroundColor = "white"
            entrada.disabled = false
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

function cambiar(total) {
    const articuloBuscado = document.getElementById('entrada')
    const nomArticulo = document.getElementById('nombreArticulo')
    const codMinisterial = document.getElementById('codMinisterial')
    const stockDeposito = document.getElementById('stockDeposito')
    const stockFarmacia = document.getElementById('stockFarmacia')

    articuloBuscado.addEventListener('change', function () {
        const objEncontrado = total.find(obj => {
            return obj.CODARTICULO === articuloBuscado.value || obj.DESCRIPCION === articuloBuscado.value
        })
        console.log(objEncontrado)
        nomArticulo.textContent = objEncontrado.DESCRIPCION
        codMinisterial.textContent = objEncontrado.CODARTICULO
        stockDeposito.textContent = objEncontrado.STOCKENDEPOSITO
        stockFarmacia.textContent = objEncontrado.STOCKENDISPENSACION

        if (objEncontrado.STOCKENDEPOSITO <= objEncontrado.STOCK_MIN) {
            console.log("stock critico")
            estadoStock.style.backgroundColor = "Red";
            estadoStock.style.color = "White";
            estadoStock.textContent = "Critico"

        } else if
            (objEncontrado.STOCKENDEPOSITO > (objEncontrado.STOCK_MIN * 2)) {
            console.log("stock normal")
            estadoStock.style.backgroundColor = "Green";
            estadoStock.style.color = "White";
            estadoStock.textContent = "Normal"
        }
        else {
            console.log("stock minimo")
            estadoStock.style.backgroundColor = "Yellow";
            estadoStock.style.color = "Black";
            estadoStock.textContent = "Minimo"
        }
    })
}

function listar(total) {
    const enCero = document.getElementById('enCero');
    const minimo = document.getElementById('stockMinimo');
    const listaCompleta = document.getElementById('listaCompleta');
    const btnCerrar = document.getElementById('btnCerrar')
    const btnDescargar = document.getElementById('btnDescargar')
    const lista = document.getElementById('lista')
    const msjLista = document.getElementById('listaStock')
    
    enCero.addEventListener('click', () => {
        lista.textContent = ""
        total.forEach(item => {
            if (item.STOCKENDEPOSITO === 0) {
                const newItem = document.createElement('li');
                newItem.textContent = item.CODARTICULO + " : " + item.DESCRIPCION + " = " + item.STOCKENDEPOSITO
                if (item.STOCKENDEPOSITO === 0) {
                    newItem.style.color = "#b83564"
                } else if (item.STOCKENDEPOSITO < item.STOCK_MIN * 2) {
                    newItem.style.color = "#ffb350"
                } else {
                    newItem.style.color = "#4d8f81"
                }
                lista.appendChild(newItem)
            }
        });
        msjLista.style.display = "inline"
    })

    minimo.addEventListener('click', () => {
        lista.textContent = ""
        total.forEach(item => {
            if (item.STOCKENDEPOSITO < item.STOCK_MIN * 2) {
                const newItem = document.createElement('li');
                newItem.textContent = item.CODARTICULO + " : " + item.DESCRIPCION + " = " + item.STOCKENDEPOSITO
                if (item.STOCKENDEPOSITO === 0) {
                    newItem.style.color = "#b83564"
                } else if (item.STOCKENDEPOSITO < item.STOCK_MIN * 2) {
                    newItem.style.color = "#ffb350"
                } else {
                    newItem.style.color = "#4d8f81"
                }
                lista.appendChild(newItem)
            }
        });
        msjLista.style.display = "inline"
    })

    listaCompleta.addEventListener('click', () => {
        lista.textContent = ""
        total.forEach(item => {
            const newItem = document.createElement('li');
            newItem.textContent = item.CODARTICULO + " : " + item.DESCRIPCION + " = " + item.STOCKENDEPOSITO
            if (item.STOCKENDEPOSITO === 0) {
                newItem.style.color = "#b83564"
            } else if (item.STOCKENDEPOSITO < item.STOCK_MIN * 2) {
                newItem.style.color = "#ffb350"
            } else {
                newItem.style.color = "#4d8f81"
            }
            lista.appendChild(newItem)
        });
        msjLista.style.display = "inline"
    })

    btnCerrar.addEventListener('click', () => {
        msjLista.style.display = "none"
    })

    btnDescargar.addEventListener('click', () => {
        alert("Proximamente...")
    })
}
