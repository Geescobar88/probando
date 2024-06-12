const enviar = document.getElementById('enviar')
const password = document.getElementById('password')

enviar.addEventListener('click', () => {
    if (password.value == "cafe") {    
        location.href ="https://geescobar88.github.io/probando/Control_Stock/index.html";
    } else {
        alert(" Contraseña incorrecta.")
        password.value = ""
    }

})