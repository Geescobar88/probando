async function buscar() {
    const response = await fetch('./DB_P.json')
    const data = await response.json()
    console.log(data)

    const dni = document.getElementById('dni').value

 for (let i = 0; i < data.length ; i++ ) {
            console.log(data[i].NRO_DOC)
}
}