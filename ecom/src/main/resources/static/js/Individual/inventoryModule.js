// InventoryModule.js
const InventoryModule = (() => {
    let currentPage = 0;
    let pageSize = 5;
    let searchTerm = '';

    // Cache DOM elements
    const $unitList = $('#unit-list');
    const $pagination = $('#pagination');
    const $searchInput = $('#search');
    const $overlay = $('#editOverlay');
    const $skuField = $('#serialNumber'); // overlay SKU field
    const $locationSelect = $('#locationSelect'); // overlay location dropdown
    const $editForm = $('#editForm');
    const $closeOverlayBtn = $('#closeOverlay');
    const $cancelEditBtn = $('#cancelEdit');

    // Store current skuCode for update reference
    let currentSkuCode = null;

    // Fetch inventory list from API
    function fetchInventory() {
        showLoading(true);
        $.ajax({
            url: `/api/inventory/search`,
            method: 'GET',
            data: {
                searchTerm,
                page: currentPage,
                pageSize
            },
            success: function (res) {
                console.log(res.content);
                renderTable(res.content);
                renderPagination(res.totalElements, res.size, res.number);
            },
            error: function () {
                Swal.fire('Error', 'Failed to load inventory data.', 'error');
            },
            complete: () => showLoading(false)
        });
    }

    // Render table rows
    function renderTable(items) {
        $unitList.empty();
        if (items.length === 0) {
            $unitList.append('<tr><td colspan="6" class="text-center py-4">No data found</td></tr>');
            return;
        }

        items.forEach(item => {
            const row = `
        <tr class="border-b border-gray-200 hover:bg-gray-50">
          <td class="py-3 px-4 border-r border-gray-200">
            <div class="inline-flex items-center">
              <label class="flex items-center cursor-pointer relative">
                <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" />
                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </span>
              </label>
            </div>
          </td>
          <td class="py-3 px-4 border-r border-gray-200">${escapeHtml(item.productName)}</td>
          <td class="py-3 px-4 border-r border-gray-200">${escapeHtml(item.skuCode)}</td>
          <td class="py-3 px-4 border-gray-200">${item.quantityStored}</td>
          <td class="py-3 px-4 border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">${escapeHtml(item.currentLocation)}</td>
          <td class="py-3 px-4 text-center space-x-2">
            <button 
              class="open-overlay-btn text-indigo-600 hover:text-indigo-900"
              data-sku="${escapeHtml(item.skuCode)}"
              data-id="${item.inventoryId || ''}"
            >
              Edit
            </button>
          </td>
        </tr>
      `;
            $unitList.append(row);
        });
    }

    // Render pagination controls
    function renderPagination(totalItems, pageSize, currentPage) {
        $pagination.empty();
        const totalPages = Math.ceil(totalItems / pageSize);

        if (currentPage > 0) {
            $pagination.append(`<button class="page-btn" data-page="${currentPage - 1}">Prev</button>`);
        }

        for (let i = 0; i < totalPages; i++) {
            const activeClass = i === currentPage ? 'font-bold underline' : '';
            $pagination.append(`<button class="page-btn ${activeClass}" data-page="${i}">${i + 1}</button>`);
        }

        if (currentPage < totalPages - 1) {
            $pagination.append(`<button class="page-btn" data-page="${currentPage + 1}">Next</button>`);
        }
    }

    // Show/hide loading spinner
    function showLoading(show) {
        if (show) {
            $('#loadingSpinner').removeClass('hidden');
        } else {
            $('#loadingSpinner').addClass('hidden');
        }
    }

    // Escape HTML helper
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Load locations into select dropdown
    function loadLocations() {
        $locationSelect.empty().append('<option>Loading locations...</option>');
        return $.ajax({
            url: '/api/v1/admin/locations/all',
            method: 'GET',
            success: function(locations) {
                $locationSelect.empty();
                if (locations.length === 0) {
                    $locationSelect.append('<option value="">No locations found</option>');
                    return;
                }
                $locationSelect.append('<option value="">-- Select Location --</option>');
                locations.forEach(loc => {
                    const option = `<option value="${loc.locationId}">${escapeHtml(loc.section)} - ${escapeHtml(loc.aisle)} : ${escapeHtml(loc.note)}</option>`;
                    $locationSelect.append(option);
                });
            },
            error: function () {
                $locationSelect.empty().append('<option value="">Failed to load locations</option>');
            }
        });
    }

    // Setup event listeners
    function setupListeners() {
        let searchTimeout;
        $searchInput.on('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchTerm = $(this).val();
                currentPage = 0;
                fetchInventory();
            }, 400);
        });

        $pagination.on('click', '.page-btn', function () {
            currentPage = parseInt($(this).data('page'));
            fetchInventory();
        });

        $unitList.on('click', '.open-overlay-btn', function () {
            const skuCode = $(this).data('sku');
            currentSkuCode = skuCode; // keep track
            $skuField.val(skuCode);

            // Load locations then show overlay
            loadLocations().then(() => {
                $overlay.removeClass('hidden');
            });
        });

        $closeOverlayBtn.on('click', closeOverlay);
        $cancelEditBtn.on('click', closeOverlay);

        $editForm.on('submit', function (e) {
            e.preventDefault();

            const selectedLocationId = $locationSelect.val();
            if (!selectedLocationId) {
                Swal.fire('Warning', 'Please select a location', 'warning');
                return;
            }

            // Confirm with Swal
            Swal.fire({
                title: 'Confirm Location Update',
                text: `Move SKU "${currentSkuCode}" to selected location?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, update it',
            }).then((result) => {
                if (result.isConfirmed) {
                    updateLocation(selectedLocationId);
                }
            });
        });
    }

    // Call update API
    function updateLocation(locationId) {
        // Here you need the inventory ID to send in DTO
        // You must have inventoryId from your item or overlay data
        // For demo, I'm assuming you added data attribute to button with inventoryId

        // Get inventoryId from button with currentSkuCode (find in the list)
        const $btn = $unitList.find(`button.open-overlay-btn[data-sku="${currentSkuCode}"]`);
        const inventoryId = $btn.data('id');
        console.log(inventoryId);

        if (!inventoryId) {
            Swal.fire('Error', 'Inventory ID not found. Cannot update.', 'error');
            return;
        }

        $.ajax({
            url: '/api/inventory/update-location',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                inventoryId: inventoryId,
                currentLocationId: locationId
            }),
            success: function () {
                Swal.fire('Success', 'Location updated successfully!', 'success');
                closeOverlay();
                fetchInventory();
            },
            error: function (xhr) {
                const msg = xhr.responseJSON?.message || 'Failed to update location.';
                Swal.fire('Error', msg, 'error');
            }
        });
    }

    function closeOverlay() {
        $overlay.addClass('hidden');
        $editForm[0].reset();
        $locationSelect.empty();
        currentSkuCode = null;
    }

    // Public init
    function init() {
        fetchInventory();
        setupListeners();
    }

    return { init };
})();

export default InventoryModule;
