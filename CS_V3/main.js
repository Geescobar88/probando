async function loadExcel() {
    const fileId = document.getElementById('fileIdInput').value;
    if (!fileId) {
        alert("Por favor, introduce el ID del archivo de Google Drive.");
        return;
    }

    // URL de descarga directa para un archivo público de Google Drive
    const url = `https://drive.google.com/uc?export=download&id=${fileId}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Obtener el contenido del archivo como un ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // Convertir el ArrayBuffer a un Uint8Array
        const data = new Uint8Array(arrayBuffer);

        // Leer el archivo Excel usando SheetJS
        const workbook = XLSX.read(data, { type: 'array' });

        // Suponiendo que quieres la primera hoja
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convertir la hoja de cálculo a un array de objetos (JSON-like)
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Mostrar el JSON en la página
        document.getElementById('output').textContent = JSON.stringify(jsonData, null, 2);

    } catch (error) {
        console.error("Error al cargar o procesar el archivo:", error);
        document.getElementById('output').textContent = `Error: ${error.message}`;
    }
}