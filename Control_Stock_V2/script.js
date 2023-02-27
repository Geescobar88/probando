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
        datos = json;
        // Aquí puedes trabajar con los datos en formato JSON en la variable "json"
        for (const articulos of json) {
            if (articulos.DESCRIPCION != "ANULAR") {
                const newOption = document.createElement("option");
                const lista = document.getElementById('medicacion');
                const atribId = document.createAttribute("id");
                const i = articulos.DESCRIPCION;
                atribId.value = "option" + i;
                const atribValue = document.createAttribute("value");
                atribValue.value = articulos.DESCRIPCION;
                newOption.setAttributeNode(atribId);
                newOption.setAttributeNode(atribValue);
                lista.appendChild(newOption);
                
            }
        }
    };
    reader.readAsBinaryString(file);
}
// window.addEventListener('load', function () {
//     for (i = 0; i < articulos.length; i++) {

//     if (articulos[i].DESCRIPCION != "ANULAR") {
//             const newOption = document.createElement("option");
//             const lista = document.getElementById('medicacion');
//             const atribId = document.createAttribute("id");
//             atribId.value = "option" + i;
//             const atribValue = document.createAttribute("value");
//             atribValue.value = articulos[i].DESCRIPCION;
//             newOption.setAttributeNode(atribId);
//             newOption.setAttributeNode(atribValue);
//             lista.appendChild(newOption);
//         }
//     }
// });

function elegir() {
    // console.log(datos);
    let articulo = document.getElementById('listaArt').value;
    let index = datos.indexOf(articulo);
    //  let index = articulos.findIndex(object => {
    //      return object.DESCRIPCION === articulo;
    //  })
    // // console.log(index);

     document.getElementById('codArt').innerText = datos[index].CODARTICULO;
     document.getElementById('cantDepo').innerText = datos[index].STOCKENDEPOSITO;
     document.getElementById('cantFarm').innerText = datos[index].STOCKENDISPENSACION;
    
}

function borrar() {
    document.getElementById('listaArt').value = "";
    document.getElementById('codArt').innerText = "";
    document.getElementById('cantDepo').innerText = "";
    document.getElementById('cantFarm').innerText = "";
}