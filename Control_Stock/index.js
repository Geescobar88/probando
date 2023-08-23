async function fetchDatos() {
    const listadoResponse = await fetch('https://geescobar88.github.io/probando/Control_Stock/data/stock.json')
    const dbResponse = await fetch('./data/DB2.json')
    const vto = await fetch('./data/vto.json')
    const stock_esterilizacion = await fetch('./data/cod_esterilizacion.json')
    const stock_alimentacion = await fetch('./data/cod_alimentacion.json')

    const listadoData = await listadoResponse.json()
    const dbData = await dbResponse.json()
    const listadoVto = await vto.json()
    const listadoStrlzn = await stock_esterilizacion.json()
    const listadoAlimentacion = await stock_alimentacion.json()
   


    generarArray(listadoData, dbData, listadoVto, listadoStrlzn, listadoAlimentacion);
}


function generarArray(listadoData, dbData, listadoVto, listadoStrlzn, listadoAlimentacion) {

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
    listar(total, listadoStrlzn, listadoVto, listadoAlimentacion);
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

function listar(total, listadoStrlzn, listadoVto, listadoAlimentacion) {
    const btnCerrar = document.getElementById('btnCerrar')
    const btnDescargar = document.getElementById('btnDescargar')
    const msjLista = document.getElementById('listaFiltrar')
    const filtros = document.getElementById('filtros')
    const btnFiltroVto = document.getElementById('btnFiltroVto')
    
    const filtroTodos = document.getElementById('filtroTodos')
    const lblfiltroTodos = document.getElementById('lblfiltroTodos')

    const lPrincipal = document.getElementById('seleccionFiltros')
    const filtrosStock = document.getElementById('filtrosStock')
    const filtrosServicio = document.getElementById('filtrosServicio')
    const filtrosVencimiento = document.getElementById('filtrosVencimiento')
    const filtrosVencimientoY = document.getElementById('filtrosVencimientoY')
    const filtroCodigo = document.getElementById('filtroCodigo')
    const filtroNombre = document.getElementById('filtroNombre')
    const filtroStockDepo = document.getElementById('filtroStockDepo')

    filtrosStock.style.display = "none"
    filtrosServicio.style.display = "none"
    filtrosVencimiento.style.display = "none"
    filtrosVencimientoY.style.display = "none"
    btnFiltroVto.style.display = "none"
    filtroTodos.style.display = "none"    
    lblfiltroTodos.style.display = "none"

    filtros.addEventListener('click', () => {
        msjLista.style.display = "inline"

    })

    lPrincipal.addEventListener('change', (event) => {
        if (event.target.selectedIndex == "0") {
            filtrosStock.style.display = "inline"
            filtrosServicio.style.display = "none"
            filtrosVencimiento.style.display = "none"
            filtrosVencimientoY.style.display = "none"
            btnFiltroVto.style.display = "none"
            filtroTodos.style.display = "none"
            lblfiltroTodos.style.display = "none"
        } else if (event.target.selectedIndex == "1") {
            filtrosStock.style.display = "none"
            filtrosServicio.style.display = "inline"
            filtrosVencimiento.style.display = "none"
            filtrosVencimientoY.style.display = "none"
            btnFiltroVto.style.display = "none"
            filtroTodos.style.display = "none"
            lblfiltroTodos.style.display = "none"
        } else {
            filtrosStock.style.display = "none"
            filtrosServicio.style.display = "none"
            filtrosVencimiento.style.display = "inline"
            filtrosVencimientoY.style.display = "inline"
            btnFiltroVto.style.display = "inline"
            filtroTodos.style.display = "inline"
            lblfiltroTodos.style.display = "inline"
        }

    })

    filtrosStock.addEventListener('change', (event) => {
        if (event.target.selectedIndex == "0") {
            filtroCodigo.textContent = ""
            filtroNombre.textContent = ""
            filtroStockDepo.textContent = ""
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
                    newSDepo.style.color = "#b83564"
                } else if (item.STOCKENDEPOSITO < item.STOCK_MIN * 2) {
                    newSDepo.style.color = "#ffb350"
                } else {
                    newSDepo.style.color = "#4d8f81"
                }
                filtroCodigo.appendChild(newCMinis)
                filtroNombre.appendChild(newNombre)
                filtroStockDepo.appendChild(newSDepo)
            })
        } else if ((event.target.selectedIndex == "1")) {
            filtroCodigo.textContent = ""
            filtroNombre.textContent = ""
            filtroStockDepo.textContent = ""
            total.forEach(item => {
                if (item.STOCKENDEPOSITO < item.STOCK_MIN * 2) {
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
                        newSDepo.style.color = "#b83564"
                    } else if (item.STOCKENDEPOSITO < item.STOCK_MIN * 2) {
                        newSDepo.style.color = "#ffb350"
                    } else {
                        newSDepo.style.color = "#4d8f81"
                    }
                    filtroCodigo.appendChild(newCMinis)
                    filtroNombre.appendChild(newNombre)
                    filtroStockDepo.appendChild(newSDepo)
                }
            });

        } else {
            filtroCodigo.textContent = ""
            filtroNombre.textContent = ""
            filtroStockDepo.textContent = ""
            total.forEach(item => {
                if (item.STOCKENDEPOSITO === 0) {
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
                }
            });
        }
    })

    filtrosServicio.addEventListener('change', (event) => {
        if (event.target.selectedIndex == "0") {
            filtroCodigo.textContent = ""
            filtroNombre.textContent = ""
            filtroStockDepo.textContent = ""

            const stockEsterilizacion = total.filter(item => {
                return listadoStrlzn.some(totalItem => totalItem.CODIGO === item.CODARTICULO)
            });
            stockEsterilizacion.forEach(item => {
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
                    newSDepo.style.color = "#b83564"
                } else if (item.STOCKENDEPOSITO < item.STOCK_MIN * 2) {
                    newSDepo.style.color = "#ffb350"
                } else {
                    newSDepo.style.color = "#4d8f81"
                }
                filtroCodigo.appendChild(newCMinis)
                filtroNombre.appendChild(newNombre)
                filtroStockDepo.appendChild(newSDepo)
            })
        }

        else if (event.target.selectedIndex == "1") {
            filtroCodigo.textContent = ""
            filtroNombre.textContent = ""
            filtroStockDepo.textContent = ""

            const stockAlimentacion = total.filter(item => {
                return listadoAlimentacion.some(totalItem => totalItem.CODIGO === item.CODARTICULO)
            });
            stockAlimentacion.forEach(item => {
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
                    newSDepo.style.color = "#b83564"
                } else if (item.STOCKENDEPOSITO < item.STOCK_MIN * 2) {
                    newSDepo.style.color = "#ffb350"
                } else {
                    newSDepo.style.color = "#4d8f81"
                }
                filtroCodigo.appendChild(newCMinis)
                filtroNombre.appendChild(newNombre)
                filtroStockDepo.appendChild(newSDepo)
            })
        }
    })

    btnFiltroVto.addEventListener('click', () => {
        filtroCodigo.textContent = ""
        filtroNombre.textContent = ""
        filtroStockDepo.textContent = ""
        const fecha = filtrosVencimiento.value + filtrosVencimientoY.value
        fechaobjeto = fecha;
        const coincidencia = listadoVto.filter(item => {
            if (filtroTodos.checked){
            return item.FECHAVTO <= fecha
                } else {
            return item.FECHAVTO == fecha        
            }
        })
        console.log(coincidencia)
        coincidencia.forEach (item => {
                const newCMinis = document.createElement("li")
                const newNombre = document.createElement("li")
                const newSDepo = document.createElement("li")
                newCMinis.textContent = item.CODARTICULO;
                if (item.NOMBREGENERICO.length > 100) {
                    const descCorta = item.NOMBREGENERICO;
                    newNombre.textContent = descCorta.substring(0, 50) + '...';
                } else {
                    newNombre.textContent = item.NOMBREGENERICO + " " + item.CONCENTRACION;
                }
                    newSDepo.textContent = item.STOCKEXISTENTE;

                filtroCodigo.appendChild(newCMinis)
                filtroNombre.appendChild(newNombre)
                filtroStockDepo.appendChild(newSDepo)
        })
    })

    btnCerrar.addEventListener('click', () => {
        msjLista.style.display = "none"
    })

    btnDescargar.addEventListener('click', () => {
        alert("Proximamente...")
    })
}
