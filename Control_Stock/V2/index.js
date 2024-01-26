document.addEventListener('DOMContentLoaded', function () {
  cargarDatos();
});

async function cargarDatos() {
  const db = await fetch("./data/DB.json");
  const dbResponse = await db.json();
  const listado = await fetch("../data/stock.json");
  const listadoResponse = await listado.json();
  const vto = await fetch("../data/vto.json")
  const listadoVto = await vto.json();

  generarTotal(dbResponse, listadoResponse, listadoVto);
  menubar();

}

///////////////////////////////////////MENU/////////////////////////////////////////

function menubar() {
  menu = document.getElementById("menu")
  menu.addEventListener("click", () => {
    alert("Esto hará algo en un futuro..")
  })
}

//////////////////////////////////GENERANDO TOTAL///////////////////////////////////

function generarTotal(dbResponse, listadoResponse, listadoVto) {
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

  filtrarDatos(total);
  seleccionarArticulo(total, listadoVto)
  crearListados(total, listadoVto);
}

///////////////////////////////////FILTRANDO DATOS//////////////////////////////////

function filtrarDatos(total) {
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
      tabla.innerHTML = "<tr><th>Lote</th><th>Vencimiento</th><th>Cantidad</th></tr>";
      total.forEach((item) => {
        if (item.HABILITADO == "SI") {
          const newOption = document.createElement("option");
          const atribValue = document.createAttribute("value");
          atribValue.value = item.MEDICACION;
          newOption.setAttributeNode(atribValue);
          datalist.appendChild(newOption);
        }
      });
    }
  });

  //--------------------------Filtro por Codigo ministerial---------------------

  filtroCm.addEventListener("change", () => {
    borrar.click();
    if (filtroCm.checked) {
      datalist.innerHTML = "";
      entrada.value = "";
      tabla.innerHTML = "<tr><th>Lote</th><th>Vencimiento</th><th>Cantidad</th></tr>";
      total.forEach((item) => {
        if (item.HABILITADO == "SI") {
          const newOption = document.createElement("option");
          const atribValue = document.createAttribute("value");
          atribValue.value = item.CODARTICULO;
          newOption.setAttributeNode(atribValue);
          datalist.appendChild(newOption);
        }
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
    tabla.innerHTML = "<tr><th>Lote</th><th>Vencimiento</th><th>Cantidad</th></tr>";
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

function seleccionarArticulo(total, listadoVto) {
  const entrada = document.getElementById("entrada");
  const nomArticulo = document.getElementById("nombreArticulo");
  const codMinisterial = document.getElementById("codMinisterial");
  const stockDeposito = document.getElementById("stockDeposito");
  const estadoStock = document.getElementById("estadoStock")
  const consumo = document.getElementById("consumo")

  const tabla = document.getElementById("tabla");

  entrada.addEventListener('change', () => {

    //--------------------------Filtrar un articulo---------------------

    const articuloEncontrado = total.find((match) => match.MEDICACION === entrada.value || match.CODARTICULO === entrada.value)
    nomArticulo.textContent = articuloEncontrado.MEDICACION + " - (" + articuloEncontrado.SERVICIO + ")"
    codMinisterial.textContent = articuloEncontrado.CODARTICULO
    if (articuloEncontrado.SERVICIO == "DESPACHO" || articuloEncontrado.SERVICIO == "PROEPI") {
      stockDeposito.textContent = articuloEncontrado.STOCKENDEPOSITO
    } else {

      stockDeposito.textContent = articuloEncontrado.STOCKENDISPENSACION
    }
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

    //--------------------------Tabla de vencimientos---------------------

    const filtroArtVto = listadoVto.filter((match) => {
      return articuloEncontrado.CODARTICULO === match.CODARTICULO
    })

    tabla.innerHTML = "<tr><th>Lote</th><th>Vencimiento</th><th>Cantidad</th></tr>";
    filtroArtVto.forEach((articulo) => {
      const row = tabla.insertRow();
      const loteCell = row.insertCell(0);
      const vencimientoCell = row.insertCell(1);
      const cantidadCell = row.insertCell(2);

      loteCell.innerHTML = articulo.NROLOTE;
      vencimientoCell.innerHTML = articulo.FECHAVTO;
      cantidadCell.innerHTML = articulo.STOCKEXISTENTE;
    })
  })
}

/////////////////////////////////////////LISTADOS///////////////////////////////////

function crearListados(total, listadoVto) {
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
    }

  })

  filtrosStock.addEventListener("change", (event) => {
    switch (event.target.selectedIndex) {
      //Listado Completo
      case 1:

        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Estado</th><th>Stock</th></tr>";
        total.forEach((articulo) => {
          if (articulo.HABILITADO == "SI") {
            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const estadoCell = row.insertCell(2);
            const stockCell = row.insertCell(3);

            codigoCell.innerHTML = articulo.CODARTICULO;
            medicacionCell.innerHTML = articulo.MEDICACION;
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
          data.push(articulo)
        })
        break;
      //Stock Critico
      case 2:

        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Consumo</th><th>Stock</th></tr>";
        total.forEach((articulo) => {
          if (articulo.HABILITADO == "SI" && articulo.STOCKENDEPOSITO <= articulo.STOCK_MIN) {
            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const consumoCell = row.insertCell(2);
            const stockCell = row.insertCell(3);

            codigoCell.innerHTML = articulo.CODARTICULO;

            medicacionCell.innerHTML = articulo.MEDICACION;
            consumoCell.innerHTML = articulo.STOCK_MIN
            if (articulo.STOCKENDEPOSITO == 0) {
              stockCell.style.color = "black"
            } else if (articulo.STOCKENDEPOSITO >= articulo.STOCK_MIN * 2) {
              stockCell.style.color = "green"
            } else if (articulo.STOCKENDEPOSITO <= articulo.STOCK_MIN) {
              stockCell.style.color = "red"
            }
            stockCell.innerHTML = articulo.STOCKENDEPOSITO
          }
          data.push(articulo)
        })
        break;
      //Agotado
      case 3:

        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Estado</th><th>Stock</th></tr>";
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
          data.push(articulo)
        })
        break;
    }
  })

  filtrosSector.addEventListener("change", (event) => {
    switch (event.target.selectedIndex) {
      //Esterilizacion
      case 1:

        filtrosSectorProgramas.style.display = "none"
        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Estado</th><th>Stock</th></tr>";
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
          data.push(articulo)
        })
        break;
      //Alimentacion
      case 2:

        filtrosSectorProgramas.style.display = "none"
        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Estado</th><th>Stock</th></tr>";
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
          data.push(articulo)
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
          data.push(articulo)
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
        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Lote</th><th>Vto</th><th>Cantidad</th></tr>";
        btnSeleccionar.style.display = "none"
        filtrosVencimientoM.style.display = "none"
        filtrosVencimientoY.style.display = "none"
        listadoVto.forEach((articulo) => {
          const row = tablaListados.insertRow();
          const codigoCell = row.insertCell(0);
          const medicacionCell = row.insertCell(1);
          const loteCell = row.insertCell(2);
          const vtoCell = row.insertCell(3);
          const cantidadCell = row.insertCell(4);

          codigoCell.innerHTML = articulo.CODARTICULO;
          medicacionCell.innerHTML = articulo.NOMBREGENERICO;
          loteCell.innerHTML = articulo.NROLOTE
          vtoCell.innerHTML = articulo.FECHAVTO
          cantidadCell.innerHTML = articulo.STOCKEXISTENTE
          data.push(articulo)
        })
        break;
      //Mes
      case 2:
        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Lote</th><th>Vto</th><th>Cantidad</th></tr>";
        filtrosVencimientoM.style.display = "inline"
        filtrosVencimientoY.style.display = "inline"
        filtrosVencimientoEFM.style.display = "none"
        filtrosVencimientoEFY.style.display = "none"
        btnSeleccionar.style.display = "inline"

        btnSeleccionar.addEventListener('click', () => {

          tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Lote</th><th>Vto</th><th>Cantidad</th></tr>";
          const fechaBtn = filtrosVencimientoM.value + filtrosVencimientoY.value
          console.log(listadoVto)
          const fechaElegida = listadoVto.filter((match) => {
            const fechaSep = match.FECHAVTO.split("/")
            const fechaConv = fechaSep[0] + "-" + fechaSep[1] + "-" + fechaSep[2]
            return fechaConv === fechaBtn
          })

          fechaElegida.forEach((articulo) => {
            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const loteCell = row.insertCell(2);
            const vtoCell = row.insertCell(3);
            const cantidadCell = row.insertCell(4);

            codigoCell.innerHTML = articulo.CODARTICULO;
            if (articulo.CONCENTRACION == undefined) {
              medicacionCell.innerHTML = articulo.NOMBREGENERICO + " - " + articulo.FORMA;
            } else {
              medicacionCell.innerHTML = articulo.NOMBREGENERICO + " - " + articulo.CONCENTRACION + " - " + articulo.FORMA;
            }
            loteCell.innerHTML = articulo.NROLOTE
            vtoCell.innerHTML = articulo.FECHAVTO
            cantidadCell.innerHTML = articulo.STOCKEXISTENTE

          })
        })
        break;
      //Entre fechas
      case 3:
        tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Lote</th><th>Vto</th><th>Cantidad</th></tr>";
        filtrosVencimientoM.style.display = "inline"
        filtrosVencimientoY.style.display = "inline"
        filtrosVencimientoEFM.style.display = "inline"
        filtrosVencimientoEFY.style.display = "inline"
        btnSeleccionar.style.display = "inline"

        btnSeleccionar.addEventListener('click', () => {

          tablaListados.innerHTML = "<tr><th>Codigo</th><th>Medicacion</th><th>Lote</th><th>Vto</th><th>Cantidad</th></tr>";
          const fechaElegida = listadoVto.filter(match => {
            const fechaInicial = filtrosVencimientoM.value + filtrosVencimientoY.value
            const fiSeparada = fechaInicial.split("-")
            const fechaInicialP = new Date(fiSeparada[2] + "-" + fiSeparada[1] + "-" + fiSeparada[0])
            const fechaFinal = filtrosVencimientoEFM.value + filtrosVencimientoEFY.value
            const ffSeparada = fechaFinal.split("-")
            const fechaFinalP = new Date(ffSeparada[2] + "-" + ffSeparada[1] + "-" + ffSeparada[0])
            const fVtoS = match.FECHAVTO.split("/")
            const fVto = new Date(fVtoS[2] + "-" + fVtoS[1] + "-" + fVtoS[0])
            return fVto >= fechaInicialP && fVto <= fechaFinalP
          })

          fechaElegida.forEach((articulo) => {
            const row = tablaListados.insertRow();
            const codigoCell = row.insertCell(0);
            const medicacionCell = row.insertCell(1);
            const loteCell = row.insertCell(2);
            const vtoCell = row.insertCell(3);
            const cantidadCell = row.insertCell(4);

            codigoCell.innerHTML = articulo.CODARTICULO;
            if (articulo.CONCENTRACION == undefined) {
              medicacionCell.innerHTML = articulo.NOMBREGENERICO + " - " + articulo.FORMA;
            } else {
              medicacionCell.innerHTML = articulo.NOMBREGENERICO + " - " + articulo.CONCENTRACION + " - " + articulo.FORMA;
            }
            loteCell.innerHTML = articulo.NROLOTE
            vtoCell.innerHTML = articulo.FECHAVTO
            cantidadCell.innerHTML = articulo.STOCKEXISTENTE

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
    saveAs(blob, 'tabla.xls');
  })
}