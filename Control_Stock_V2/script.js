let datos;
function cargarArchivo() {
    const input = document.getElementById('archivo');
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        const data = reader.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet_name_list = workbook.SheetNames;
        const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        datos = JSON.stringify(json);
        // Aquí puedes trabajar con los datos en formato JSON en la variable "json"
        for (const articulos of json) {
            if (articulos.DESCRIPCION != "ANULAR") {
                const newOption = document.createElement("option");
                const lista = document.getElementById('medicacion');
                const atribValue = document.createAttribute("value");
                atribValue.value = articulos.DESCRIPCION;
                newOption.setAttributeNode(atribValue);
                lista.appendChild(newOption);
                
            }
        }
    };
    reader.readAsBinaryString(file);
}



function elegir() {
    // console.log(datos);
    let articulo = document.getElementById('listaArt');
    let lista = document.getElementById('medicacion');
    let articulos = JSON.parse(datos);
    
        let valor = articulo.value;
        for (let i = 0; i < lista.options.length; i++) {
          if (lista.options[i].value === valor) {
            console.log(articulos[i]);
            document.getElementById('codArt').innerText = articulos[i].CODARTICULO;
            document.getElementById('cantDepo').innerText = articulos[i].STOCKENDEPOSITO;
            document.getElementById('cantFarm').innerText = articulos[i].STOCKENDISPENSACION;
            break;
          }
        }

    
}

function borrar() {
    document.getElementById('listaArt').value = "";
    document.getElementById('codArt').innerText = "";
    document.getElementById('cantDepo').innerText = "";
    document.getElementById('cantFarm').innerText = "";
}