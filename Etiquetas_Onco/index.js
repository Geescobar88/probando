var lista_ingresos = [];

document.addEventListener('DOMContentLoaded', () => {

    fetch('./data/db_med.json')
        .then(response => response.json())
        .then(data => cargarDatos(data))

    function cargarDatos(data) {
        const datalist = document.getElementById("medicacion");
        data.forEach(item => {
            const newOption = document.createElement("option");
            const atribValue = document.createAttribute("value");
            atribValue.value = item.MEDICACION + " " + item.MG + " MG";
            newOption.setAttributeNode(atribValue);
            datalist.appendChild(newOption);
        });
    }

    const tabla = document.getElementById("tabla")
    const celda = tabla.getElementsByTagName("tr")

    // for (i = 0; 1 < celda.length; i++) {
    //     celda[i].addEventListener("click", () => {
    //         const rowIndex = this.rowIndex;
    //         console.log(rowIndex)

    //     })
    // }

    tabla.addEventListener("click", (evento) => {
        let target = evento.target;
        while (target && target !== tabla) {
            if (target.tagName === "TR") {
                const rowIndex = target.rowIndex;
                cargarEtiqueta(rowIndex);
                return;
            }
            target = target.parentNode;
        }
    });

    function cargarEtiqueta(orden) {
    console.log(orden)

    const medicacion = document.getElementById("")

    }
});


const btnAgregar = document.getElementById("btnAgregar")

btnAgregar.addEventListener('click', () => {

    const fecha = document.getElementById('fecha');
    const paciente = document.getElementById('paciente');
    const dni = document.getElementById('dni');
    const cama = document.getElementById('cama');
    const articulo = document.getElementById('articulo');
    const laboratorio = document.getElementById('laboratorio');
    const lote = document.getElementById('lote');
    const vto = document.getElementById('vto');
    const volumen = document.getElementById('volumen');
    const diluir_ml = document.getElementById('diluir_ml');
    const diluyente = document.getElementById('diluyente');
    const dosis = document.getElementById('dosis').value;
    const fecha_inf = document.getElementById('fecha_inf');
    const fecha_vto = document.getElementById('fecha_vto');

    const tabla = document.getElementById('tabla')


    const ingreso = new Object();

    //Crear objeto
    ingreso.fecha = fecha.value
    ingreso.paciente = paciente.value
    ingreso.dni = dni.value
    ingreso.cama = cama.value
    ingreso.articulo = articulo.value
    ingreso.laboratorio = laboratorio.value
    ingreso.lote = lote.value
    ingreso.vto = vto.value
    ingreso.volumen = volumen.value
    ingreso.diluir_ml = diluir_ml.value
    ingreso.diluyente = diluyente.value
    ingreso.dosis = dosis.value
    ingreso.fecha_inf = fecha_inf.value
    ingreso.fecha_vto = fecha_vto.value

    //Crear tabla
    lista_ingresos.push(ingreso)

    const row = tabla.insertRow();
    const medicacionCell = row.insertCell(0);
    const dosisCell = row.insertCell(1);
    const pacienteCell = row.insertCell(2);
    const dniCell = row.insertCell(3);
    const camaCell = row.insertCell(4);
    const fechaCell = row.insertCell(5);
    const f_infCell = row.insertCell(6);
    const obsCell = row.insertCell(7);

    medicacionCell.innerHTML = ingreso.articulo
    dosisCell.innerHTML = ingreso.dosis
    pacienteCell.innerHTML = ingreso.paciente
    dniCell.innerHTML = ingreso.dni
    camaCell.innerHTML = ingreso.cama
    fechaCell.innerHTML = ingreso.fecha
    f_infCell.innerHTML = ingreso.fecha_inf
    obsCell.innerHTML = ingreso.obs
    console.log(lista_ingresos)

    //Vaciar registros
    fecha.value = ""
    paciente.value = ""
    dni.value = ""
    cama.value = ""
    articulo.value = ""
    laboratorio.value = ""
    lote.value = ""
    vto.value = ""
    volumen.value = ""
    diluir_ml.value = ""
    diluyente.value = ""
    dosis.value = ""
    fecha_inf.value = ""
    fecha_vto.value = ""



})

//Etiqueta

const mostrarEtiqueta = document.getElementById('mostrarEtiqueta');
const etiqueta_container = document.getElementById('etiqueta_container');

mostrarEtiqueta.addEventListener('click', () => {

    if (etiqueta_container.style.display == "inline") {
        etiqueta_container.style.display = "none"
    } else {
        etiqueta_container.style.display = "inline"
    }

})




