var listado;
var database;
var total;

window.addEventListener('load', async function () {
    const stockResponse = await fetch('./data/stock.json');
    const stockData = await stockResponse.json();
    listado = stockData;

    const dbResponse = await fetch('./data/DB.json');
    const dbData = await dbResponse.json();
    database = dbData;

    const total = listado.map(obj1 => {
        const matchingObj2 = database.find(obj2 => obj2.CODARTICULO === obj1.CODARTICULO);
        if (matchingObj2) {
            return { ...obj1, ...matchingObj2 };
        } else {
            return obj1;
        }
    });

    filtroArt = document.getElementById('fNombre')
    filtroCM = document.getElementById('fCodigoMin')

    carga(total)
});


function carga(total) {

    filtroArt.addEventListener('change', function () {
        if (filtroArt.checked) {
            const datalist = document.getElementById('medicacion');
            const entrada = document.getElementById('entrada')
            datalist.innerHTML = '';
            entrada.value = '';
            for (let i = 0; i < total.length; i++) {
                if (total[i].HABILITADO != "NO") {
                    const newOption = document.createElement("option");
                    const lista = document.getElementById('medicacion');
                    const atribValue = document.createAttribute("value");
                    atribValue.value = total[i].MEDICACION;
                    newOption.setAttributeNode(atribValue);
                    lista.appendChild(newOption);
                }
            }
        }
    })

    filtroCM.addEventListener('change', function () {
        if (filtroCM.checked) {
            const datalist = document.getElementById('medicacion');
            const entrada = document.getElementById('entrada')
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

function elegir(total) {
    const articulo = document.getElementById('entrada')
    
}




