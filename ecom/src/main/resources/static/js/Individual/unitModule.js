const unitModule = (() => {
    let locationData = [];

    // State variables
    let currentSearch = '';
    let currentSortBy = 'productName';
    let currentSortDir = 'asc';
    let currentPage = 0;     // 0-based page index
    const pageSize = 10;     // items per page

    // Fetch and render units from backend with current filters & pagination
    function fetchAndRenderUnits() {
        $('#loadingSpinner').removeClass('hidden');  // show spinner

        $.ajax({
            url: '/api/v1/individual',
            method: 'GET',
            dataType: 'json',
            data: {
                search: currentSearch,
                sortBy: currentSortBy,
                sortDir: currentSortDir,
                page: currentPage,
                size: pageSize
            },
            success: function(response) {
                const units = response.content || response;
                renderTable(units);
                renderPagination(response);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching units:', error);
                alert('Failed to load individual units. Try again later.');
            },
            complete: function() {
                $('#loadingSpinner').addClass('hidden');  // hide spinner after request finishes
            }
        });
    }

    // Render the table rows for units
    function renderTable(units) {
        const tbody = $('#unit-list');
        tbody.empty();

        if (!units || units.length === 0) {
            tbody.append('<tr><td colspan="6" class="text-center py-4">No units found.</td></tr>');
            return;
        }

        units.forEach(unit => {
            const storedAt = `${unit.section || ''} / ${unit.aisle || ''} / ${unit.bin || ''}`.trim().replace(/\/+$/, '');

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
          <td class="py-3 px-4 border-r border-gray-200">${escapeHtml(unit.productName)}</td>
          <td class="py-3 px-4 border-r border-gray-200">${escapeHtml(unit.skuCode)}</td>
          <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">${escapeHtml(unit.serialNumber)}</td>
          <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis" title="${escapeHtml(unit.note || '')}">
            ${escapeHtml(storedAt)}
          </td>
          <td class="py-3 px-4 text-center space-x-2">
            <button class="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition duration-200 btn-edit"
                    data-serial="${escapeHtml(unit.serialNumber)}" data-sku="${escapeHtml(unit.skuCode)}">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-200 btn-delete"
                    data-serial="${escapeHtml(unit.serialNumber)}" data-sku="${escapeHtml(unit.skuCode)}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      `;
            tbody.append(row);
        });
    }

    // Render pagination buttons
    function renderPagination(pageData) {
        const paginationContainer = $('#pagination');
        paginationContainer.empty();

        if (!pageData.totalPages || pageData.totalPages <= 1) return;

        // Prev button
        paginationContainer.append(`
          <button ${pageData.first ? 'disabled' : ''} id="prevPage" class="px-3 py-1 border rounded">Prev</button>
        `);

        // Page numbers (limit to max 10 pages for display, can be adjusted)
        let startPage = Math.max(0, currentPage - 4);
        let endPage = Math.min(pageData.totalPages - 1, currentPage + 5);

        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.append(`
              <button class="page-btn px-3 py-1 border rounded ${currentPage === i ? 'bg-purple-600 text-white' : ''}" data-page="${i}">${i + 1}</button>
            `);
        }

        // Next button
        paginationContainer.append(`
          <button ${pageData.last ? 'disabled' : ''} id="nextPage" class="px-3 py-1 border rounded">Next</button>
        `);

        // Bind events
        $('#prevPage').off('click').on('click', () => {
            if (currentPage > 0) {
                currentPage--;
                fetchAndRenderUnits();
            }
        });

        $('#nextPage').off('click').on('click', () => {
            if (currentPage < pageData.totalPages - 1) {
                currentPage++;
                fetchAndRenderUnits();
            }
        });

        $('.page-btn').off('click').on('click', function () {
            const page = Number($(this).data('page'));
            if (page !== currentPage) {
                currentPage = page;
                fetchAndRenderUnits();
            }
        });
    }

    // Escape HTML to avoid XSS
    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/[&<>"'`=\/]/g, s => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '`': '&#x60;',
            '=': '&#x3D;',
            '/': '&#x2F;'
        })[s]);
    }

    function loadLocations() {
        $.ajax({
            url: '/api/v1/admin/locations/all',
            method: 'GET',
            success: function(data) {
                locationData = data;
                populateLocationSelect();
            },
            error: function() {
                alert('Failed to load warehouse locations.');
            }
        });
    }

    function populateLocationSelect() {
        const select = $('#locationSelect');
        select.empty();
        select.append('<option value="">Select a location</option>');
        locationData.forEach(loc => {
            select.append(`<option value="${loc.locationId}">${loc.section} - ${loc.aisle || ''} - ${loc.bin || ''}</option>`);
        });
    }

    // Confirm delete with SweetAlert, then call API to delete by serialNumber
    function confirmDelete(serialNumber) {
        Swal.fire({
            title: 'Are you sure?',
            text: `Delete unit with serial number: ${serialNumber}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUnit(serialNumber);
            }
        });
    }

    // Delete unit ajax call
    function deleteUnit(serialNumber) {
        $('#loadingSpinner').removeClass('hidden');
        $.ajax({
            url: `/api/v1/individual/${encodeURIComponent(serialNumber)}`,
            method: 'DELETE',
            success: function() {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: `Unit with serial number ${serialNumber} deleted successfully.`,
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                });
                fetchAndRenderUnits();
            },
            error: function(xhr) {
                let errMsg = 'Failed to delete unit.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errMsg = xhr.responseJSON.message;
                } else if (xhr.responseText) {
                    errMsg = xhr.responseText;
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errMsg,
                });
            },
            complete: function() {
                $('#loadingSpinner').addClass('hidden');
            }
        });
    }

    // Bind UI event handlers
    function bindEvents() {
        $('#unit-list').on('click', '.btn-edit', function() {
            const serialNumber = $(this).data('serial');
            openEditOverlay(serialNumber);
        });

        $('#unit-list').on('click', '.btn-delete', function() {
            const serialNumber = $(this).data('serial');
            confirmDelete(serialNumber);
        });

        $('#cancelEdit, #closeOverlay').on('click', closeEditOverlay);

        $('#editForm').on('submit', function(e) {
            e.preventDefault();
            saveEdit();
        });

        $('#search').on('input', function() {
            currentSearch = $(this).val().trim();
            currentPage = 0; // reset page to first on new search
            fetchAndRenderUnits();
        });

        $('#sort-table').on('change', function() {
            const val = $(this).val();
            if (val === 'Product') currentSortBy = 'productName';
            else if (val === 'SKU') currentSortBy = 'skuCode';
            else if (val === 'Serial Number') currentSortBy = 'serialNumber';
            currentSortDir = 'asc';
            currentPage = 0; // reset page to first on new sort
            fetchAndRenderUnits();
        });
    }

    // Overlay open/close and save functions
    function openEditOverlay(serialNumber) {
        $('#serialNumber').val(serialNumber);
        $('#locationSelect').val('');
        $('#editOverlay').removeClass('hidden');
    }

    function closeEditOverlay() {
        $('#editOverlay').addClass('hidden');
    }

    function saveEdit() {
        const serialNumber = $('#serialNumber').val();
        const locationId = $('#locationSelect').val();

        if (!locationId) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Please select a location',
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to change the location for serial: ${serialNumber}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                const payload = {
                    serialNumber: serialNumber,
                    locationId: Number(locationId)
                };

                $.ajax({
                    url: '/api/v1/individual/update-location',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(payload),
                    success: function() {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Location updated successfully.',
                            timer: 2000,
                            showConfirmButton: false,
                            timerProgressBar: true,
                        });
                        closeEditOverlay();
                        fetchAndRenderUnits();
                    },
                    error: function(xhr) {
                        let errMsg = 'Failed to update location.';
                        if (xhr.responseJSON && xhr.responseJSON.message) {
                            errMsg = xhr.responseJSON.message;
                        } else if (xhr.responseText) {
                            errMsg = xhr.responseText;
                        }
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: errMsg,
                        });
                    }
                });
            }
        });
    }

    return {
        init: () => {
            bindEvents();
            fetchAndRenderUnits();
            loadLocations();
        }
    };
})();

export default unitModule;
