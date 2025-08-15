$(document).ready(function () {
    let skuData = [];
    let locationData = [];

    // Object to keep track of selected IDs including arrivalId
    let selectedData = {
        skuId: null,
        arrivalId: null,
        locationId: null
    };

    function fillArrivalDetails(data) {
        const qtyReceived = data.quantityReceived ?? data.quantity_received ?? '';
        $('#QtyReceived').val(qtyReceived);

        function formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            if (isNaN(date)) return '';
            return date.toISOString().split('T')[0];
        }
        const arrivalDate = formatDate(data.arrivalDate ?? data.arrival_date);
        $('#ArrivalDate').val(arrivalDate);
    }

    // Load SKU data
    $.ajax({
        url: '/api/v1/individual/arrival-sku/paid',
        method: 'GET',
        success: function (data) {
            skuData = data;
            console.log("Loaded SKU data:", skuData);
        },
        error: function () {
            alert('Failed to load SKUs.');
        }
    });

    // Load warehouse location data
    $.ajax({
        url: '/api/v1/admin/locations/all',
        method: 'GET',
        success: function (data) {
            locationData = data;
            console.log("Loaded location data:", locationData);
            renderLocationTable(locationData);
        },
        error: function () {
            alert('Failed to load warehouse locations.');
        }
    });

    // SKU autocomplete input handler
    $('#skuForChecking').on('input focus', function () {
        const val = $(this).val().toLowerCase();
        const filtered = skuData.filter(sku => sku.skuCode.toLowerCase().includes(val));

        const $list = $('#skuSuggestions');
        $list.empty();

        if (filtered.length === 0 || val.trim() === '') {
            $list.hide();
            return;
        }

        filtered.forEach(sku => {
            $('<li>')
                .text(`${sku.skuCode} (Arrival ID: ${sku.arrivalId})`)
                .attr('data-sku-id', sku.skuId)
                .attr('data-arrival-id', sku.arrivalId)
                .addClass('px-4 py-2 cursor-pointer hover:bg-indigo-100')
                .appendTo($list);
        });

        $list.show();
    });

    // SKU suggestions click handler
    $('#skuSuggestions').on('click', 'li', function () {
        const skuText = $(this).text();
        const skuCode = skuText.substring(0, skuText.indexOf(' ('));
        const skuId = $(this).data('sku-id');
        const arrivalId = $(this).data('arrival-id');

        console.log("Selected:", { skuCode, skuId, arrivalId });

        $('#skuForChecking').val(skuCode);
        $('#SKU').val(skuCode);
        selectedData.skuId = skuId;
        selectedData.arrivalId = arrivalId;

        $('#skuSuggestions').hide();

        $.ajax({
            url: `/api/v1/individual/details/${arrivalId}`,
            method: 'GET',
            success: function (data) {
                console.log("Arrival details:", data);

                if (Array.isArray(data) && data.length > 0) {
                    fillArrivalDetails(data[0]);
                } else if (data) {
                    fillArrivalDetails(data);
                }
            },
            error: function () {
                alert('Failed to load arrival details.');
            }
        });
    });

    // Reset selected skuId and arrivalId if user types manually
    $('#skuForChecking').on('input', function () {
        selectedData.skuId = null;
        selectedData.arrivalId = null;
    });

    // Warehouse stock autocomplete input handler
    $('#warehouseStockInput').on('input focus', function () {
        const val = $(this).val().toLowerCase();
        const filtered = locationData.filter(loc =>
            loc.warehouse.toLowerCase().includes(val) ||
            loc.section.toLowerCase().includes(val) ||
            loc.aisle.toLowerCase().includes(val) ||
            loc.bin.toLowerCase().includes(val)
        );

        const $list = $('#warehouseSuggestions');
        $list.empty();

        if (filtered.length === 0 || val.trim() === '') {
            $list.hide();
            return;
        }

        filtered.forEach(loc => {
            const displayText = `${loc.warehouse} - Section: ${loc.section}, Aisle: ${loc.aisle}, Bin: ${loc.bin}`;
            $('<li>')
                .text(displayText)
                .attr('data-location-id', loc.locationId)
                .addClass('px-4 py-2 cursor-pointer hover:bg-indigo-100')
                .appendTo($list);
        });

        $list.show();
    });

    // Warehouse suggestions click handler
    $('#warehouseSuggestions').on('click', 'li', function () {
        const locationText = $(this).text();
        const locationId = $(this).data('location-id');

        console.log("Selected location:", { locationText, locationId });

        $('#warehouseStockInput').val(locationText);
        selectedData.locationId = locationId;

        $('#warehouseSuggestions').hide();
    });

    // Reset selected locationId if user types manually
    $('#warehouseStockInput').on('input', function () {
        selectedData.locationId = null;
    });

    // Render location table
    function renderLocationTable(data) {
        const $tbody = $('#locationTableBody');
        $tbody.empty();

        data.forEach(loc => {
            const row = `
            <tr>
                <td class="py-3 px-4 border-b border-r border-gray-200">
                    <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" />
                </td>
                <td class="py-3 px-4 border-b border-r border-gray-200">${loc.warehouse}</td>
                <td class="py-3 px-4 border-b border-r border-gray-200">${loc.section}</td>
                <td class="py-3 px-4 border-b border-r border-gray-200">${loc.aisle}</td>
                <td class="py-3 px-4 border-b border-gray-200">${loc.bin}</td>
            </tr>
            `;
            $tbody.append(row);
        });
    }

    // Hide suggestion lists when clicking outside inputs or lists
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#skuForChecking, #skuSuggestions').length) {
            $('#skuSuggestions').hide();
        }
        if (!$(e.target).closest('#warehouseStockInput, #warehouseSuggestions').length) {
            $('#warehouseSuggestions').hide();
        }
    });

    // Submit form with Swal confirmation and POST to API
    $('#addIndividualForm').on('submit', function (e) {
        e.preventDefault();

        const skuId = selectedData.skuId;
        const arrivalId = selectedData.arrivalId;
        const locationId = selectedData.locationId;
        const serialNumber = $('#serialNumber').val().trim();

        if (!skuId) {
            Swal.fire('Error', 'Please select a SKU from the list.', 'error');
            return;
        }
        if (!arrivalId) {
            Swal.fire('Error', 'Arrival ID missing. Please select a SKU again.', 'error');
            return;
        }
        if (!locationId) {
            Swal.fire('Error', 'Please select a warehouse location from the list.', 'error');
            return;
        }
        if (serialNumber.length > 450) {
            Swal.fire('Error', 'Serial number cannot exceed 450 characters.', 'error');
            return;
        }

        // Validate SKU input matches selected skuId
        const skuInputVal = $('#skuForChecking').val().trim().toLowerCase();
        const matchedSku = skuData.find(sku => sku.skuCode.toLowerCase() === skuInputVal);
        if (!matchedSku || matchedSku.skuId !== skuId) {
            Swal.fire('Error', 'SKU input does not match the selected SKU. Please select a SKU from the suggestions.', 'error');
            return;
        }

        // Validate location input matches selected locationId
        const locInputVal = $('#warehouseStockInput').val().trim().toLowerCase();
        const matchedLocation = locationData.find(loc => {
            const displayText = `${loc.warehouse} - Section: ${loc.section}, Aisle: ${loc.aisle}, Bin: ${loc.bin}`.toLowerCase();
            return displayText === locInputVal;
        });
        if (!matchedLocation || matchedLocation.locationId !== locationId) {
            Swal.fire('Error', 'Warehouse location input does not match the selected location. Please select a location from the suggestions.', 'error');
            return;
        }

        const postData = {
            skuId: skuId,
            arrivalId: arrivalId,
            serialNumber: serialNumber,
            currentLocationId: locationId
        };

        Swal.fire({
            title: 'Confirm',
            text: "Are you sure you want to save this individual unit?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Disable submit button to prevent double submit
                $('#submitBtn').attr('disabled', true);

                console.log("Posting data:", postData);

                $.ajax({
                    url: '/api/v1/individual',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(postData),
                    success: function (response) {
                        Swal.fire('Success', 'Individual unit saved successfully!', 'success');
                        $('#addIndividualForm')[0].reset();
                        selectedData.skuId = null;
                        selectedData.arrivalId = null;
                        selectedData.locationId = null;
                        $('#QtyReceived').val('');
                        $('#ArrivalDate').val('');
                    },
                    error: function (xhr) {
                        const msg = xhr.responseJSON?.message || 'Failed to save individual unit.';
                        Swal.fire('Error', msg, 'error');
                    },
                    complete: function () {
                        $('#submitBtn').attr('disabled', false);
                    }
                });
            }
        });
    });


});
