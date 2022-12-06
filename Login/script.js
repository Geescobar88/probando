

function saludar() {
    const name = document.getElementById('usuario').value;
    if (name.length > 6 ) {
        alert(`Bienvenido ${name}.`);
        document.getElementById('usuario').value = "";
    } else {
        alert("El Usuario debe contener por lo menos 6 caracteres.")
        document.getElementById('usuario').value = "";
    }
}