const medicacion = [
    {
      articulo : "Midazolam",
      presentacion :  "Ampolla",
      concentracion : 5,
      contenido : 3,
      baxter : 250,
      cantidad : 20
    },
    {
      articulo : "Fentanilo",
      presentacion :  "Ampolla",
      concentracion : 0.05,
      contenido : 5,
      baxter : 100,
      cantidad : 10
     },
     {
      articulo : "Remifentanilo",
      presentacion :  "Frasco-Ampolla",
      concentracion : 5,
      contenido : 0,
      baxter : 200,
      cantidad : 4
     },
    ];

    function cargar() {
      document.getElementById('lista').value = "";
      document.getElementById('baxter').value = "";
      const elegir = document.querySelectorAll("#lista option");
      for (i = 0 ; i < elegir.length ; i++) {
        elegir[i].text = medicacion[i].articulo;
      }


    }

  function cambiar() {
    var valor = document.getElementById('lista').value;
    document.getElementById('presentacion').innerHTML = medicacion[valor].presentacion;
    document.getElementById('concentracion').innerHTML = medicacion[valor].concentracion;
    document.getElementById('contenido').innerHTML = medicacion[valor].contenido;
    document.getElementById('baxter').value = medicacion[valor].baxter;
    document.getElementById('cAmp').value = medicacion[valor].cantidad;
    
    let aux = document.getElementById('lista').value;
    let btnAux = document.getElementById('btnCalcular');
    let etiquetaElegir = document.getElementById('elegirTxt');
    if (aux != "") {
      btnAux.disabled = false;
      etiquetaElegir.style.display = "none";
    }
  }

  function sumar() {
      let ampollas = document.getElementById('cAmp').value;
        document.getElementById('cAmp').value = Number(ampollas) + 10;
    }

  function restar() {
      let ampollas = document.getElementById('cAmp').value;
      if (ampollas > 0) {
        document.getElementById('cAmp').value = Number(ampollas) - 10;
      }
  }

  function calcular() {
      let goteo = document.getElementById('goteo').value;
      let baxter = document.getElementById('baxter').value;
      let cAmp = document.getElementById('cAmp').value;
      let presentacion = document.getElementById('presentacion').innerText;
      let contenido = document.getElementById('contenido').innerText;

      let baxterTotal = Math.ceil((goteo * 24) / ((Number(baxter)) + (Number(cAmp) * Number(contenido))));
      let ampTotal = baxterTotal * Number(cAmp);

      // console.log(goteo * 24);
      // console.log((Number(baxter) + (Number(cAmp) * Number(contenido))));
      // console.log(ampTotal);

    let msjFinal = "Se utilizaran " + baxterTotal + " baxter,\n enviar " + ampTotal + " " +presentacion+"s";
    document.getElementById('resultado').innerText = msjFinal;
  }