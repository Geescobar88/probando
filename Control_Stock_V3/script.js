let datos;
let articulos;
let listado;
function cargarArchivo() {
  const input = document.getElementById('archivo');
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    const data = reader.result;
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheet_name_list = workbook.SheetNames;
    const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    if (json != []) {
    alert("Stock cargado correctamente");}
    datos = JSON.stringify(json);
    articulos = JSON.parse(datos);
    const listado = Object.values(articulos).map(item => item.DESCRIPCION)
    autocomplete(document.getElementById("listaArt"), listado);
  };
  reader.readAsBinaryString(file);
}

function buscar() {
  let articulo = document.getElementById('listaArt').value;
  for (i = 0; i < articulos.length; i++) {
    if (articulo == articulos[i].DESCRIPCION) {
      document.getElementById('codArt').innerText = articulos[i].CODARTICULO;
      document.getElementById('cantDepo').innerText = articulos[i].STOCKENDEPOSITO;
      document.getElementById('cantFarm').innerText = articulos[i].STOCKENDISPENSACION;
    }
  }
}

function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocompletar-list");
    a.setAttribute("class", "autocompletar-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function (e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });

  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocompletar-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) { //up
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  inp.addEventListener("dblclick", () => {
    const borrar = document.getElementById("listaArt");
    borrar.value = "";
  })


  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocompletar-active");
  }

  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocompletar-active");
    }
  }

  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocompletar-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}