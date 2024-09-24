
$(document).ready(function() {
    let itemCount = 1;

    function addItemToConfirmedList(item) {
        let itemHtml = `
            <li class="list-group-item confirmed-item p-1 animate__animated animate__fadeInUp" data-tipo="${item.tipo}" data-ubicacion="${item.ubicacion}" data-estado="${item.estado}" data-stock_critico="${item.stock_critico}" data-unidad="${item.unidad}">
                <div class="card-body">
                    <h7 class="card-title">${item.codigo_barras} <br><strong>${item.cantidad} - ${item.unidad}</strong></h7>
                    <p class="card-text">${item.categoria} - ${item.modelo}</p>
                    <button type="button" class="btn btn-warning btn-sm edit-item" data-item='${JSON.stringify(item)}'>Editar</button>
                    <button type="button" class="btn btn-danger btn-sm delete-item" data-item='${JSON.stringify(item)}'>Eliminar</button>
                </div>
            </li>   
        `;
        $('#confirmed-items-container').append(itemHtml);
    }
    let barcodeBuffer = '';

    function processBarcode(barcode) {
        $('#barcode').val(barcode);
        $('#barcode').trigger('input'); // Triggers input event to process barcode
        $('#flush-collapseOne').collapse('hide'); // Close the accordion
    }

    $(document).on('keydown', function(event) {
        console.log('Key pressed:', event.key); // Add this line to debug
        if (event.key.length === 1) { // Handle character   s
            barcodeBuffer += event.key;
        } else if (event.key === 'Enter') { // Handle Enter key
            if (barcodeBuffer) {
                console.log('Barcode scanned:', barcodeBuffer); // Add this line to debug
                processBarcode(barcodeBuffer);
                barcodeBuffer = ''; // Clear buffer
                event.preventDefault(); // Prevent default Enter behavior
            }
        }
    });
    
    $('#addItem').on('click', function() {
        let modeloInput = $('#modelo');
        let tipoSelect = $('#types');
        let ubicacionInput = $('#locations');
        let cantidadInput = $('#cantidad');
        let unidadSelect = $('#units');
        let estadoSelect = $('#states');
        let stockCriticoInput = $('#stock_critico');
        let barcodeInput = $('#barcode');
        let categoriaInput = $('#categoria');
    
        let item = {
            codigo_barras: barcodeInput.val(),
            categoria: categoriaInput.val(),
            modelo: modeloInput.val(),
            tipo: tipoSelect.val(),
            ubicacion: ubicacionInput.val(),
            cantidad: cantidadInput.val(),
            unidad: unidadSelect.val(),
            estado: estadoSelect.val(),
            stock_critico: stockCriticoInput.val()
        };
    
        // Validar todos los campos
        let isValid = true;
        if (!modeloInput.val()) {
            modeloInput.addClass('is-invalid');
            isValid = false;
        } else {
            modeloInput.removeClass('is-invalid');
        }
    
        if (!tipoSelect.val()) {
            tipoSelect.addClass('is-invalid');
            isValid = false;
        } else {
            tipoSelect.removeClass('is-invalid');
        }
    
        if (!ubicacionInput.val()) {
            ubicacionInput.addClass('is-invalid');
            isValid = false;
        } else {
            ubicacionInput.removeClass('is-invalid');
        }
    
        if (!cantidadInput.val()) {
            cantidadInput.addClass('is-invalid');
            isValid = false;
        } else {
            cantidadInput.removeClass('is-invalid');
        }
    
        if (!unidadSelect.val()) {
            unidadSelect.addClass('is-invalid');
            isValid = false;
        } else {
            unidadSelect.removeClass('is-invalid');
        }
    
        if (!estadoSelect.val()) {
            estadoSelect.addClass('is-invalid');
            isValid = false;
        } else {
            estadoSelect.removeClass('is-invalid');
        }
    
        if (!stockCriticoInput.val()) {
            stockCriticoInput.addClass('is-invalid');
            isValid = false;
        } else {
            stockCriticoInput.removeClass('is-invalid');
        }
    
        if (!barcodeInput.val()) {
            barcodeInput.addClass('is-invalid');
            isValid = false;
        } else {
            barcodeInput.removeClass('is-invalid');
        }
    
        if (!categoriaInput.val()) {
            categoriaInput.addClass('is-invalid');
            isValid = false;
        } else {
            categoriaInput.removeClass('is-invalid');
        }
        // Validar cada campo y mostrar mensajes de error si es necesario
    
    
        // Si todos los campos son válidos, agregar el ítem a la lista
        if (isValid) {
            $('#types').prop('disabled', false)
            $('#units').prop('disabled', false);
            addItemToConfirmedList(item);
            $('#ingresoForm').trigger('reset');
        } 
    });
    
    //Editar elimina y sobreescribe
    $(document).on('click', '.edit-item', function() {
        let item = $(this).data('item');
        $('#barcode').val(item.codigo_barras);
        $('#categoria').val(item.categoria);
        $('#modelo').val(item.modelo);
        $('#types').val(item.tipo).prop('disabled', true);
        $('#locations').val(item.ubicacion);
        $('#cantidad').val(item.cantidad);
        $('#units').val(item.unidad).prop('disabled', true);
        $('#states').val(item.estado);
        $('#stock_critico').val(item.stock_critico);
        $(this).closest('.confirmed-item').remove()
    });
    $(document).on('click', '.delete-item', function() {
        $(this).closest('.confirmed-item').remove();
    });
    function fetchAndDisplayMaterials(query = '') {
        $.ajax({
            url: '/api/search',
            method: 'GET',  
            data: { query: query },

            success: function(data) {
                let resultsContainer = $('#search-results');
                resultsContainer.empty();
                data.forEach(item => {
                    resultsContainer.append(`
                        <div class="search-result-card" data-item='${JSON.stringify(item)}'>
                            <p>${item.categoria} - ${item.modelo}</p>
                        </div>
                    `);
                });
                $('.search-result-card').on('click', function() {
                    let item = $(this).data('item');
                    
                    $('#categoria').val(item.categoria).prop('disabled', false);
                    $('#modelo').val(item.modelo).prop('disabled', false);
                    $('#types').val(item.tipo).prop('disabled', true);
                    $('#locations').val(item.ubicacion).prop('disabled', false);
                    $('#units').val(item.unidad).prop('disabled', true);
                    $('#states').val(item.estado).prop('disabled', false);
                    $('#stock_critico').val(item.stock_critico).prop('disabled', false);
                    $('#search-results-container').hide();
                    
                });
            },
            error: function(error) {
                console.error('Error fetching materials:', error);
            }
        });
    }
    //redundante
    $('.search-result-card, #barcode').on('click', function() {
        let item = $(this).data('item'); // Asegúrate de que este "item" tiene la categoría y modelo correctos.
        let category = item.categoria;

        $('#categoria').val(category);
        updateModels(category); // Actualiza el datalist de modelos según la categoría autocompletada
    });
    //  redundante
    $('#modelo').on('input', function() {
        let category = $('#categoria').val(); // Obtener la categoría actual
        if (category) {
            updateModels(category); // Reestablecer el datalist de modelos según la categoría
        }
    });
    function updateModels(category) {
        $.ajax({
            url: '/api/models',
            method: 'GET',
            data: { category: category },
            success: function(data) {
                let modelsDatalist = $('#models');
                modelsDatalist.empty(); // Limpiar el datalist
                data.forEach(model => {
                    modelsDatalist.append(`<option value="${model}">`);
                });
            },
            error: function(error) {
                console.error('Error fetching models:', error);
            }
        });
    }
    function updateUnits(category) {
        $.ajax({
            url: '/api/unit_for_category',
            method: 'GET',
            data: { category: category },
            success: function(response) {
                let unitInput = $('#units');
                console.log(response);
                if (response.unidad) {

                    unitInput.val(response.unidad).prop('disabled', true);
                } else {
                    unitInput.val('').prop('disabled', false);
                }
            }
        });

    
    }
    function updateDatalists() {
        // Actualiza categorías, tipos, ubicaciones, unidades y estados
        $.get('/api/categories', function(data) {
            let categoriesDatalist = $('#categories');
            categoriesDatalist.empty();
            data.forEach(category => {
                categoriesDatalist.append(`<option value="${category}">`);
            });
        });

        $.ajax({
            url: '/api/types',
            method: 'GET',
            success: function(data) {
                let typesDatalist = $('#types');
                data.forEach(type => {
                    typesDatalist.append(`<option value="${type}">${type}</option>`);
                });
            }
        });

        // Ubicaciones
        $.ajax({
            url: '/api/locations',
            method: 'GET',
            success: function(data) {
                let locationsDatalist = $('#locations');
                // locationsDatalist.empty();
                data.forEach(location => {
                    locationsDatalist.append(`<option value="${location}">${location}</option>`);
                });
            }
        });
        $.ajax({
            url: '/api/sections',
            method: 'GET',
            success: function(data) {
                let sectionsDatalist = $('#seccion');
                // locationsDatalist.empty();
                data.forEach(section => {
                    sectionsDatalist.append(`<option value="${section}">${section}</option>`);
                });
            }
        });
        // Unidades
        $.ajax({
            url: '/api/units',
            method: 'GET',
            success: function(data) {
                let unitsDatalist = $('#units');

                data.forEach(unit => {
                    unitsDatalist.append(`<option value="${unit}">${unit}</option>`);
                });
            }
        });
        $.ajax({
            url: '/api/states',
            method: 'GET',
            success: function(data) {
                let statesDatalist = $('#states');

                data.forEach(states => {
                    statesDatalist.append(`<option value="${states}">${states}</option>`);
                });
            }
        });
        // Hacer lo mismo para tipos, ubicaciones, unidades y estados
    }

    updateDatalists();
    let barcodeInput = $('#barcode');

    let activeInput = null; // Para almacenar el campo de entrada activo
    $('input').on('focus', function() {
        activeInput = $(this);
    });

    $('input').on('blur', function() {
        if (activeInput === $(this)) {
            activeInput = null;
        }
    });
    document.addEventListener('DOMContentLoaded', () => {

       
        const barcodeInputTimeout = 200; // Tiempo en milisegundos para detectar escaneo rápido
        barcodeInput.focus();

        // Puedes agregar una función para enfocar el campo cuando se muestre el formulario
        $('#ingresoForm').on('show.bs.collapse', function() {
            barcodeInput.focus();
        });
        // Detectar entrada de código de barras
        document.addEventListener('keydown', (event) => {
            // Puedes ajustar esto según el comportamiento de tu escáner
            // Asumimos que el escáner envía el código de barras seguido por Enter
            if (event.key.length === 1) { // Solo caracteres
                barcodeBuffer += event.key;
            } else if (event.key === 'Enter') {
                // Cuando se detecta Enter, asumimos que se ha escaneado un código de barras
                if (barcodeBuffer) {
                    barcodeInput.val(barcodeBuffer); // Inserta el código de barras en el campo
                    barcodeBuffer = ''; // Limpia el buffer de código de barras
    
                    // Limpia el campo activo si es necesario
                    if (activeInput && activeInput.attr('id') !== 'barcode') {
                        activeInput.val('');
                    }
    
                    event.preventDefault(); // Evita el comportamiento por defecto del Enter
                }
            }
        });
    
    });
    
    
    $('#search').on('input', function() {
        let query = $(this).val();
        if (query) {
            $('#search-results-container').show();
            fetchAndDisplayMaterials(query);
        } else {
            $('#search-results-container').hide();
        }
    });
    
    $('#barcode').on('input', function() {
        let barcode = $(this).val().trim();
        if (barcode.length === 12) { // Assuming the barcode length is 12
            $.ajax({
                url: '/api/item_by_barcode',
                method: 'GET',
                data: { barcode: barcode },
                success: function(response) {
                    if (response.success) {
                        let item = response.item;
                        $('#categoria').val(item.categoria).prop('disabled', false);
                        $('#modelo').val(item.modelo).prop('disabled', false);
                        $('#types').val(item.tipo).prop('disabled', false);
                        $('#locations').val(item.ubicacion).prop('disabled', false);
                        $('#units').val(item.unidad).prop('disabled', true);
                        $('#states').val(item.estado).prop('disabled', false);
                        $('#stock_critico').val(item.stock_critico).prop('disabled', false);
                        $('#flush-collapseOne').collapse('hide'); // Close the accordion
                        updateUnits(item.categoria);
                        if (activeInput && activeInput.attr('id') !== 'barcode') {
                            activeInput.val('');
                        }
                    } else {
                        $('#notificationMessage').text('No se encontró el ítem con el código de barras proporcionado.');
                        $('#notificationModal').modal('show');
                    }
                },
                error: function(error) {
                    console.error('Error al buscar el ítem por código de barras:', error);
                }
            });
        }
    });

    $(document).on('click', function(event) {
        if (!$(event.target).closest('.search-container').length) {
            $('#search-results-container').hide();
        }
    });

    $('#categoria').on('input', function() {
        let category = $(this).val();
        
        updateModels(category);
        // updateUnits(category);
        
            
            if (category) {
                $.ajax({
                    url: '/api/category_details',
                    method: 'GET',
                    data: { category: category },
                    success: function(response) {
                        if (response.tipo) {
                            $('select[name="tipo"]').val(response.tipo).prop('disabled', true);
                        } else {
                            $('select[name="tipo"]').val('').prop('disabled', false);
                        }
                        
                        if (response.stock_critico) {
                            $('input[name="stock_critico"]').val(response.stock_critico);
                        } else {
                            $('input[name="stock_critico"]').val('').prop('disabled', false);
                        }
                        
                        if (response.unidad) {
                            $('select[name="unidad"]').val(response.unidad).prop('disabled', true);
                        } else {
                            $('select[name="unidad"]').val('').prop('disabled', false);
                        }
                    },
                    error: function(error) {
                        console.error('Error fetching category details:', error);
                    }
                });
            }
        
        console.log(category);
    });

    $('#generate-code').on('click', function() {
        let inputField = $('#barcode');
        console.log(actionType);
        $.ajax({
            url: '/api/generate_code',
            method: 'GET',
            success: function(data) {
                inputField.val(data.code);
            },
            error: function(error) {
                console.error('Error generating code:', error);
            }
        });
    });

    let actionType = ' ';
    function setAction(action) {

        if (action === 'ingreso') {
            $('#ModalLabel').empty();
            $('#ModalLabel').append(`<svg height="40px" width="40px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512 512" xml:space="preserve">
<path style="fill:rgba(36, 38, 45, 0.69);" d="M395.47,296.3H116.531c-36.816,0-57.855-42.009-35.803-71.491L225.983,30.621
	c14.993-20.043,45.041-20.043,60.034,0l145.254,194.188C453.325,254.291,432.286,296.3,395.47,296.3z"/>
<path style="fill:#b0949a;" d="M443.755,215.471L298.501,21.284C288.382,7.759,272.893,0,256.001,0s-32.383,7.759-42.5,21.284
	L68.245,215.471c-13.759,18.393-15.916,42.579-5.631,63.119c10.286,20.54,30.946,33.298,53.916,33.298h66.552
	C185.227,422.598,275.94,512,387.153,512c8.608,0,15.589-6.979,15.589-15.589V381.652c0-8.61-6.981-15.589-15.589-15.589
	c-14.01,0-27.556-5.074-38.144-14.29c-6.494-5.651-16.339-4.971-21.993,1.525c-5.653,6.494-4.97,16.34,1.525,21.993
	c12.293,10.699,27.185,17.765,43.025,20.577v84.258c-86.772-7.791-155.289-79.949-157.307-168.237H395.47
	c22.97,0,43.63-12.759,53.917-33.298C459.671,258.052,457.514,233.866,443.755,215.471z M421.509,264.629
	c-5.043,10.069-14.777,16.081-26.04,16.081H116.53c-11.261,0-20.995-6.011-26.038-16.081c-5.043-10.07-4.027-21.466,2.72-30.484
	L238.466,39.957c4.173-5.581,10.565-8.781,17.534-8.781c6.97,0,13.36,3.2,17.534,8.781l145.254,194.188
	C425.534,243.165,426.551,254.56,421.509,264.629z"/>
</svg> Ingresar Item`);
            actionType = 'ingreso';
        } else if (action === 'retiro') {
            $('#ModalLabel').empty();
            $('#ModalLabel').append(`<svg width="35" height="35" viewBox="0 0 149 151" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M53.9084 15.5909C55.289 18.7547 53.8435 22.4388 50.6796 23.8194C42.2579 27.4945 34.8646 33.1768 29.1462 40.3693C23.4278 47.5618 19.5583 56.0456 17.8762 65.079C16.194 74.1124 16.7503 83.4204 19.4965 92.1891C22.2426 100.958 27.095 108.92 33.6294 115.381C40.1638 121.841 48.1812 126.602 56.9808 129.248C65.7803 131.894 75.094 132.344 84.1077 130.558C93.1213 128.773 101.56 124.807 108.687 119.007C115.814 113.207 121.411 105.749 124.99 97.286C126.334 94.1066 130.002 92.619 133.181 93.9634C136.36 95.3079 137.848 98.9752 136.504 102.155C132.13 112.498 125.288 121.613 116.578 128.702C107.867 135.792 97.553 140.639 86.5363 142.821C75.5197 145.003 64.1363 144.453 53.3813 141.219C42.6263 137.985 32.8272 132.166 24.8407 124.27C16.8542 116.374 10.9235 106.642 7.56711 95.9251C4.2107 85.2078 3.53076 73.8314 5.58675 62.7905C7.64274 51.7497 12.372 41.3806 19.3612 32.5897C26.3504 23.7989 35.3866 16.854 45.6798 12.3621C48.8437 10.9815 52.5277 12.4271 53.9084 15.5909Z" fill="#94AFB0"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M68.7613 8.48352C69.9335 7.31135 71.5233 6.65283 73.181 6.65283C82.2099 6.65283 91.1503 8.4312 99.4919 11.8864C107.834 15.3416 115.413 20.406 121.797 26.7903C128.182 33.1747 133.246 40.7541 136.701 49.0957C140.156 57.4373 141.935 66.3777 141.935 75.4066C141.935 78.8586 139.136 81.6569 135.684 81.6569H73.181C69.729 81.6569 66.9307 78.8586 66.9307 75.4066V12.9032C66.9307 11.2455 67.5892 9.65568 68.7613 8.48352ZM79.4313 19.5018V69.1563H129.086C128.5 63.9148 127.178 58.7713 125.152 53.8795C122.325 47.0545 118.182 40.8532 112.958 35.6297C107.734 30.4061 101.533 26.2625 94.7081 23.4355C89.8163 21.4093 84.6728 20.0879 79.4313 19.5018Z" fill="#94AFB0"/>
                            </svg>
                            Retirar Item`);
            actionType = 'retiro';
        }
    }
    
    $('#ingresobtn').on('click', function() {
        setAction('ingreso');
        
    });
    
    $('#retirarbtn').on('click', function() {
        setAction('retiro');
        
    });

    function alertabs(msg,tipo){
        $('#formalert').text(msg).removeClass('d-none').addClass(tipo,'animate__animated', 'animate__fadeInDown');

        // Ocultar el mensaje después de 3 segundos (3000 ms)
        setTimeout(() => {
            $('#formalert').addClass('d-none').removeClass(tipo);
        }, 3000);
        
    }
    let items = [];
    $('#confirmItems').on('click', function(event) {
        event.preventDefault();
    
        items = []; // Reinicia la variable items
    
        $('#confirmed-items-container .confirmed-item').each(function() {
            let item = {
                codigo_barras: $(this).find('.card-body h7').text().split(' ')[0],
                cantidad: $(this).find('.card-body h7').text().split(' - ')[0].split(' ')[1],
                unidad: $(this).find('.card-body h7').text().split(' - ')[1],
                categoria: $(this).find('.card-text').text().split(' - ')[0],
                modelo: $(this).find('.card-text').text().split(' - ')[1],
                tipo: $(this).data('tipo'),
                ubicacion: $(this).data('ubicacion'),
                estado: $(this).data('estado'),
                stock_critico: $(this).data('stock_critico')
            };
    
            if (!item.tipo || !item.ubicacion || !item.unidad || !item.estado || !item.stock_critico) {
                console.error('Campos faltantes en el ítem:', item);
                return;
            }
    
            items.push(item);
        });
    
        if (items.length === 0) {
            alertabs('No hay items para enviar','alert-warning');
            return;
        }
    
        $('#scont').addClass('d-none');
        $('#userFormDiv').removeClass('d-none');
        $('#userFormDiv').removeClass('animate__fadeInUp');
    });
    
    updateOperations();
    function updateOperations() {
        $.ajax({
            url: '/api/get_operations',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                const container = $('#operationContainer');
                container.empty(); // Limpiar contenido previo
        
                // Crear estructuras para agrupar por fecha
                const todayOperations = [];
                const yesterdayOperations = [];
                const last7DaysOperations = [];
        
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
        
                data.forEach(function(row) {
                    const operationDate = new Date(row.fecha_hora);
                    const operationDay = new Date(operationDate.getFullYear(), operationDate.getMonth(), operationDate.getDate());
        
                    if (operationDay.getTime() === new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) {
                        todayOperations.push(row);
                    } else if (operationDay.getTime() === new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).getTime()) {
                        yesterdayOperations.push(row);
                    } else if (operationDay.getTime() >= new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7).getTime()) {
                        last7DaysOperations.push(row);
                    }
                });
        
                function renderOperations(operations, sectionTitle) {
                    if (operations.length > 0) {
                        container.append(`<h3>${sectionTitle}</h3>`);
        
                        // Crear un objeto para agrupar por proceso_id
                        const groupedData = {};
        
                        operations.forEach(function(row) {
                            if (!groupedData[row.proceso_id]) {
                                groupedData[row.proceso_id] = {
                                    fecha_hora: row.fecha_hora,
                                    usuario: row.usuario,
                                    operacion: row.operacion,
                                    items: []
                                };
                            }
                            groupedData[row.proceso_id].items.push({
                                modelo: row.items,
                                categoria: row.categoria
                            });
                        });
        
                        // Ahora iteramos sobre los grupos y los mostramos en el HTML
                        // Ahora iteramos sobre los grupos y los mostramos en el HTML
for (let proceso_id in groupedData) {
    const operation = groupedData[proceso_id];
    let itemsHtml = '';

    operation.items.forEach(function(item) {
        itemsHtml += `
            <div>
                <span class="item-category">${item.categoria}</span> - 
                <span class="items">${item.modelo}</span>
            </div>
        `;
    });

    // Aquí es donde decides qué SVG mostrar según el tipo de operación
    let operationIconHtml = '';
    if (operation.operacion === 'Ingreso') {
        operationIconHtml = `<svg class="rotate-svg" height="40px" width="40px"  version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                 viewBox="0 0 512 512" xml:space="preserve">
                            <path style="fill:rgba(36, 38, 45, 0.938);" d="M395.47,296.3H116.531c-36.816,0-57.855-42.009-35.803-71.491L225.983,30.621
                                c14.993-20.043,45.041-20.043,60.034,0l145.254,194.188C453.325,254.291,432.286,296.3,395.47,296.3z"/>
                            <path style="fill:#94b09d;" d="M443.755,215.471L298.501,21.284C288.382,7.759,272.893,0,256.001,0s-32.383,7.759-42.5,21.284
                                L68.245,215.471c-13.759,18.393-15.916,42.579-5.631,63.119c10.286,20.54,30.946,33.298,53.916,33.298h66.552
                                C185.227,422.598,275.94,512,387.153,512c8.608,0,15.589-6.979,15.589-15.589V381.652c0-8.61-6.981-15.589-15.589-15.589
                                c-14.01,0-27.556-5.074-38.144-14.29c-6.494-5.651-16.339-4.971-21.993,1.525c-5.653,6.494-4.97,16.34,1.525,21.993
                                c12.293,10.699,27.185,17.765,43.025,20.577v84.258c-86.772-7.791-155.289-79.949-157.307-168.237H395.47
                                c22.97,0,43.63-12.759,53.917-33.298C459.671,258.052,457.514,233.866,443.755,215.471z M421.509,264.629
                                c-5.043,10.069-14.777,16.081-26.04,16.081H116.53c-11.261,0-20.995-6.011-26.038-16.081c-5.043-10.07-4.027-21.466,2.72-30.484
                                L238.466,39.957c4.173-5.581,10.565-8.781,17.534-8.781c6.97,0,13.36,3.2,17.534,8.781l145.254,194.188
                                C425.534,243.165,426.551,254.56,421.509,264.629z"/>
                            </svg>`; // Reemplaza este ícono por tu SVG de "Ingreso"
    } else if (operation.operacion === 'Retiro') {
        operationIconHtml = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg height="40px" width="40px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512 512" xml:space="preserve">
<path style="fill:rgba(36, 38, 45, 0.69);" d="M395.47,296.3H116.531c-36.816,0-57.855-42.009-35.803-71.491L225.983,30.621
	c14.993-20.043,45.041-20.043,60.034,0l145.254,194.188C453.325,254.291,432.286,296.3,395.47,296.3z"/>
<path style="fill:#b0949a;" d="M443.755,215.471L298.501,21.284C288.382,7.759,272.893,0,256.001,0s-32.383,7.759-42.5,21.284
	L68.245,215.471c-13.759,18.393-15.916,42.579-5.631,63.119c10.286,20.54,30.946,33.298,53.916,33.298h66.552
	C185.227,422.598,275.94,512,387.153,512c8.608,0,15.589-6.979,15.589-15.589V381.652c0-8.61-6.981-15.589-15.589-15.589
	c-14.01,0-27.556-5.074-38.144-14.29c-6.494-5.651-16.339-4.971-21.993,1.525c-5.653,6.494-4.97,16.34,1.525,21.993
	c12.293,10.699,27.185,17.765,43.025,20.577v84.258c-86.772-7.791-155.289-79.949-157.307-168.237H395.47
	c22.97,0,43.63-12.759,53.917-33.298C459.671,258.052,457.514,233.866,443.755,215.471z M421.509,264.629
	c-5.043,10.069-14.777,16.081-26.04,16.081H116.53c-11.261,0-20.995-6.011-26.038-16.081c-5.043-10.07-4.027-21.466,2.72-30.484
	L238.466,39.957c4.173-5.581,10.565-8.781,17.534-8.781c6.97,0,13.36,3.2,17.534,8.781l145.254,194.188
	C425.534,243.165,426.551,254.56,421.509,264.629z"/>
</svg>`; // Reemplaza este ícono por tu SVG de "Retiro"
    }

    const operationHtml = `
        <div class="operation-item">
            <div class="operation-left-icon">
                ${operationIconHtml} <!-- Aquí se inserta el ícono correspondiente -->
            </div>
            <div class="operation-details">
                ${itemsHtml}
                <div class="operation-user-date">
                    <span class="user-name">${operation.usuario}</span>
                    <span class="operation-date">${operation.fecha_hora}</span>
                </div>
            </div>
            <div class="operation-right-icon">
                <button class="print-receipt-btn">Boton
                </button>
            </div>
        </div>
    `;

    container.append(operationHtml);
}

                    }
                }
        
                renderOperations(todayOperations, 'Hoy');
                renderOperations(yesterdayOperations, 'Ayer');
                renderOperations(last7DaysOperations, 'Últimos 7 días');
            },
            error: function(xhr, status, error) {
                console.error('Error fetching operations:', error);
            }
        });
        
    
    }

    function insert(isValid,user){
        if (isValid) {
            $.ajax({
                url: '/api/confirm_user',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ user: user, items: items, actionType: actionType }),
                success: function(response) {
                    alertabs('Items enviados correctamente','alert-success');
                    $('#userFormDiv').trigger('reset').addClass('d-none');
                    $('#scont').removeClass('d-none');
                    $('#userForm').trigger('reset');
                    document.getElementById('search').value = '';
                    $('#confirmed-items-container').empty();
                    updateOperations();
                },
                error: function(xhr) {
                    console.error('Error al confirmar usuario y ítems:', xhr.responseText);
                }
            });
        }
    }
    let confirmTimeout;
    let progressBar = $('#barraprog');
    const progressDuration = 4000; // 6 segundos
    let isCancelled = false;
     // 6 segundos
     function modstyle(isValid, user) {
        let ac = 'default';
        if (actionType === 'ingreso') {
            ac = 'Ingresando';
        }
        else if (actionType === 'retiro') {
            ac = 'Retirando';
        }
        
        $('#confirmed-items-card').addClass('border border-success-subtle border-4');
        $('#content-modal').addClass('border border-success');
        $('#confirmed-items-title').addClass('d-none');
        $('#cancel-container').removeClass('d-none');
        $('#cancel-container').append(`<div class="row d-flex justify-content-center align-items-center">
                                            <p class="fs-8 col-6">${user.nombre} ${user.apellido} <strong>${ac}</strong></p>
                                            <button type="button" class="btn btn-secondary col-5" id="cancelConfirm">Cancelar</button>
                                            </div>`);
                                        
        progressBar.removeClass('d-none');
        startProgressBar(isValid, user);
    }
    function stopProgressBar() {
        $('#confirmed-items-card').removeClass('border border-success-subtle border-4');
        $('#confirmed-items-title').removeClass('d-none');
        $('#cancel-container').addClass('d-none').empty();
        $('#content-modal').removeClass('border border-success');
        progressBar.addClass('d-none'); // Oculta la barra de progreso
        clearInterval(confirmTimeout);  // Detiene el temporizador
        isCancelled = true;  // Marca la acción como cancelada
    }
    
    function startProgressBar(isValid, user) {
        let width = 100;
        isCancelled = false;  // Resetea el estado de cancelación
        progressBar.css('width', `${width}%`);
    
        confirmTimeout = setInterval(() => {
            width -= 100 / (progressDuration / 10); // Reduce la barra en función del tiempo
            progressBar.css('width', `${width}%`);
            if (width <= 0) {
                clearInterval(confirmTimeout);
                if (!isCancelled) { // Solo inserta si no fue cancelado
                    insert(isValid, user);
                    stopProgressBar();
                }
            }
        }, 10);
    }
    $(document).on('click', '#cancelConfirm', function() {

        stopProgressBar();
    });
    
    $('#submitUserForm').on('click', function() {
        let user = {
            nombre: $('#nombre').val(),
            apellido: $('#apellido').val(),
            telefono: $('#telefono').val(),
            email: $('#email').val(),
            dni: $('#dni').val(),
            seccion: $('#seccion').val()
        };
    
        let isValid = true;
        $('#userForm .form-control').each(function() {
            if (!$(this).val()) {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });
    
        if (!$('#seccion').val()) {
            $('#seccion').addClass('is-invalid');
            isValid = false;
        } else {
            $('#seccion').removeClass('is-invalid');
        }
        
        if(isValid){
            modstyle(isValid, user);
        }
    });
    







    // document.querySelectorAll('.procesos a').forEach(button => {
    //     button.addEventListener('mouseenter', function() {
    //         const sibling = this.nextElementSibling || this.previousElementSibling;
    //         if (sibling) sibling.style.display = 'none';
    //     });
        
    //     button.addEventListener('mouseleave', function() {
    //         const sibling = this.nextElementSibling || this.previousElementSibling;
    //         if (sibling) sibling.style.display = 'flex';
    //     });
    // });






    $('#backToItemsForm').on('click', function() {
        $('#userFormDiv').addClass('d-none');
        $('#userFormDiv').addClass('animate__fadeInUp');
        $('#scont').removeClass('d-none');
    });
    let userSearchInput = $('#user-search');
    let userSearchResultsContainer = $('#user-search-results-container');
    let userSearchResults = $('#user-search-results');
    userSearchInput.on('input', function() {
        let query = $(this).val();
        if (query) {
            userSearchResultsContainer.show();
            fetchAndDisplayUsers(query);
        } else {
            userSearchResultsContainer.hide();
        }
    });

    // Función para obtener y mostrar usuarios
    function fetchAndDisplayUsers(query = '') {
        $.ajax({
            url: '/api/user_search',
            method: 'GET',
            data: { query: query },
            success: function(data) {
                userSearchResults.empty();
                data.forEach(user => {
                    userSearchResults.append(`
                        <div class="search-result-card" data-user='${JSON.stringify(user)}'>
                            <p>${user.nombre} ${user.apellido} - DNI: ${user.dni}</p>
                        </div>
                    `);
                });
                $('.search-result-card').on('click', function() {
                    let user = $(this).data('user');
                    $('#nombre').val(user.nombre).prop('disabled', false);
                    $('#apellido').val(user.apellido).prop('disabled', false);
                    $('#telefono').val(user.telefono).prop('disabled', false);
                    $('#email').val(user.email).prop('disabled', false);
                    $('#dni').val(user.dni).prop('disabled', false);
                    $('#seccion').val(user.seccion).prop('disabled', false);
                    userSearchResultsContainer.hide();
                });
            },
            error: function(error) {
                console.error('Error fetching users:', error);
            }
        });
    }

    // Cierra el contenedor de resultados si se hace clic fuera de él
    $(document).on('click', function(event) {
        if (!$(event.target).closest('#user-search-container').length) {
            userSearchResultsContainer.hide();
        }
    });
});
