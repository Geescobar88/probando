document.addEventListener('DOMContentLoaded', () => {
    const dataForm = document.getElementById('dataForm');
    const mainContainer = document.getElementById('mainContainer');
    const dataBox1 = document.querySelector('.data-box-1');
    const dataBox2 = document.querySelector('.data-box-2');
    const pageSizeSelect = document.getElementById('pageSize');
    const printButton = document.getElementById('printButton');
    const body = document.body;

    // Manejar el envío del formulario para mostrar los datos
    dataForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que la página se recargue

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const edad = document.getElementById('edad').value;

        // Contenido HTML con los datos
        const content = `
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Apellido:</strong> ${apellido}</p>
            <p><strong>Edad:</strong> ${edad} años</p>
        `;

        // Inyectar el contenido en ambos divs
        dataBox1.innerHTML = content;
        dataBox2.innerHTML = content;

        // Mostrar el contenedor principal
        mainContainer.style.display = 'block';
    });

    // Agregar o quitar medicamentos a la tabla

        const addRowBtn = document.getElementById('addRowBtn');
        const dataTable = document.getElementById('dataTable');
        let rowCount = 1; // Para llevar un control del número de filas y dar nombres únicos a los inputs

        function setupRemoveButtons() {
            const allRows = dataTable.querySelectorAll('tbody tr'); // Obtén todas las filas del tbody
            allRows.forEach((row, index) => {
                const button = row.querySelector('.removeRowBtn'); // Encuentra el botón dentro de esta fila
                if (button) {
                    // Si es la primera fila (índice 0), deshabilita el botón
                    if (index === 0) {
                        button.disabled = true;
                        button.style.opacity = '0.5'; // Opcional: para que se vea deshabilitado
                        button.style.cursor = 'not-allowed'; // Opcional: cambiar el cursor
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

        addRowBtn.addEventListener('click', function() {
            rowCount++;

            const newRow = dataTable.insertRow();
            
            const cell1 = newRow.insertCell();
            cell1.innerHTML = `<input type="text" name="medicamento${rowCount}" required>`;

            const cell2 = newRow.insertCell();
            cell2.innerHTML = `<input type="text" name="cantidad${rowCount}" required>`;

            const cell3 = newRow.insertCell();
            cell3.innerHTML = `<input type="text" name="Número de Lote${rowCount}" required>`;

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