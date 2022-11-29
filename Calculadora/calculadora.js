var num;    //Define si el ultimo ingreso es un numero o una operacion.
var reset;  //Previene que al finalizar la operacion permanezca el resultado como valor por default.


function imprimir(valor) {
    if (reset == 1) { 
    document.getElementById('pantalla').value = "";
    }
    num = 0;
    var aux = document.getElementById('pantalla').value;
    document.getElementById('pantalla').value = aux + valor;
    reset = 0;
    
}

function imprimirU(valor) {
    if (num == 0) {
    var aux = document.getElementById('pantalla').value;
    document.getElementById('pantalla').value = aux + valor;
    num = 1;
    }
    reset = 0;
       
}

function borrar() {
    document.getElementById('pantalla').value = "0";
}

function calcular() {
    var aux = document.getElementById('pantalla').value;
    document.getElementById('pantalla').value = eval(aux);
    reset = 1;
    num = 0;
}