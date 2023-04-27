var articulos;

// window.addEventListener('load', async function CargarData() {
//     const response = await fetch('https://geescobar88.github.io/probando/Control_Stock/data/Stock.json')
//     const data = await response.json()
//     articulos = data
//     for (i = 0; i < articulos.length; i++) {

//         if (articulos[i].DESCRIPCION != "ANULAR") {
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

window.addEventListener('load', async function CargarData() {
    const response = await fetch('https://geescobar88.github.io/probando/Control_Stock/data/stock.xls')
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, {type: 'array'});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const startRow = 2; 
    const articulos = [];
    for (let rowNum = startRow; rowNum <= range.e.r; rowNum++) {
        const descripcion = worksheet[XLSX.utils.encode_cell({r: rowNum, c: 1})].v;
        if (descripcion !== "ANULAR") {
            articulos.push({descripcion: descripcion});
        }
    }
    const lista = document.getElementById('medicacion');
    for (let i = 0; i < articulos.length; i++) {
        const newOption = document.createElement("option");
        const atribId = document.createAttribute("id");
        atribId.value = "option" + i;
        const atribValue = document.createAttribute("value");
        atribValue.value = articulos[i].descripcion;
        newOption.setAttributeNode(atribId);
        newOption.setAttributeNode(atribValue);
        lista.appendChild(newOption);
    }
});


function elegir() {
    let articulo = document.getElementById('listaArt').value;
    let index = articulos.findIndex(object => {
        return object.DESCRIPCION === articulo;
    })
    console.log(index);
    document.getElementById('codArt').innerText = articulos[index].CODARTICULO;
    document.getElementById('cantDepo').innerText = articulos[index].STOCKENDEPOSITO;
    document.getElementById('cantFarm').innerText = articulos[index].STOCKENDISPENSACION;

}

function borrar() {
    document.getElementById('listaArt').value = "";
    document.getElementById('codArt').innerText = "";
    document.getElementById('cantDepo').innerText = "";
    document.getElementById('cantFarm').innerText = "";
}

// const input = document.getElementById('listaArt');
// const grabar = document.getElementById('btnGrabar');


// const recognition = new webkitSpeechRecognition();
// recognition.lang = 'es-ES';
// recognition.continuos = false;
// recognition.interimResults = false;

// recognition.onresult = function (event) {
//     const texto = event.results[0][0].transcript;
//     console.log(texto);

//     input.value = texto;
// };

// function grabando() {
//     recognition.start();
// }
