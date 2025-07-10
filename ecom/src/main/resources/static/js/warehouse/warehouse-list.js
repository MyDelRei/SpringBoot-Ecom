$(document).ready(function () {
    let allWarehouses = [];
    let currentSearchTerm = '';
    let currentSortBy = 'Warehouse'; // default sort key
    let rowsPerPage = 5;
    let currentPage = 1;
    let totalPages = 1;

    function renderTable(warehousesToRender) {
        const tbody = $("table tbody");
        tbody.empty();

        totalPages = Math.ceil(warehousesToRender.length / rowsPerPage);
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginated = warehousesToRender.slice(start, end);

        if (paginated.length === 0) {
            tbody.append('<tr><td colspan="5" class="py-3 px-4 text-center text-gray-500">No warehouses found.</td></tr>');
            renderPagination();
            return;
        }

        paginated.forEach(wh => {
            const row = `
        <tr class="border-b border-gray-200 hover:bg-gray-50">
          <td class="py-3 px-4 border-r border-gray-200">
            <div class="inline-flex items-center">
              <label class="flex items-center cursor-pointer relative">
                <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" id="check-${wh.warehouseId}" />
                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </span>
              </label>
            </div>
          </td>
          <td class="py-3 px-4 border-r border-gray-200">${wh.warehouseName}</td>
          <td class="py-3 px-4 border-r border-gray-200">${wh.location}</td>
          <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">${wh.description}</td>
          <td class="py-3 px-4 text-center space-x-2">
            <button id="edit-warehouse" class="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition duration-200"
              data-id="${wh.warehouseId}" data-name="${wh.warehouseName}" data-location="${wh.location}" data-description="${wh.description}">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button id="delete-warehouse" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-200"
              data-id="${wh.warehouseId}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      `;
            tbody.append(row);
        });

        renderPagination();
    }

    function renderPagination() {
        const container = $("#pagination");
        container.empty();

        if (totalPages <= 1) return;

        const appendPageButton = (page, isActive) => {
            const activeClass = isActive ? 'bg-indigo-600 text-white font-semibold shadow-md' : 'hover:bg-gray-200';
            container.append(`<button class="pagination-btn px-3 py-1 rounded-lg transition duration-200 ${activeClass}" data-page="${page}">${page}</button>`);
        };

        const appendEllipsis = () => container.append(`<span class="px-3 py-1 text-gray-500">...</span>`);

        // Prev button
        container.append(`
      <button class="prev-btn p-2 rounded-lg hover:bg-gray-200 transition duration-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}">
        <i class="fas fa-chevron-left text-sm"></i>
      </button>
    `);

        const pageNumbers = new Set([1]);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < totalPages) pageNumbers.add(i);
        }
        if (totalPages > 1) pageNumbers.add(totalPages);

        const sortedPages = Array.from(pageNumbers).sort((a, b) => a - b);
        let lastPage = 0;

        sortedPages.forEach(page => {
            if (page > lastPage + 1) appendEllipsis();
            appendPageButton(page, page === currentPage);
            lastPage = page;
        });

        // Next button
        container.append(`
      <button class="next-btn p-2 rounded-lg hover:bg-gray-200 transition duration-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}">
        <i class="fas fa-chevron-right text-sm"></i>
      </button>
    `);
    }

    function applySortAndSearch(resetPage = true) {
        let filtered = allWarehouses.slice();

        if (currentSearchTerm) {
            const term = currentSearchTerm.toLowerCase();
            filtered = filtered.filter(w =>
                (w.warehouseName && w.warehouseName.toLowerCase().includes(term)) ||
                (w.location && w.location.toLowerCase().includes(term)) ||
                (w.description && w.description.toLowerCase().includes(term))
            );
        }

        filtered.sort((a, b) => {
            let valA = '', valB = '';
            switch (currentSortBy) {
                case 'Warehouse':
                    valA = a.warehouseName ? a.warehouseName.toLowerCase() : '';
                    valB = b.warehouseName ? b.warehouseName.toLowerCase() : '';
                    break;
                case 'Location':
                    valA = a.location ? a.location.toLowerCase() : '';
                    valB = b.location ? b.location.toLowerCase() : '';
                    break;
                case 'Description':
                    valA = a.description ? a.description.toLowerCase() : '';
                    valB = b.description ? b.description.toLowerCase() : '';
                    break;
                default:
                    valA = a.warehouseName ? a.warehouseName.toLowerCase() : '';
                    valB = b.warehouseName ? b.warehouseName.toLowerCase() : '';
                    break;
            }
            return valA.localeCompare(valB);
        });

        if (resetPage) currentPage = 1;

        renderTable(filtered);
    }


    // Fetch initial data
    if (typeof ajaxHelper === 'undefined') {
        console.warn("ajaxHelper undefined, using mock data.");
        allWarehouses = [
            { warehouseId: 'w1', name: 'Main Warehouse', location: 'Phnom Penh', description: 'Primary storage' },
            { warehouseId: 'w2', name: 'Secondary Warehouse', location: 'Siem Reap', description: 'Backup storage' },
            { warehouseId: 'w3', name: 'Remote Warehouse', location: 'Battambang', description: 'Remote location' },
            // Add more mock warehouses if needed
        ];
        applySortAndSearch();
    } else {
        ajaxHelper.get('/api/v1/admin/warehouses', function (data) {
            allWarehouses = data;
            console.log(allWarehouses)
            applySortAndSearch();
        });
    }

    // Event listeners for sorting, searching, pagination
    $('#sort-table').on('change', function () {
        currentSortBy = $(this).val();
        applySortAndSearch(true);
    });

    $('#search').on('input', function () {
        currentSearchTerm = $(this).val();
        applySortAndSearch(true);
    });

    $(document).on('click', '.pagination-btn', function () {
        currentPage = parseInt($(this).data('page'));
        applySortAndSearch(false);
    });

    $(document).on('click', '.prev-btn', function () {
        if (currentPage > 1) {
            currentPage--;
            applySortAndSearch(false);
        }
    });

    $(document).on('click', '.next-btn', function () {
        if (currentPage < totalPages) {
            currentPage++;
            applySortAndSearch(false);
        }
    });

    // Overlay & edit functionality
    let warehouseData = {};
    const $overlay = $('#myOverlay');
    const $overlayContentWrapper = $overlay.find('.overlay-content-wrapper');
    const $closeBtn = $('#cancelButton');

    function openOverlay(data) {
        warehouseData = data;
        $overlay.removeClass('invisible opacity-0').addClass('visible opacity-100');
        $overlayContentWrapper.removeClass('-translate-y-full').addClass('translate-y-0');
        $('body').css('overflow', 'hidden');

        $('#warehouseName').val(data.warehousName);
        $('#location').val(data.location);
        $('#description').val(data.description);
    }

    function closeOverlay() {
        $overlayContentWrapper.addClass('-translate-y-full').removeClass('translate-y-0');
        setTimeout(() => {
            $overlay.addClass('invisible opacity-0').removeClass('visible opacity-100');
            $('body').css('overflow', '');
        }, 500);
    }

    $closeBtn.on('click', closeOverlay);
    $overlay.on('click', e => { if (e.target === $overlay[0]) closeOverlay(); });
    $(document).on('keydown', e => { if (e.key === 'Escape' && !$overlay.hasClass('invisible')) closeOverlay(); });

    // Edit button click
    $(document).on('click', '#edit-warehouse', function () {
        const data = {
            warehouseId: $(this).data('id'),
            warehousName: $(this).data('name'),
            location: $(this).data('location'),
            description: $(this).data('description')
        };
        openOverlay(data);
    });

    // Delete button click with Swal confirmation
    $(document).on('click', '#delete-warehouse', function () {
        const warehouseId = $(this).data('id');

        Swal.fire({
            title: 'Delete Warehouse?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (!result.isConfirmed) return;

            if (typeof ajaxHelper !== 'undefined') {
                ajaxHelper.post('/api/v1/admin/warehouses/delete-warehouse', { warehouseId }, function (response) {
                    Swal.fire('Deleted!', 'Warehouse has been deleted.', 'success');
                    ajaxHelper.get('/api/v1/admin/warehouses', function (data) {
                        allWarehouses = data;
                        applySortAndSearch(true);
                    });
                }, function (err) {
                    Swal.fire('Error', 'Failed to delete warehouse.', 'error');
                });
            } else {
                // Mock delete
                allWarehouses = allWarehouses.filter(w => w.warehouseId !== warehouseId);
                applySortAndSearch(true);
                Swal.fire('Deleted!', 'Warehouse has been deleted.', 'success');
            }
        });
    });

    // Update form submit
    $('#UpdateWarehouseForm').on('submit', function (e) {
        e.preventDefault();

        const data = {
            warehouseId: warehouseData.warehouseId,
            warehouseName: $('#warehouseName').val(),
            location: $('#location').val(),
            description: $('#description').val()
        };
        console.log(data)

        Swal.fire({
            title: 'Update Warehouse?',
            text: 'Do you want to save these changes?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (!result.isConfirmed) return;

            if (typeof ajaxHelper !== 'undefined') {
                ajaxHelper.put('/api/v1/admin/warehouses', data, function (response) {
                    console.log(data)
                    Swal.fire('Updated!', 'Warehouse updated successfully.', 'success');
                    ajaxHelper.get('/api/v1/admin/warehouses', function (data) {
                        allWarehouses = data;
                        applySortAndSearch(true);
                    });
                }, function (err) {
                    Swal.fire('Error', 'Failed to update warehouse.', 'error');
                });
            }   else {
            // Mock update
            allWarehouses = allWarehouses.map(w =>
                w.warehouseId === data.warehouseId ? { ...w, ...data } : w
            );
            applySortAndSearch(true);
            Swal.fire('Updated!', 'Warehouse updated successfully.', 'success');
        }

        closeOverlay();
    });
});
});

