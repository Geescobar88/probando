document.addEventListener('DOMContentLoaded', function () {
  const fechaSpan = document.getElementById("fecha")
  const fecha = new Date();
  const diaActual = "19-12-2024"
  fechaSpan.innerText = diaActual
  // const diaActual = fecha.getDate() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getFullYear();
  const diaPrevio = "18-12-2024"
  cargarDatos(diaActual, diaPrevio);

});

async function cargarDatos(diaActual, diaPrevio) {
  const db = await fetch("./data/DB.json");
  const dbResponse = await db.json();
  const listado = await fetch("./data/" + diaActual + ".json")
  const listadoResponse = await listado.json();
  const listadoPrevio = await fetch("./data/" + diaPrevio + ".json")
  const listadoPrevioResponse = await listadoPrevio.json();
  const vto = await fetch("./data/vto.json")
  const listadoVto = await vto.json();
  const vtoF = await fetch("./data/vto_F.json")
  const listadoVtoF = await vtoF.json();

  const totalVto = listadoVto.map((array1) => {
    const coincidencia = listadoVtoF.find(
      (array2) => array2.NROLOTE === array1.NROLOTE
    );
    if (coincidencia) {
      return { ...array1, ...coincidencia };
    } else {
      return array1;
    }
  });

  const totalVto2 = totalVto.map((array1) => {
    const coincidencia = dbResponse.find(
      (array2) => array2.CODARTICULO === array1.CODARTICULO
    );
    if (coincidencia) {
      return { ...array1, ...coincidencia };
    } else {
      return array1;
    }
  });

  generarTotal(dbResponse, listadoResponse, listadoPrevioResponse, totalVto2);
  menubar();
}

///////////////////////////////////////MENU/////////////////////////////////////////

function menubar() {
  menu = document.getElementById("menu")
  menu_btn = document.getElementById("menu_btn")
  menu_close = document.getElementById("menu_close")

  menu_btn.addEventListener("click", () => {
    menu.style.display = "flex"
  })

  menu_close.addEventListener("click", () => {
    menu.style.display = "none"
  })

}

//////////////////////////////////GENERANDO TOTAL///////////////////////////////////

function generarTotal(dbResponse, listadoResponse, listadoPrevioResponse, totalVto) {
  const total = dbResponse.map((array1) => {
    const coincidencia = listadoResponse.find(
      (array2) => array2.CODARTICULO === array1.CODARTICULO
    );
    if (coincidencia) {
      return { ...array1, ...coincidencia };
    } else {
      return array1;
    }
  });

  filtrarDatos(total, listadoResponse);
  seleccionarArticulo(total, totalVto, listadoResponse)
  crearListados(total, totalVto, listadoResponse, listadoPrevioResponse);
}

///////////////////////////////////FILTRANDO DATOS//////////////////////////////////

function filtrarDatos(total, listadoResponse) {
  const filtroArt = document.getElementById("fNombre");
  const filtroCm = document.getElementById("fCodigoMin");
  const entrada = document.getElementById("entrada");
  const datalist = document.getElementById("medicacion");
  const borrar = document.getElementById("borrar")
  const busqueda = document.getElementById("busqueda")
  const nomArticulo = document.getElementById("nombreArticulo");
  const codMinisterial = document.getElementById("codMinisterial");
  const stockDeposito = document.getElementById("stockDeposito");
  const estadoStock = document.getElementById("estadoStock")
  const consumo = document.getElementById("consumo")

  const tabla = document.getElementById("tabla");

  //--------------------------Filtro por articulos---------------------
  filtroArt.addEventListener("change", () => {
    borrar.click();
    if (filtroArt.checked) {
      datalist.innerHTML = "";
      entrada.value = "";
      tabla.innerHTML = "<tr><th>Lote</th><th>Vencimiento</th><th>Deposito</th><th>Farmacia</th></tr>";
      total.forEach((item) => {
        const newOption = document.createElement("option");
        const atribValue = document.createAttribute("value");
        const atribLabel = document.createAttribute("label");
        if (item.HABILITADO == "SI") {
          atribValue.value = item.MEDICACION;
          atribLabel.value = item.MEDICACION;
        } else {
          atribValue.value = item.DESCRIPCION;
          atribLabel.value = item.DESCRIPCION;
        }
        newOption.setAttributeNode(atribValue);
        newOption.setAttributeNode(atribLabel);
        datalist.appendChild(newOption);
      });
    }
  });

  //--------------------------Filtro por Codigo ministerial---------------------

  filtroCm.addEventListener("change", () => {
    borrar.click();
    if (filtroCm.checked) {
      datalist.innerHTML = "";
      entrada.value = "";
      tabla.innerHTML = "<tr><th>Lote</th><th>Vencimiento</th><th>Deposito</th><th>Farmacia</th></tr>";
      listadoResponse.forEach((item) => {
        const newOption = document.createElement("option");
        const atribValue = document.createAttribute("value");
        atribValue.value = item.DESCRIPCION;
        newOption.setAttributeNode(atribValue);
        datalist.appendChild(newOption);
      });
    }
  });

  //--------------------------Otras funcionalidades---------------------

  borrar.addEventListener("click", () => {
    entrada.value = "";
    nomArticulo.textContent = "-----";
    codMinisterial.textContent = "-----";
    stockDeposito.textContent = "-----"
    estadoStock.textContent = "-----"
    estadoStock.style.color = "black"
    consumo.textContent = "-----"
    tabla.innerHTML = "<tr><th>Lote</th><th>Vencimiento</th><th>Deposito</th><th>Farmacia</th></tr>";
  })

  busqueda.addEventListener("click", () => {
    if (entrada.disabled) {
      entrada.disabled = false;
      filtroArt.click();
    }
  })

  busqueda.addEventListener("dblclick", () => {
    borrar.click();
  })
}

//////////////////////////////////SELECCIONANDO ARTICULO////////////////////////////

function seleccionarArticulo(total, totalVto, listadoResponse) {
  const filtroArt = document.getElementById("fNombre");
  const entrada = document.getElementById("entrada");
  const nomArticulo = document.getElementById("nombreArticulo");
  const codMinisterial = document.getElementById("codMinisterial");
  const stockDepositoContainer = document.getElementById("stockDepositoContainer");
  const stockDeposito = document.getElementById("stockDeposito");
  const stockDepositoLabel = document.getElementById('stockDepositoLabel')
  const estadoStock = document.getElementById("estadoStock")
  const consumo = document.getElementById("consumo")

  const LTextVto = document.getElementById("LTextVto")

  const tabla = document.getElementById("tabla");



  entrada.addEventListener('change', () => {

    //--------------------------Filtrar un articulo---------------------

    if (filtroArt.checked) {
      const articuloEncontrado = total.find((match) => match.MEDICACION === entrada.value || match.CODARTICULO === entrada.value || match.DESCRIPCION === entrada.value)
      nomArticulo.textContent = articuloEncontrado.MEDICACION + " - (" + articuloEncontrado.SERVICIO + ")"
      codMinisterial.textContent = articuloEncontrado.CODARTICULO
      stockDeposito.textContent = articuloEncontrado.STOCKENDEPOSITO
      consumo.textContent = articuloEncontrado.STOCK_MIN
      if (articuloEncontrado.STOCKENDEPOSITO <= articuloEncontrado.STOCK_MIN) {
        estadoStock.textContent = "Critico"
        estadoStock.style.color = "red";
      } else if (articuloEncontrado.STOCKENDEPOSITO >= articuloEncontrado.STOCK_MIN * 2) {
        estadoStock.textContent = "En stock"
        estadoStock.style.color = "green";
      } else {
        estadoStock.textContent = "Minimo"
        estadoStock.style.color = "black";
      }
    } else {
      const articuloEncontrado = listadoResponse.find((match) => match.MEDICACION === entrada.value || match.CODARTICULO === entrada.value || match.DESCRIPCION === entrada.value)
      nomArticulo.textContent = articuloEncontrado.DESCRIPCION
      codMinisterial.textContent = articuloEncontrado.CODARTICULO
      stockDeposito.textContent = articuloEncontrado.STOCKENDEPOSITO
      consumo.textContent = articuloEncontrado.STOCK_MIN
      if (articuloEncontrado.STOCKENDEPOSITO <= articuloEncontrado.STOCK_MIN) {
        estadoStock.textContent = "Critico"
        estadoStock.style.color = "red";
      } else if (articuloEncontrado.STOCKENDEPOSITO >= articuloEncontrado.STOCK_MIN * 2) {
        estadoStock.textContent = "En stock"
        estadoStock.style.color = "green";
      } else {
        estadoStock.textContent = "Minimo"
        estadoStock.style.color = "black";
      }
    }




    //--------------------------Alternar Deposito/Farmacia---------------------



    if (filtroArt.checked) {
      const articuloEncontrado = total.find((match) => match.MEDICACION === entrada.value || match.CODARTICULO === entrada.value || match.DESCRIPCION === entrada.value)
      let aux = 0;
      stockDepositoContainer.addEventListener("click", () => {
        if (aux == 0) {
          stockDeposito.textContent = articuloEncontrado.STOCKENDISPENSACION
          stockDepositoLabel.textContent = "Stock en Farmacia"
          stockDepositoLabel.style.color = "#ffffff"
          stockDepositoContainer.style.backgroundColor = "#94a8e6"
          aux = + 1
        } else if (aux == 1) {
          stockDeposito.textContent = articuloEncontrado.STOCKENDEPOSITO
          stockDepositoLabel.textContent = "Stock en Deposito"
          stockDepositoLabel.style.color = "#0A0A0A"
          stockDepositoContainer.style.backgroundColor = "#ebe7e0"
          aux = aux - 1
        }
      })
    } else {
      const articuloEncontrado = listadoResponse.find((match) => match.MEDICACION === entrada.value || match.CODARTICULO === entrada.value || match.DESCRIPCION === entrada.value)
      let aux = 0;
      stockDepositoContainer.addEventListener("click", () => {
        if (aux == 0) {
          stockDeposito.textContent = articuloEncontrado.STOCKENDISPENSACION
          stockDepositoLabel.textContent = "Stock en Farmacia"
          stockDepositoLabel.style.color = "#ffffff"
          stockDepositoContainer.style.backgroundColor = "#94a8e6"
          aux = + 1
        } else if (aux == 1) {
          stockDeposito.textContent = articuloEncontrado.STOCKENDEPOSITO
          stockDepositoLabel.textContent = "Stock en Deposito"
          stockDepositoLabel.style.color = "white"
          stockDepositoContainer.style.backgroundColor = "#ebe7e0"
          aux = aux - 1
        }
      })
    }


    //--------------------------Tabla de vencimientos---------------------

    const filtroArtVto = totalVto.filter((match) => {
      if (filtroArt.checked) {
        const articuloEncontrado = total.find((match) => match.MEDICACION === entrada.value || match.CODARTICULO === entrada.value || match.DESCRIPCION === entrada.value)
        return articuloEncontrado.CODARTICULO === match.CODARTICULO
      } else {
        const articuloEncontrado = listadoResponse.find((match) => match.MEDICACION === entrada.value || match.CODARTICULO === entrada.value || match.DESCRIPCION === entrada.value)
        return articuloEncontrado.CODARTICULO === match.CODARTICULO
      }
    })

    tabla.innerHTML = "<tr><th>Lote</th><th>Vencimiento</th><th>Deposito</th><th>Farmacia</th></tr>";
    filtroArtVto.forEach((articulo) => {
      const row = tabla.insertRow();
      const loteCell = row.insertCell(0);
      const vencimientoCell = row.insertCell(1);
      const cantidadCell = row.insertCell(2);
      const cantidadFCell = row.insertCell(3);

      loteCell.innerHTML = articulo.NROLOTE;
      vencimientoCell.innerHTML = articulo.FECHAVTO;
      cantidadCell.innerHTML = articulo.STOCKEXISTENTE;
      if (articulo.STOCKEXISTENTE_F == undefined) {
        cantidadFCell.innerHTML = "----";
      } else {
        cantidadFCell.innerHTML = articulo.STOCKEXISTENTE_F;
      }
    })
  })

  LTextVto.addEventListener("click", () => {
    tabla.style.visibility = "visible"
    LTextVto.style.backgroundColor = "#44749d"
    LTextVto.style.color = "#ebe7e0"
    LTextVto.style.fontWeight = "bold"

  })
}



/////////////////////////////////////////LISTADOS///////////////////////////////////

function crearListados(total, totalVto, listadoResponse, listadoPrevioResponse) {
  const btnListadosAbrir = document.getElementById("btnListados")
  const btnListadosCerrar = document.getElementById("btnCerrar")
  const ventanaListados = document.getElementById("listados")
  const seleccionFiltros = document.getElementById("seleccionFiltros")
  const filtrosStock = document.getElementById("filtrosStock")
  const filtrosSector = document.getElementById("filtrosSector")
  const filtrosSectorProgramas = document.getElementById("filtrosProgramas")
  const filtrosVencimiento = document.getElementById("filtrosVencimiento")
  const filtrosVencimientoM = document.getElementById("filtrosVencimientoM")
  const filtrosVencimientoY = document.getElementById("filtrosVencimientoY")
  const filtrosVencimientoEFM = document.getElementById("filtrosVencimientoEFM")
  const filtrosVencimientoEFY = document.getElementById("filtrosVencimientoEFY")
  const btnSeleccionar = document.getElementById("btnSeleccionar")
  const tablaListados = document.getElementById("tablaListados")

  const diferencias = listadoResponse.filter((obj1) => {
    return listadoPrevioResponse.some((obj2) => {
      return obj1.CODARTICULO === obj2.CODARTICULO && obj1.STOCKENDEPOSITO != obj2.STOCKENDEPOSITO;
    });
  }).map((obj1) => {
    const obj2 = listadoPrevioResponse.find((obj) => obj.CODARTICULO === obj1.CODARTICULO);
    return {
      CODARTICULO: obj1.CODARTICULO,
      DESCRIPCION: obj1.DESCRIPCION,
      VALORANTERIOR: obj2.STOCKENDEPOSITO,
      VALORACTUAL: obj1.STOCKENDEPOSITO,
      DIFERENCIA: obj1.STOCKENDEPOSITO - obj2.STOCKENDEPOSITO,
    };
  });

  //--------------------------Abrir/Cerrar ventana Listados---------------------
  btnListadosAbrir.addEventListener("click", () => {
    ventanaListados.style.display = "inline"
  })

  btnListadosCerrar.addEventListener("click", () => {
    ventanaListados.style.display = "none"
  })

  //------------------------------Mostrar/Ocultar Selects-------------------------

  seleccionFiltros.addEventListener("change", (event) => {
    switch (event.target.selectedIndex) {
      //Stock
      case 1:
        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Estado</th><th>Stock</th></tr>";
        filtrosStock.style.display = "inline"
        filtrosSector.style.display = "none"
        filtrosSectorProgramas.style.display = "none"
        filtrosVencimiento.style.display = "none"
        filtrosVencimientoM.style.display = "none"
        filtrosVencimientoY.style.display = "none"
        filtrosVencimientoEFM.style.display = "none"
        filtrosVencimientoEFY.style.display = "none"
        btnSeleccionar.style.display = "none"
        break;
      //Servicio
      case 2:
        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Estado</th><th>Stock</th></tr>";
        filtrosStock.style.display = "none"
        filtrosSector.style.display = "inline"
        filtrosSectorProgramas.style.display = "none"
        filtrosVencimiento.style.display = "none"
        filtrosVencimientoM.style.display = "none"
        filtrosVencimientoY.style.display = "none"
        filtrosVencimientoEFM.style.display = "none"
        filtrosVencimientoEFY.style.display = "none"
        btnSeleccionar.style.display = "none"
        break;
      //Vencimiento
      case 3:
        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Lote</th><th>Vto</th><th>Cantidad</th></tr>";
        filtrosStock.style.display = "none"
        filtrosSector.style.display = "none"
        filtrosSectorProgramas.style.display = "none"
        filtrosVencimiento.style.display = "inline"
        filtrosVencimientoM.style.display = "none"
        filtrosVencimientoY.style.display = "none"
        filtrosVencimientoEFM.style.display = "none"
        filtrosVencimientoEFY.style.display = "none"
        btnSeleccionar.style.display = "none"
        break;
      //Ultimos cambios
      case 4:
        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Stock Anterior</th><th>Stock Actual</th><th>Diferencia</th></tr>";
        filtrosStock.style.display = "none"
        filtrosSector.style.display = "none"
        filtrosSectorProgramas.style.display = "none"
        filtrosVencimiento.style.display = "none"
        filtrosVencimientoM.style.display = "none"
        filtrosVencimientoY.style.display = "none"
        filtrosVencimientoEFM.style.display = "none"
        filtrosVencimientoEFY.style.display = "none"
        btnSeleccionar.style.display = "none"

        diferencias.forEach((articulo) => {

          if (articulo.DIFERENCIA >= 0 || articulo.VALORACTUAL == 0 ) {

            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const valorAnteriorCell = row.insertCell(2);
            const valorActualCell = row.insertCell(3);
            const diferenciaCell = row.insertCell(4)

            codigoCell.innerHTML = articulo.CODARTICULO;
            medicacionCell.innerHTML = articulo.DESCRIPCION;
            valorAnteriorCell.innerHTML = articulo.VALORANTERIOR;
            valorActualCell.innerHTML = articulo.VALORACTUAL;
            diferenciaCell.innerHTML = articulo.DIFERENCIA;
            diferenciaCell.style.fontWeight = "bold"

            if (articulo.DIFERENCIA > 0) {
              diferenciaCell.style.color = "green"
              medicacionCell.style.color = "green"
            } else {
              diferenciaCell.style.color = "red"
              medicacionCell.style.color = "red"
            }
          }
        })
        break;
    }
  })

  filtrosStock.addEventListener("change", (event) => {
    switch (event.target.selectedIndex) {
      //Listado Completo
      case 1:

        tablaListados.innerHTML = "<tr><th>Código</th><th>Medicación</th><th>Estado(Consumo)</th><th>Depósito</th><th>Farmacia</th></tr>";
        total.forEach((articulo) => {
          if (articulo.HABILITADO == "SI") {

            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const estadoCell = row.insertCell(2);
            const stockCell = row.insertCell(3);
            const stockFCell = row.insertCell(4)

            codigoCell.innerHTML = articulo.CODARTICULO;
            medicacionCell.innerHTML = articulo.MEDICACION;
            if (articulo.STOCKENDEPOSITO == 0) {
              estadoCell.innerHTML = "Agotado " + "(" + articulo.STOCK_MIN + ")";
              estadoCell.style.color = "black"
              estadoCell.style.fontWeight = "bold"
              codigoCell.style.fontWeight = "bold"
              medicacionCell.style.fontWeight = "bold"
              stockCell.style.fontWeight = "bold"
            } else if (articulo.STOCKENDEPOSITO >= articulo.STOCK_MIN * 2) {
              estadoCell.innerHTML = "Normal " + "(" + articulo.STOCK_MIN + ")";
              estadoCell.style.color = "green"
            } else if (articulo.STOCKENDEPOSITO > articulo.STOCK_MIN && articulo.STOCKENDEPOSITO < articulo.STOCK_MIN * 2) {
              estadoCell.innerHTML = "Mínimo " + "(" + articulo.STOCK_MIN + ")";;
              estadoCell.style.color = "orange"
              estadoCell.style.fontWeight = "bold"
              codigoCell.style.fontWeight = "bold"
              codigoCell.style.color = "orange"
              medicacionCell.style.fontWeight = "bold"
              medicacionCell.style.color = "orange"
              stockCell.style.fontWeight = "bold"
              stockCell.style.color = "orange"
            } else if (articulo.STOCKENDEPOSITO <= articulo.STOCK_MIN) {
              estadoCell.innerHTML = "Crítico " + "(" + articulo.STOCK_MIN + ")";;
              estadoCell.style.color = "red"
              estadoCell.style.fontWeight = "bold"
              codigoCell.style.fontWeight = "bold"
              codigoCell.style.color = "red"
              medicacionCell.style.fontWeight = "bold"
              medicacionCell.style.color = "red"
              stockCell.style.fontWeight = "bold"
              stockCell.style.color = "red"
            }
            stockCell.innerHTML = articulo.STOCKENDEPOSITO
            stockFCell.innerHTML = articulo.STOCKENDISPENSACION
          }

        })
        break;
      //Stock Critico
      case 2:

        tablaListados.innerHTML = "<tr><th>Código</th><th>Medicación</th><th>Estado(Consumo)</th><th>Stock</th></tr>";
        total.forEach((articulo) => {
          if (articulo.HABILITADO == "SI" && articulo.STOCKENDEPOSITO <= articulo.STOCK_MIN) {

            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const estadoCell = row.insertCell(2);
            const stockCell = row.insertCell(3);

            codigoCell.innerHTML = articulo.CODARTICULO;
            medicacionCell.innerHTML = articulo.MEDICACION;
            if (articulo.STOCKENDEPOSITO == 0) {
              estadoCell.innerHTML = "Agotado " + "(" + articulo.STOCK_MIN + ")";
              estadoCell.style.color = "black"
              estadoCell.style.fontWeight = "bold"
              codigoCell.style.fontWeight = "bold"
              medicacionCell.style.fontWeight = "bold"
              stockCell.style.fontWeight = "bold"
            } else if (articulo.STOCKENDEPOSITO >= articulo.STOCK_MIN * 2) {
              estadoCell.innerHTML = "Normal " + "(" + articulo.STOCK_MIN + ")";
              estadoCell.style.color = "green"
            } else if (articulo.STOCKENDEPOSITO > articulo.STOCK_MIN && articulo.STOCKENDEPOSITO < articulo.STOCK_MIN * 2) {
              estadoCell.innerHTML = "Mínimo " + "(" + articulo.STOCK_MIN + ")";;
              estadoCell.style.color = "orange"
              estadoCell.style.fontWeight = "bold"
              codigoCell.style.fontWeight = "bold"
              codigoCell.style.color = "orange"
              medicacionCell.style.fontWeight = "bold"
              medicacionCell.style.color = "orange"
              stockCell.style.fontWeight = "bold"
              stockCell.style.color = "orange"
            } else if (articulo.STOCKENDEPOSITO <= articulo.STOCK_MIN) {
              estadoCell.innerHTML = "Crítico " + "(" + articulo.STOCK_MIN + ")";;
              estadoCell.style.color = "red"
              estadoCell.style.fontWeight = "bold"
              codigoCell.style.fontWeight = "bold"
              codigoCell.style.color = "red"
              medicacionCell.style.fontWeight = "bold"
              medicacionCell.style.color = "red"
              stockCell.style.fontWeight = "bold"
              stockCell.style.color = "red"
            }
            stockCell.innerHTML = articulo.STOCKENDEPOSITO
          }

        })
        break;
      //Agotado
      case 3:

        tablaListados.innerHTML = "<tr><th>Código</th><th>Medicación</th><th>Estado(Consumo)</th><th>Stock</th></tr>";
        total.forEach((articulo) => {

          if (articulo.HABILITADO == "SI" && articulo.STOCKENDEPOSITO == 0) {

            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const estadoCell = row.insertCell(2);
            const stockCell = row.insertCell(3);

            codigoCell.innerHTML = articulo.CODARTICULO;
            medicacionCell.innerHTML = articulo.MEDICACION;
            if (articulo.STOCKENDEPOSITO == 0) {
              estadoCell.innerHTML = "Agotado " + "(" + articulo.STOCK_MIN + ")";
              estadoCell.style.color = "black"
              estadoCell.style.fontWeight = "bold"
              codigoCell.style.fontWeight = "bold"
              medicacionCell.style.fontWeight = "bold"
              stockCell.style.fontWeight = "bold"
            } else if (articulo.STOCKENDEPOSITO >= articulo.STOCK_MIN * 2) {
              estadoCell.innerHTML = "Normal " + "(" + articulo.STOCK_MIN + ")";
              estadoCell.style.color = "green"
            } else if (articulo.STOCKENDEPOSITO > articulo.STOCK_MIN && articulo.STOCKENDEPOSITO < articulo.STOCK_MIN * 2) {
              estadoCell.innerHTML = "Mínimo " + "(" + articulo.STOCK_MIN + ")";;
              estadoCell.style.color = "orange"
              estadoCell.style.fontWeight = "bold"
              codigoCell.style.fontWeight = "bold"
              codigoCell.style.color = "orange"
              medicacionCell.style.fontWeight = "bold"
              medicacionCell.style.color = "orange"
              stockCell.style.fontWeight = "bold"
              stockCell.style.color = "orange"
            } else if (articulo.STOCKENDEPOSITO <= articulo.STOCK_MIN) {
              estadoCell.innerHTML = "Crítico " + "(" + articulo.STOCK_MIN + ")";;
              estadoCell.style.color = "red"
              estadoCell.style.fontWeight = "bold"
              codigoCell.style.fontWeight = "bold"
              codigoCell.style.color = "red"
              medicacionCell.style.fontWeight = "bold"
              medicacionCell.style.color = "red"
              stockCell.style.fontWeight = "bold"
              stockCell.style.color = "red"
            }
            stockCell.innerHTML = articulo.STOCKENDEPOSITO
          }

        })
        break;
      //Control
      case 4:
        console.log(total)
        tablaListados.innerHTML = "<tr><th>Código</th><th>Medicación</th><th>Estado(Consumo)</th><th>Stock</th></tr>";
        total.forEach((articulo) => {
          if (articulo.PRIORIDAD == 1) {
            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const estadoCell = row.insertCell(2);
            const stockCell = row.insertCell(3);

            codigoCell.innerHTML = articulo.CODARTICULO;
            medicacionCell.innerHTML = articulo.MEDICACION;
            if (articulo.STOCKENDEPOSITO == 0) {
              estadoCell.innerHTML = "Agotado " + "(" + articulo.STOCK_MIN + ")";
              estadoCell.style.color = "black"
              estadoCell.style.fontWeight = "bold"
              codigoCell.style.fontWeight = "bold"
              medicacionCell.style.fontWeight = "bold"
              stockCell.style.fontWeight = "bold"
            } else if (articulo.STOCKENDEPOSITO >= articulo.STOCK_MIN * 2) {
              estadoCell.innerHTML = "Normal " + "(" + articulo.STOCK_MIN + ")";
              estadoCell.style.color = "green"
            } else if (articulo.STOCKENDEPOSITO > articulo.STOCK_MIN && articulo.STOCKENDEPOSITO < articulo.STOCK_MIN * 2) {
              estadoCell.innerHTML = "Mínimo " + "(" + articulo.STOCK_MIN + ")";;
              estadoCell.style.color = "orange"
              estadoCell.style.fontWeight = "bold"
              codigoCell.style.fontWeight = "bold"
              codigoCell.style.color = "orange"
              medicacionCell.style.fontWeight = "bold"
              medicacionCell.style.color = "orange"
              stockCell.style.fontWeight = "bold"
              stockCell.style.color = "orange"
            } else if (articulo.STOCKENDEPOSITO <= articulo.STOCK_MIN) {
              estadoCell.innerHTML = "Crítico " + "(" + articulo.STOCK_MIN + ")";;
              estadoCell.style.color = "red"
              estadoCell.style.fontWeight = "bold"
              codigoCell.style.fontWeight = "bold"
              codigoCell.style.color = "red"
              medicacionCell.style.fontWeight = "bold"
              medicacionCell.style.color = "red"
              stockCell.style.fontWeight = "bold"
              stockCell.style.color = "red"
            }
            stockCell.innerHTML = articulo.STOCKENDEPOSITO
          }

        })
        break;

      //Completo sin filtrar

      case 5:
        tablaListados.innerHTML = "<tr><th>Código</th><th>Medicación</th><th>Depósito</th><th>Farmacia</th></tr>";
        listadoResponse.forEach((articulo) => {
          const row = tablaListados.insertRow();
          const codigoCell = row.insertCell(0);
          const medicacionCell = row.insertCell(1);
          const stockCell = row.insertCell(2);
          const stockFCell = row.insertCell(3)

          codigoCell.innerHTML = articulo.CODARTICULO;
          medicacionCell.innerHTML = articulo.DESCRIPCION;
          stockCell.innerHTML = articulo.STOCKENDEPOSITO
          stockFCell.innerHTML = articulo.STOCKENDISPENSACION

        })
        break;


    }
  })

  filtrosSector.addEventListener("change", (event) => {
    switch (event.target.selectedIndex) {
      //Esterilizacion
      case 1:

        filtrosSectorProgramas.style.display = "none"
        tablaListados.innerHTML = "<tr><th>Código</th><th>Medicación</th><th>Estado</th><th>Stock</th></tr>";
        total.forEach((articulo) => {
          if (articulo.SERVICIO == "ESTERILIZACION") {
            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const estadoCell = row.insertCell(2);
            const stockCell = row.insertCell(3);

            codigoCell.innerHTML = articulo.CODARTICULO;
            medicacionCell.innerHTML = articulo.MEDICACION;
            estadoCell.innerHTML = "-----";
            if (articulo.STOCKENDEPOSITO == 0) {
              estadoCell.innerHTML = "Agotado";
              estadoCell.style.color = "black"
            } else if (articulo.STOCKENDEPOSITO >= articulo.STOCK_MIN * 2) {
              estadoCell.innerHTML = "Normal";
              estadoCell.style.color = "green"
            } else if (articulo.STOCKENDEPOSITO <= articulo.STOCK_MIN) {
              estadoCell.innerHTML = "Critico";
              estadoCell.style.color = "red"
            }
            stockCell.innerHTML = articulo.STOCKENDEPOSITO
          }

        })
        break;
      //Alimentacion
      case 2:

        filtrosSectorProgramas.style.display = "none"
        tablaListados.innerHTML = "<tr><th>Código</th><th>Medicación</th><th>Estado</th><th>Stock</th></tr>";
        total.forEach((articulo) => {
          if (articulo.SERVICIO == "ALIMENTACION") {
            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const estadoCell = row.insertCell(2);
            const stockCell = row.insertCell(3);

            codigoCell.innerHTML = articulo.CODARTICULO;
            medicacionCell.innerHTML = articulo.MEDICACION;
            estadoCell.innerHTML = "-----";
            if (articulo.STOCKENDEPOSITO == 0) {
              estadoCell.innerHTML = "Agotado";
              estadoCell.style.color = "black"
            } else if (articulo.STOCKENDEPOSITO >= articulo.STOCK_MIN * 2) {
              estadoCell.innerHTML = "Normal";
              estadoCell.style.color = "green"
            } else if (articulo.STOCKENDEPOSITO <= articulo.STOCK_MIN) {
              estadoCell.innerHTML = "Critico";
              estadoCell.style.color = "red"
            }
            stockCell.innerHTML = articulo.STOCKENDEPOSITO
          }

        })
        break;
      //Sueros
      case 3:

        filtrosSectorProgramas.style.display = "none"
        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Estado</th><th>Stock</th></tr>";
        total.forEach((articulo) => {
          if (articulo.SERVICIO == "SUEROS") {
            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const estadoCell = row.insertCell(2);
            const stockCell = row.insertCell(3);

            codigoCell.innerHTML = articulo.CODARTICULO;
            medicacionCell.innerHTML = articulo.MEDICACION;
            estadoCell.innerHTML = "-----";
            if (articulo.STOCKENDEPOSITO == 0) {
              estadoCell.innerHTML = "Agotado";
              estadoCell.style.color = "black"
            } else if (articulo.STOCKENDEPOSITO >= articulo.STOCK_MIN * 2) {
              estadoCell.innerHTML = "Normal";
              estadoCell.style.color = "green"
            } else if (articulo.STOCKENDEPOSITO <= articulo.STOCK_MIN) {
              estadoCell.innerHTML = "Critico";
              estadoCell.style.color = "red"
            }
            stockCell.innerHTML = articulo.STOCKENDEPOSITO
          }

        })
        break;
      //Programas
      case 4:

        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Estado</th><th>Stock</th></tr>";
        filtrosSectorProgramas.style.display = "inline"
        filtrosSectorProgramas.addEventListener("change", (event) => {
          switch (event.target.selectedIndex) {
            case 1:
              tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Estado</th><th>Stock</th></tr>";
              total.forEach((articulo) => {
                if (articulo.SERVICIO == "PROEPI") {
                  const row = tablaListados.insertRow();
                  const codigoCell = row.insertCell(0);
                  const medicacionCell = row.insertCell(1);
                  const estadoCell = row.insertCell(2);
                  const stockCell = row.insertCell(3);

                  codigoCell.innerHTML = articulo.CODARTICULO;
                  medicacionCell.innerHTML = articulo.MEDICACION;
                  estadoCell.innerHTML = "-----";
                  if (articulo.STOCKENDEPOSITO == 0) {
                    estadoCell.innerHTML = "Agotado";
                    estadoCell.style.color = "black"
                  } else if (articulo.STOCKENDEPOSITO >= articulo.STOCK_MIN * 2) {
                    estadoCell.innerHTML = "Normal";
                    estadoCell.style.color = "green"
                  } else if (articulo.STOCKENDEPOSITO <= articulo.STOCK_MIN) {
                    estadoCell.innerHTML = "Critico";
                    estadoCell.style.color = "red"
                  }
                  stockCell.innerHTML = articulo.STOCKENDEPOSITO
                }

              })
              break;

            case 2:
              tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Estado</th><th>Stock</th></tr>";
              total.forEach((articulo) => {
                if (articulo.SERVICIO == "TBC") {
                  const row = tablaListados.insertRow();
                  const codigoCell = row.insertCell(0);
                  const medicacionCell = row.insertCell(1);
                  const estadoCell = row.insertCell(2);
                  const stockCell = row.insertCell(3);

                  codigoCell.innerHTML = articulo.CODARTICULO;
                  medicacionCell.innerHTML = articulo.MEDICACION;
                  estadoCell.innerHTML = "-----";
                  if (articulo.STOCKENDISPENSACION == 0) {
                    estadoCell.innerHTML = "Agotado";
                    estadoCell.style.color = "black"
                  } else if (articulo.STOCKENDISPENSACION >= articulo.STOCK_MIN * 2) {
                    estadoCell.innerHTML = "Normal";
                    estadoCell.style.color = "green"
                  } else if (articulo.STOCKENDISPENSACION <= articulo.STOCK_MIN) {
                    estadoCell.innerHTML = "Critico";
                    estadoCell.style.color = "red"
                  }
                  stockCell.innerHTML = articulo.STOCKENDISPENSACION
                }

              })
              break;

            case 3:
              tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Estado</th><th>Stock</th></tr>";
              total.forEach((articulo) => {
                if (articulo.SERVICIO == "HIV") {
                  const row = tablaListados.insertRow();
                  const codigoCell = row.insertCell(0);
                  const medicacionCell = row.insertCell(1);
                  const estadoCell = row.insertCell(2);
                  const stockCell = row.insertCell(3);

                  codigoCell.innerHTML = articulo.CODARTICULO;
                  medicacionCell.innerHTML = articulo.MEDICACION;
                  estadoCell.innerHTML = "-----";
                  if (articulo.STOCKENDISPENSACION == 0) {
                    estadoCell.innerHTML = "Agotado";
                    estadoCell.style.color = "black"
                  } else if (articulo.STOCKENDISPENSACION >= articulo.STOCK_MIN * 2) {
                    estadoCell.innerHTML = "Normal";
                    estadoCell.style.color = "green"
                  } else if (articulo.STOCKENDISPENSACION <= articulo.STOCK_MIN) {
                    estadoCell.innerHTML = "Critico";
                    estadoCell.style.color = "red"
                  }
                  stockCell.innerHTML = articulo.STOCKENDISPENSACION
                }

              })
              break;
          }
        })
        break;

    }
  })

  filtrosVencimiento.addEventListener("change", (event) => {
    data = [];
    switch (event.target.selectedIndex) {
      //Lista completa
      case 1:
        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicación</th><th>Lote</th><th>Vto</th><th>Deposito</th><th>Farmacia</th><th>Consumo</th></tr>";
        btnSeleccionar.style.display = "none"
        filtrosVencimientoM.style.display = "none"
        filtrosVencimientoY.style.display = "none"
        totalVto.forEach((articulo) => {
          const row = tablaListados.insertRow();
          const codigoCell = row.insertCell(0);
          const medicacionCell = row.insertCell(1);
          const loteCell = row.insertCell(2);
          const vtoCell = row.insertCell(3);
          const cantidadCell = row.insertCell(4);
          const cantidadFCell = row.insertCell(5);
          const StockMinCell = row.insertCell(6);

          codigoCell.innerHTML = articulo.CODARTICULO;
          if (articulo.CONCENTRACION == undefined) {
            medicacionCell.innerHTML = articulo.NOMBREGENERICO + " - " + articulo.FORMA;
          } else {
            medicacionCell.innerHTML = articulo.NOMBREGENERICO + " - " + articulo.CONCENTRACION + " - " + articulo.FORMA;
          }
          loteCell.innerHTML = articulo.NROLOTE
          vtoCell.innerHTML = articulo.FECHAVTO
          cantidadCell.innerHTML = articulo.STOCKEXISTENTE

          if (articulo.STOCKEXISTENTE_F == undefined) {
            cantidadFCell.innerHTML = "-----"
          }
          else {
            cantidadFCell.innerHTML = articulo.STOCKEXISTENTE_F
          }

          if (articulo.STOCK_MIN == undefined || articulo.STOCK_MIN == "undefined") {
            StockMinCell.innerHTML = "-----"
          }
          else {
            StockMinCell.innerHTML = articulo.STOCK_MIN
          }

        })
        break;
      //Mes
      case 2:
        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicación</th><th>Lote</th><th>Vto</th><th>Deposito</th><th>Farmacia</th><th>Consumo</th></tr>";
        filtrosVencimientoM.style.display = "inline"
        filtrosVencimientoY.style.display = "inline"
        filtrosVencimientoEFM.style.display = "none"
        filtrosVencimientoEFY.style.display = "none"
        btnSeleccionar.style.display = "inline"

        btnSeleccionar.addEventListener('click', () => {

          tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicación</th><th>Lote</th><th>Vto</th><th>Deposito</th><th>Farmacia</th><th>Consumo</th></tr>";
          const fechaBtn = filtrosVencimientoM.value + filtrosVencimientoY.value
          const fechaElegida = totalVto.filter((match) => {
            const fechaSep = match.FECHAVTO.split("/")
            const fechaConv = fechaSep[0] + "/" + fechaSep[1] + "/" + fechaSep[2]
            return fechaConv === fechaBtn
          })

          fechaElegida.forEach((articulo) => {
            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const loteCell = row.insertCell(2);
            const vtoCell = row.insertCell(3);
            const cantidadCell = row.insertCell(4);
            const cantidadFCell = row.insertCell(5);
            const StockMinCell = row.insertCell(6);

            codigoCell.innerHTML = articulo.CODARTICULO;
            if (articulo.CONCENTRACION == undefined) {
              medicacionCell.innerHTML = articulo.NOMBREGENERICO + " - " + articulo.FORMA;
            } else {
              medicacionCell.innerHTML = articulo.NOMBREGENERICO + " - " + articulo.CONCENTRACION + " - " + articulo.FORMA;
            }
            loteCell.innerHTML = articulo.NROLOTE
            vtoCell.innerHTML = articulo.FECHAVTO
            cantidadCell.innerHTML = articulo.STOCKEXISTENTE
            if (articulo.STOCKEXISTENTE_F == undefined) {
              cantidadFCell.innerHTML = "-----"
            }
            else {
              cantidadFCell.innerHTML = articulo.STOCKEXISTENTE_F
            }

            if (articulo.STOCK_MIN == undefined || articulo.STOCK_MIN == "undefined") {
              StockMinCell.innerHTML = "-----"
            }
            else {
              StockMinCell.innerHTML = articulo.STOCK_MIN
            }

          })
        })
        break;
      //Entre fechas
      case 3:
        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicación</th><th>Lote</th><th>Vto</th><th>Deposito</th><th>Farmacia</th><th>Consumo</th></tr>";
        filtrosVencimientoM.style.display = "inline"
        filtrosVencimientoY.style.display = "inline"
        filtrosVencimientoEFM.style.display = "inline"
        filtrosVencimientoEFY.style.display = "inline"
        btnSeleccionar.style.display = "inline"

        btnSeleccionar.addEventListener('click', () => {

          tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicación</th><th>Lote</th><th>Vto</th><th>Deposito</th><th>Farmacia</th><th>Consumo</th></tr>";
          const fechaElegida = totalVto.filter(match => {
            const fechaInicial = filtrosVencimientoM.value + filtrosVencimientoY.value
            const fiSeparada = fechaInicial.split("/")
            const fechaInicialP = new Date(fiSeparada[2] + "/" + fiSeparada[1] + "/" + fiSeparada[0])
            const fechaFinal = filtrosVencimientoEFM.value + filtrosVencimientoEFY.value
            const ffSeparada = fechaFinal.split("/")
            const fechaFinalP = new Date(ffSeparada[2] + "/" + ffSeparada[1] + "/" + ffSeparada[0])
            const fVtoS = match.FECHAVTO.split("/")
            const fVto = new Date(fVtoS[2] + "/" + fVtoS[1] + "/" + fVtoS[0])
            return fVto >= fechaInicialP && fVto <= fechaFinalP
          })

          fechaElegida.forEach((articulo) => {
            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const loteCell = row.insertCell(2);
            const vtoCell = row.insertCell(3);
            const cantidadCell = row.insertCell(4);
            const cantidadFCell = row.insertCell(5);
            const StockMinCell = row.insertCell(6);

            codigoCell.innerHTML = articulo.CODARTICULO;
            if (articulo.CONCENTRACION == undefined) {
              medicacionCell.innerHTML = articulo.NOMBREGENERICO + " - " + articulo.FORMA;
            } else {
              medicacionCell.innerHTML = articulo.NOMBREGENERICO + " - " + articulo.CONCENTRACION + " - " + articulo.FORMA;
            }
            loteCell.innerHTML = articulo.NROLOTE
            vtoCell.innerHTML = articulo.FECHAVTO
            cantidadCell.innerHTML = articulo.STOCKEXISTENTE
            if (articulo.STOCKEXISTENTE_F == undefined) {
              cantidadFCell.innerHTML = "-----"
            }
            else {
              cantidadFCell.innerHTML = articulo.STOCKEXISTENTE_F
            }

            if (articulo.STOCK_MIN == undefined || articulo.STOCK_MIN == "undefined") {
              StockMinCell.innerHTML = "-----"
            }
            else {
              StockMinCell.innerHTML = articulo.STOCK_MIN
            }

          })

        })
        break;
    }
  })

  //--------------------------- BOTON DESCARGAS--------------------------------

  btnDescargar.addEventListener("click", () => {
    const tablaListados = document.getElementById("tablaListados")
    const tablaHTML = tablaListados.outerHTML
    const blob = new Blob([tablaHTML], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const date = new Date();
    saveAs(blob, 'listado_' + date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + '.xls');
  })

  //--------------------------- EXTRAS--------------------------------

  const navidad = document.getElementById("navidad")
  const navidadBtn = document.getElementById("navidadBtn")
  const navidadOpen = document.getElementById("navidadOpen")
  
  navidadOpen.addEventListener("click", () => {
    // navidad.style.display ="flex"
  })

  navidadBtn.addEventListener("click", () => {
    navidad.style.display ="none"
  })


}

