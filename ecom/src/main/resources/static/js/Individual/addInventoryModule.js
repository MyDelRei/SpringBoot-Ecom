const addInventoryModule = (() => {
    let locationData = [];
    let skuData = [];

    // Render location table
    function renderLocationTable(data) {
        const $tbody = $('#locationTableBody');
        $tbody.empty();

        data.forEach(loc => {
            const row = `
            <tr>
                <td class="py-3 px-4 border-b border-r border-gray-200">
                    <input type="checkbox" 
                        class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow 
                        hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" />
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

    // Fetch warehouse locations
    function fetchLocations() {
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
    }

    // Search filter for location table
    function setupSearch() {
        $('#searchStockSectionInput').on('input', function () {
            const searchVal = $(this).val().toLowerCase();
            const filteredData = locationData.filter(loc =>
                loc.warehouse.toLowerCase().includes(searchVal) ||
                loc.section.toLowerCase().includes(searchVal) ||
                loc.aisle.toLowerCase().includes(searchVal) ||
                loc.bin.toLowerCase().includes(searchVal)
            );
            renderLocationTable(filteredData);
        });
    }

    // Autocomplete for warehouseStockInput
    let selectedLocationId = null;  // store selected location id here
    function setupAutocomplete() {
        const $input = $('#warehouseStockInput');
        const $suggestions = $('#warehouseSuggestions');

        $input.on('input', function () {
            const searchVal = $(this).val().toLowerCase();
            $suggestions.empty();

            if (!searchVal) {
                $suggestions.addClass('hidden');
                selectedLocationId = null;
                return;
            }

            const matches = locationData.filter(loc =>
                loc.warehouse.toLowerCase().includes(searchVal) ||
                loc.section.toLowerCase().includes(searchVal) ||
                loc.aisle.toLowerCase().includes(searchVal) ||
                loc.bin.toLowerCase().includes(searchVal)
            );

            if (matches.length === 0) {
                $suggestions.addClass('hidden');
                selectedLocationId = null;
                return;
            }

            matches.forEach(loc => {
                const li = $(`
                    <li 
                        class="px-4 py-2 cursor-pointer hover:bg-indigo-100" 
                        data-location-id="${loc.locationId}"
                    >
                        ${loc.warehouse} - ${loc.section} - ${loc.aisle} - ${loc.bin}
                    </li>
                `);

                li.on('click', function () {
                    $input.val(`${loc.warehouse} - ${loc.section} - ${loc.aisle} - ${loc.bin}`);
                    $suggestions.empty().addClass('hidden');

                    selectedLocationId = $(this).data('location-id'); // Save selected location id
                    console.log("Selected location ID:", selectedLocationId);
                    console.log("Selected location object:", loc);
                });

                $suggestions.append(li);
            });

            $suggestions.removeClass('hidden');
        });

        // Hide suggestions when clicking outside
        $(document).on('click', function (e) {
            if (!$(e.target).closest('#warehouseStockInput, #warehouseSuggestions').length) {
                $suggestions.addClass('hidden');
            }
        });
    }

    // Fetch SKU data for autocomplete
    let selectedSku = null;  // store selected sku object
    function fetchSkuData() {
        $.ajax({
            url: '/api/inventory/non-serialized-arrivals',
            method: 'GET',
            success: function (data) {
                skuData = data;
                // console.log("SKU data loaded:", skuData);
            },
            error: function () {
                alert('Failed to load SKU data');
            }
        });
    }

    // Setup autocomplete for SKU input and autofill fields
    function setupSkuAutocomplete() {
        const $skuInput = $('#skuForChecking');
        const $suggestions = $('#skuSuggestions');
        const $qtyReceived = $('#QtyReceived');
        const $arrivalDate = $('#ArrivalDate');
        const $skuField = $('#SKU');

        $skuInput.on('input', function () {
            const val = $(this).val().toLowerCase().trim();
            $suggestions.empty();

            if (!val) {
                $suggestions.addClass('hidden');
                selectedSku = null;
                return;
            }

            const matches = skuData.filter(sku => sku.skuCode.toLowerCase().includes(val));

            if (matches.length === 0) {
                $suggestions.addClass('hidden');
                selectedSku = null;
                return;
            }

            matches.forEach((sku, index) => {
                const li = $(`<li class="px-4 py-2 cursor-pointer hover:bg-indigo-100"></li>`);
                li.text(`${sku.skuCode} (Arrival ID: ${sku.arrivalId})`);
                li.data('index', index);

                li.on('click', function () {
                    const selected = skuData[$(this).data('index')];
                    if (!selected) return;

                    selectedSku = selected;  // Save selected sku

                    $skuInput.val(selected.skuCode);
                    $skuField.val(selected.skuCode);
                    $qtyReceived.val(selected.quantityReceived);

                    if (selected.arrivalDate) {
                        const d = new Date(selected.arrivalDate);
                        const formatted = d.toISOString().split('T')[0]; // yyyy-mm-dd
                        $arrivalDate.val(formatted);
                    } else {
                        $arrivalDate.val('');
                    }

                    $suggestions.empty().addClass('hidden');
                });

                $suggestions.append(li);
            });

            $suggestions.removeClass('hidden');
        });

        // Hide SKU suggestions when clicking outside
        $(document).on('click', function (e) {
            if (!$(e.target).closest('#skuForChecking, #skuSuggestions').length) {
                $suggestions.addClass('hidden');
            }
        });
    }

    // Save inventory entry function
    function saveInventoryEntry() {
        // Grab needed values from form and selected data
        const quantityStored = $('#QtyStored').val().trim();
        if (!selectedSku) {
            alert("Please select a SKU from the suggestions.");
            return;
        }
        if (!selectedLocationId) {
            alert("Please select a warehouse location from the suggestions.");
            return;
        }
        if (!quantityStored || isNaN(quantityStored) || Number(quantityStored) <= 0) {
            alert("Please enter a valid quantity stored.");
            return;
        }

        const payload = {
            arrivalId: selectedSku.arrivalId,
            skuId: selectedSku.skuId,
            quantityStored: Number(quantityStored),
            currentLocationId: selectedLocationId
        };

        console.log("Saving inventory entry:", payload);

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to save this inventory entry?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/api/inventory/create',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(payload),
                    success: function (res) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Inventory saved!',
                            text: `The inventory entry has been ${res} `
                        });
                        // Optionally reset form or values here
                        $('#addIndividualForm')[0].reset();

                        // If you want to clear suggestions or other UI elements, do that here too
                        $('#skuSuggestions').empty().addClass('hidden');
                        $('#warehouseSuggestions').empty().addClass('hidden');

                    },
                    error: function (xhr) {
                        Swal.fire({
                            icon: 'error',
                            title: `Transaction Failed`,
                            text: xhr.responseText || 'Please wait patiently for connection.'
                        });
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    icon: 'info',
                    title: 'Cancelled',
                    text: 'Inventory save cancelled.'
                });
            }
        });

    }

    // Setup form submit handler
    function setupFormSubmit() {
        $('#addIndividualForm').on('submit', function (e) {
            e.preventDefault();
            saveInventoryEntry();
        });
    }

    return {
        init: function () {
            fetchLocations();
            setupSearch();
            setupAutocomplete();

            fetchSkuData();
            setupSkuAutocomplete();

            setupFormSubmit();
        },
        getLocationData: function () {
            return locationData;
        }
    };
})();

export default addInventoryModule;
