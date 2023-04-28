var documento;

window.addEventListener('load', async function cargar() {
    const response = await fetch('https://geescobar88.github.io/probando/RSP/DB_P.json')
    const data = await response.json()
    documento = data
})

function buscar() {
    const dni = document.getElementById('dni').value
    const fin_resapro = document.getElementById('resapro');

    for (let i = 0; i < documento.length; i++) {
        if (dni == documento[i].NRO_DOC && i <= (documento.length - 1)) {
            fin_resapro.innerHTML = `Posee PROEPI activo hasta: ${documento[i].FECHA_FIN}`;
            break
        } else {
            if (i == (documento.length - 1)) {
                fin_resapro.innerHTML = "El paciente no esta inscripto en RESAPRO."
            }
        }
    }
}
