document.addEventListener('DOMContentLoaded', () => {
    const dataForm = document.getElementById('dataForm');
    const mainContainer = document.getElementById('mainContainer');
    const dataBox1 = document.querySelector('.data-box-1');
    const dataBox2 = document.querySelector('.data-box-2');
    const pageSizeSelect = document.getElementById('pageSize');
    const printButton = document.getElementById('printButton');
    const dataTable = document.getElementById('dataTable');
    const dataTableBody = document.querySelector('#dataTable tbody');
    const tableResultsDiv = document.getElementById('tableResults')
    const body = document.body;

    // Manejar el envío del formulario para mostrar los datos
    dataForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que la página se recargue

        const fecha = document.getElementById('fecha').value;
        const institucion = document.getElementById('institucion').value;

        // Devuelve el valor de los inputs radio

        const radioButtons = document.querySelectorAll('input[name="seleccion"]');
        let selectedValue = '';

        // Itera sobre todos los botones de radio para encontrar el seleccionado
        for (const radio of radioButtons) {
            if (radio.checked) {
                selectedValue = radio.value; // Guarda el valor del botón seleccionado
                break; // Sale del bucle una vez que se encuentra el radio seleccionado
            }
        }

        // Muestra el contenido de la tabla de resultados

        const rows = dataTableBody.querySelectorAll('tr');
        const allMedicamentos = [];
        let hasEmptyFields = false; // Bandera para verificar campos vacíos

        rows.forEach(row => {
            const medicamentoInput = row.querySelector('input[name="medicamento"]');
            const cantidadInput = row.querySelector('input[name="cantidad"]');
            const loteInput = row.querySelector('input[name="lote"]');
            const vencimientoInput = row.querySelector('input[name="vencimiento"]');

            if (medicamentoInput.value.trim() === '' || 
                cantidadInput.value.trim() === '' || 
                loteInput.value.trim() === '' || 
                vencimientoInput.value.trim() === '') {
                hasEmptyFields = true;
                return; // Salta esta iteración del forEach si hay un campo vacío
            }

            const medicamento = {
                medicamento: medicamentoInput.value.trim(),
                cantidad: cantidadInput.value.trim(),
                lote: loteInput.value.trim(),
                vencimiento: vencimientoInput.value.trim()
            };
            allMedicamentos.push(medicamento);
        });

        if (hasEmptyFields) {
            alert('Por favor, completa todos los campos de cada fila antes de enviar.');
            tableResultsDiv.innerHTML = ''; // Limpia resultados anteriores si los hay
            return; // Detiene la ejecución si hay campos vacíos
        }

        // Si no hay medicamentos válidos (ej. si todas las filas están vacías o se eliminaron)
        if (allMedicamentos.length === 0) {
            tableResultsDiv.innerHTML = '<p>No se han ingresado medicamentos válidos para mostrar.</p>';
            return;
        }

        // Crear la nueva tabla para mostrar los resultados
        let resultTableHTML = '<table id="resultsTable"><thead><tr>';
        resultTableHTML += '<th>Medicamento</th><th>Cantidad</th><th>Lote</th><th>Vencimiento</th>';
        resultTableHTML += '</tr></thead><tbody>';

        allMedicamentos.forEach(item => {
            resultTableHTML += `<tr>`;
            resultTableHTML += `<td>${item.medicamento}</td>`;
            resultTableHTML += `<td>${item.cantidad}</td>`;
            resultTableHTML += `<td>${item.lote}</td>`;
            resultTableHTML += `<td>${item.vencimiento}</td>`;
            resultTableHTML += `</tr>`;
        });

        resultTableHTML += '</tbody></table>';

        tableResultsDiv.innerHTML = resultTableHTML; // Inserta la tabla generada en el div

        // Contenido HTML con los datos
        const content = `
            <div class="form-data-header">
            <p><strong>Fecha:</strong> ${fecha}</p>
            <p><strong>Institucion:</strong> ${institucion}</p>
            </div>

            <p class="form-data-inputRadio"><strong>${selectedValue}</strong></p>

            <div id="resultsContainer">
            <h3>Resumen de Medicamentos Ingresados:</h3>
            <div id="tableResults"></div>
             </div>

            <div class="form-data-footer">
                <div class="data-firma">
                    <span><strong>HIGA</strong></span>
                    <span>Autorizado por: ____________</span>
                    <span>Firma ____________</span>
                </div>

                <div class="data-firma">
                    <span><strong>${institucion}</strong></span>      
                    <span>Entrega/Recibe: ____________</span>
                    <span>Firma ____________</span>
                </div>
            </div>
                    `;

        // Inyectar el contenido en ambos divs
        dataBox1.innerHTML = content;
        dataBox2.innerHTML = content;

        // Mostrar el contenedor principal
        mainContainer.style.display = 'block';
    });

    // Agregar o quitar medicamentos a la tabla

    const addRowBtn = document.getElementById('addRowBtn');
    let rowCount = 1; // Para llevar un control del número de filas y dar nombres únicos a los inputs

    function setupRemoveButtons() {
        const allRows = dataTable.querySelectorAll('tbody tr'); // Obtén todas las filas del tbody
        allRows.forEach((row, index) => {
            const button = row.querySelector('.removeRowBtn'); // Encuentra el botón dentro de esta fila
            if (button) {
                // Si es la primera fila (índice 0), deshabilita el botón
                if (index === 0) {
                    button.disabled = true;
                    button.style.visibility = 'hidden'; // Opcional: para que se vea deshabilitado
                } else {
                    // Para las demás filas, asegúrate de que el botón esté habilitado
                    button.disabled = false;
                    button.style.opacity = '1';
                    button.style.cursor = 'pointer';
                }

                // Remueve cualquier evento click existente para evitar duplicados
                button.removeEventListener('click', handleRemoveRow);
                // Agrega el nuevo evento click
                button.addEventListener('click', handleRemoveRow);
            }
        });
    }

    function handleRemoveRow(event) {
        const rowToRemove = event.target.closest('tr');
        if (rowToRemove) {
            // Opcional: Puedes añadir una confirmación antes de eliminar
            // if (confirm('¿Estás seguro de que quieres eliminar esta fila?')) {
            rowToRemove.remove();
            // Después de eliminar, vuelve a configurar los botones para actualizar el estado
            setupRemoveButtons();
            // }
        }
    }

    addRowBtn.addEventListener('click', function () {
        rowCount++;

        const newRow = dataTable.insertRow();

        const cell1 = newRow.insertCell();
        cell1.innerHTML = `<input type="text" name="medicamento${rowCount}" required>`;

        const cell2 = newRow.insertCell();
        cell2.innerHTML = `<input type="text" name="cantidad${rowCount}" required>`;

        const cell3 = newRow.insertCell();
        cell3.innerHTML = `<input type="text" name="Lote${rowCount}" required>`;

        const cell4 = newRow.insertCell();
        cell4.innerHTML = `<input type="text" name="vencimiento${rowCount}" required>`;

        const cell5 = newRow.insertCell();
        // El botón de la nueva fila siempre estará habilitado por defecto al crearse
        cell5.innerHTML = `<button type="button" class="removeRowBtn">X</button>`;

        // Vuelve a configurar los eventos para los botones de eliminar (y deshabilitar el primero si es necesario)
        setupRemoveButtons();
    });

    // Configura los botones de eliminar iniciales al cargar la página
    setupRemoveButtons();

    // Manejar el botón de imprimir
    printButton.addEventListener('click', () => {
        const selectedSize = pageSizeSelect.value;

        // Agrega la clase al body para que el CSS de impresión sepa el tamaño del papel
        if (selectedSize === 'A4') {
            body.classList.add('A4-print');
            body.classList.remove('legal-print');
        } else if (selectedSize === 'legal') {
            body.classList.add('legal-print');
            body.classList.remove('A4-print');
        }

        // Llama a la función de impresión del navegador
        window.print();

        // IMPORTANTE: Remueve las clases del body después de imprimir
        // Esto es crucial para que los estilos de pantalla no se vean afectados
        // si el usuario cierra el diálogo de impresión sin imprimir o quiere cambiar de opción.
        body.classList.remove('A4-print');
        body.classList.remove('legal-print');
    });
});