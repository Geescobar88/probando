async function fetchDatos() {
    const listadoResponse = await fetch('https://geescobar88.github.io/probando/Control_Stock/data/stock.json')
    const dbResponse = await fetch('./data/DB.json')
    const vto = await fetch('./data/vto.json')
    const stock_esterilizacion = await fetch('./data/cod_esterilizacion.json')

    const listadoData = await listadoResponse.json()
    const dbData = await dbResponse.json()
    const listadoVto = await vto.json()
    const listadoStrlzn = await stock_esterilizacion.json()


    generarArray(listadoData, dbData, listadoVto, listadoStrlzn);
}


function generarArray(listadoData, dbData, listadoVto, listadoStrlzn) {

    const total = listadoData.map(listado1 => {
        const coincidencia = dbData.find(listado2 => listado2.CODARTICULO === listado1.CODARTICULO);
        if (coincidencia) {
            return { ...listado1, ...coincidencia };
        } else {
            return listado1;
        }
    });

    cargar(total);
    cambiar(total, listadoVto);
    listar(total, listadoStrlzn);
}

fetchDatos()

//CARGA DE DATOS

function cargar(total) {
    const filtroArt = document.getElementById('fNombre')
    const filtroCM = document.getElementById('fCodigoMin')
    const filtroCheckArt = document.getElementById('filtroCheckArt')
    const filtroCheckCm = document.getElementById('filtroCheckCm')
    const datalist = document.getElementById('medicacion');
    const entrada = document.getElementById('entrada')
    const busqueda = document.getElementById('busqueda')

    filtroArt.addEventListener('change', function () {
        if (filtroArt.checked) {

            filtroCheckArt.style.color = "var(--claro)"
            filtroCheckArt.style.backgroundColor = "var(--fuerte)"
            filtroCheckCm.style.color = "black"
            filtroCheckCm.style.backgroundColor = "var(--claro)"
            entrada.disabled = false
            datalist.innerHTML = '';
            entrada.value = '';
            for (let i = 0; i < total.length; i++) {

                const newOption = document.createElement("option");
                const lista = document.getElementById('medicacion');
                const atribValue = document.createAttribute("value");
                if (total[i].MEDICACION === undefined) {
                    atribValue.value = total[i].DESCRIPCION;
                } else {
                    atribValue.value = total[i].MEDICACION;
                }
                newOption.setAttributeNode(atribValue);
                lista.appendChild(newOption);

            }
        }
    })

    filtroCM.addEventListener('change', function () {
        if (filtroCM.checked) {

            filtroCheckCm.style.color = "var(--claro)"
            filtroCheckCm.style.backgroundColor = "var(--fuerte)"
            filtroCheckArt.style.color = "black"
            filtroCheckArt.style.backgroundColor = "var(--claro)"
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

    busqueda.addEventListener('click', function () {
        if (entrada.disabled) {

            filtroCheckArt.style.color = "var(--claro)"
            filtroCheckArt.style.backgroundColor = "var(--fuerte)"
            filtroCheckCm.style.color = "black"
            filtroCheckCm.style.backgroundColor = "var(--claro)"
            entrada.disabled = false
            datalist.innerHTML = '';
            entrada.value = '';
            for (let i = 0; i < total.length; i++) {

                const newOption = document.createElement("option");
                const lista = document.getElementById('medicacion');
                const atribValue = document.createAttribute("value");
                if (total[i].MEDICACION === undefined) {
                    atribValue.value = total[i].DESCRIPCION;
                } else {
                    atribValue.value = total[i].MEDICACION;
                }
                newOption.setAttributeNode(atribValue);
                lista.appendChild(newOption);

            }
        }
    })

}

//ELECCION DE ARTICULO

function cambiar(total, listadoVto) {
    const articuloBuscado = document.getElementById('entrada')
    const nomArticulo = document.getElementById('nombreArticulo')
    const codMinisterial = document.getElementById('codMinisterial')
    const stockDeposito = document.getElementById('stockDeposito')
    const proxVtoLote = document.getElementById('proxVtoLote')
    const proxVtoVto = document.getElementById('proxVtoVto')
    const proxVtoCant = document.getElementById('proxVtoCant')
    const bBorrar = document.getElementById('bBorrar')

    articuloBuscado.addEventListener('change', function () {
        proxVtoLote.textContent = "";
        proxVtoVto.textContent = "";
        proxVtoCant.textContent = "";

        const objEncontrado = total.find(obj => {
            return obj.CODARTICULO === articuloBuscado.value || obj.DESCRIPCION === articuloBuscado.value || obj.MEDICACION === articuloBuscado.value
        })

        const objFiltroVto = listadoVto.filter(obj => {
            return objEncontrado.CODARTICULO === obj.CODARTICULO
        })

        if (objEncontrado.MEDICACION === undefined) {
            nomArticulo.textContent = objEncontrado.DESCRIPCION
        } else {
            nomArticulo.textContent = objEncontrado.MEDICACION
        }
        codMinisterial.textContent = objEncontrado.CODARTICULO
        stockDeposito.textContent = objEncontrado.STOCKENDEPOSITO
        console.log('Stock Minino establecido: ' + objEncontrado.STOCK_MIN + ' Si el stock en depo es mas de: ' + objEncontrado.STOCK_MIN * 2 + ' deberia ser verde. Si es menos deberia ser rojo. Si esta entre ' + objEncontrado.STOCK_MIN + ' y ' + objEncontrado.STOCK_MIN * 2 + 'Deberia ser amarillo')

        if (objEncontrado.STOCKENDEPOSITO <= objEncontrado.STOCK_MIN) {
            estadoStock.style.backgroundColor = "Red";
            estadoStock.style.color = "White";
            estadoStock.textContent = "Critico"

        } else if
            (objEncontrado.STOCKENDEPOSITO > (objEncontrado.STOCK_MIN * 2)) {
            estadoStock.style.backgroundColor = "Green";
            estadoStock.style.color = "White";
            estadoStock.textContent = "Normal"
        }
        else if
            (objEncontrado.STOCK_MIN === undefined) {
            estadoStock.style.backgroundColor = "Gray";
            estadoStock.style.color = "White";
            estadoStock.textContent = "No definido"
        }
        else {
            estadoStock.style.backgroundColor = "Yellow";
            estadoStock.style.color = "Black";
            estadoStock.textContent = "Minimo"
        }

        objFiltroVto.forEach(item => {
            const newLote = document.createElement('li');
            newLote.textContent = item.NROLOTE
            const newVto = document.createElement('li');
            newVto.textContent = item.FECHAVTO
            const newCant = document.createElement('li');
            newCant.textContent = item.STOCKEXISTENTE
            proxVtoLote.appendChild(newLote)
            proxVtoVto.appendChild(newVto)
            proxVtoCant.appendChild(newCant)


        })
    })



    bBorrar.addEventListener("click", () => {
        proxVtoLote.textContent = "";
        proxVtoVto.textContent = "";
        proxVtoCant.textContent = "";
        nomArticulo.textContent = "Descripción: No disponible"
        codMinisterial.textContent = "#0000000";
        stockDeposito.textContent = "00000";
        articuloBuscado.value = "";
        estadoStock.style.backgroundColor = "Gray";
        estadoStock.style.color = "White";
        estadoStock.textContent = "No definido"
    })

    articuloBuscado.addEventListener("dblclick", () => {
        bBorrar.click()
        })
}

//LISTADOS

function listar(total, listadoStrlzn) {
    const enCero = document.getElementById('enCero');
    const minimo = document.getElementById('stockMinimo');
    const listaCompleta = document.getElementById('listaCompleta');
    const esterilizacion = document.getElementById('esterilizacion')
    const btnCerrar = document.getElementById('btnCerrar')
    const btnDescargar = document.getElementById('btnDescargar')
    const lista = document.getElementById('lista')
    const msjLista = document.getElementById('listaFiltrar')
    const filtros = document.getElementById('filtros')

    const lPrincipal = document.getElementById('seleccionFiltros')
    const filtrosStock = document.getElementById('filtrosStock')
    const filtrosServicio = document.getElementById('filtrosServicio')
    const filtrosVencimiento = document.getElementById('filtrosVencimiento')
    const optionselect = document.getElementById('optionselect')

    const filtroCodigo = document.getElementById('filtroCodigo')

    filtrosStock.style.display = "none"
    filtrosServicio.style.display = "none"
    filtrosVencimiento.style.display = "none"

    filtros.addEventListener('click', () => {
        msjLista.style.display = "inline"
        filtrosStock.style.display = "inline"
        optionselect.selected = "true"

    })

    lPrincipal.addEventListener('change', (event) => {
        // alert(event.target.selectedIndex)
        if (event.target.selectedIndex == "0") {
            filtrosStock.style.display = "inline"
            filtrosServicio.style.display = "none"
            filtrosVencimiento.style.display = "none"
        } else if (event.target.selectedIndex == "1") {
            filtrosStock.style.display = "none"
            filtrosServicio.style.display = "inline"
            filtrosVencimiento.style.display = "none"
        } else {
            filtrosStock.style.display = "none"
            filtrosServicio.style.display = "none"
            filtrosVencimiento.style.display = "inline"
        }

    })

    filtrosStock.addEventListener('change', (event) => {
        // alert(event.target.selectedIndex)
        if (event.target.selectedIndex == "0") {
            filtroCodigo.textContent = ""
            total.forEach(item => {
                const newCMinis = document.createElement("li")
                const newNombre = document.createElement("li")
                const newSDepo = document.createElement("li")
                newCMinis.textContent = item.CODARTICULO;
                if (item.DESCRIPCION.length > 100) {
                    const descCorta = item.DESCRIPCION;
                    newNombre.textContent = descCorta.substring(0, 50) + '...';
                } else {
                    newNombre.textContent = item.DESCRIPCION;
                }
                newSDepo.textContent = item.STOCKENDEPOSITO;
                if (item.STOCKENDEPOSITO === 0) {
                    newCMinis.style.color = "#b83564"
                    newNombre.style.color = "#b83564"
                    newSDepo.style.color = "#b83564"
                } else if (item.STOCKENDEPOSITO < item.STOCK_MIN * 2) {
                    newCMinis.style.color = "#ffb350"
                    newNombre.style.color = "#ffb350"
                    newSDepo.style.color = "#ffb350"
                } else {
                    newCMinis.style.color = "#4d8f81"
                    newNombre.style.color = "#4d8f81"
                    newSDepo.style.color = "#4d8f81"
                }
                filtroCodigo.appendChild(newCMinis)
                filtroNombre.appendChild(newNombre)
                filtroStockDepo.appendChild(newSDepo)

            })
        }
    })

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
            newItem.textContent = item.CODARTICULO + " " + item.DESCRIPCION + " " + item.STOCKENDEPOSITO
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

    esterilizacion.addEventListener('click', () => {
        lista.textContent = ""
        const stockEsterilizacion = total.filter(item => {
            return listadoStrlzn.some(totalItem => totalItem.CODIGO === item.CODARTICULO);
        });
        stockEsterilizacion.forEach(item => {
            const newItem = document.createElement('li');
            newItem.textContent = item.CODARTICULO + " -- " + item.DESCRIPCION + " == " + item.STOCKENDEPOSITO
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
