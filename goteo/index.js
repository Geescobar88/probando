 function calcular() {
     let goteo = document.getElementById('goteo').value;
     let medicacion = document.getElementById('medicacion').value;
     let duracion = document.getElementById('duracion').value;
     let volumen = document.getElementById('volumen').value;

    if (goteo == "") {
        alert("El campo goteo no puede quedar vacio.")
    } else {
        let volTotal = (Number(goteo) * Number(duracion)) / (Number(volumen) + Number(medicacion));
        let baxter = Math.ceil(volTotal);

        document.getElementById('volTotal').innerHTML = "La cantidad de baxter que usaran es: " + baxter;
    }
 }
