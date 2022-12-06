 function calcular() {
     let goteo = document.getElementById('goteo').value;
     let medicacion = document.getElementById('medicacion').value;
     let duracion = document.getElementById('duracion').value;
     let volumen = document.getElementById('volumen').value;

     let volTotal = (Number(goteo) * Number(duracion)) / (Number(volumen) + Number(medicacion));

     document.getElementById('volTotal').innerHTML = volTotal;
 }
