$(document).ready(function () {
    let allLocations = [];
    let currentSearchTerm = '';
    let currentSortBy = 'Section'; // default sort key
    let rowsPerPage = 5;
    let currentPage = 1;
    let totalPages = 1;

    function renderTable(locationsToRender) {
        const tbody = $("table tbody");
        tbody.empty();

        totalPages = Math.ceil(locationsToRender.length / rowsPerPage);
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginated = locationsToRender.slice(start, end);

        if (paginated.length === 0) {
            tbody.append('<tr><td colspan="5" class="py-3 px-4 text-center text-gray-500">No locations found.</td></tr>');
            renderPagination();
            return;
        }

        paginated.forEach(loc => {
            const row = `
                <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-4 border-r border-gray-200">
                        <div class="inline-flex items-center">
                            <label class="flex items-center cursor-pointer relative">
                                <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" id="check-${loc.locationId}" />
                                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                </span>
                            </label>
                        </div>
                    </td>
                    <td class="py-3 px-4 border-r border-gray-200">${loc.section}</td>
                    <td class="py-3 px-4 border-r border-gray-200">${loc.aisle}</td>
                    <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">${loc.bin}</td>
                    <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">${loc.note || ''}</td>
                    <td class="py-3 px-4 text-center space-x-2">
                        
                        <button id="delete-location" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-200"
                            data-id="${loc.locationId}">
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

        container.append(`
            <button class="next-btn p-2 rounded-lg hover:bg-gray-200 transition duration-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}">
                <i class="fas fa-chevron-right text-sm"></i>
            </button>
        `);
    }

    function applySortAndSearch(resetPage = true) {
        let filtered = allLocations.slice();

        if (currentSearchTerm) {
            const term = currentSearchTerm.toLowerCase();
            filtered = filtered.filter(loc =>
                (loc.section && loc.section.toLowerCase().includes(term)) ||
                (loc.aisle && loc.aisle.toLowerCase().includes(term)) ||
                (loc.bin && loc.bin.toLowerCase().includes(term)) ||
                (loc.note && loc.note.toLowerCase().includes(term))
            );
        }

        filtered.sort((a, b) => {
            let valA = '', valB = '';
            switch (currentSortBy) {
                case 'Section':
                    valA = a.section ? a.section.toLowerCase() : '';
                    valB = b.section ? b.section.toLowerCase() : '';
                    break;
                case 'Aisle':
                    valA = a.aisle ? a.aisle.toLowerCase() : '';
                    valB = b.aisle ? b.aisle.toLowerCase() : '';
                    break;
                case 'Bin':
                    valA = a.bin ? a.bin.toLowerCase() : '';
                    valB = b.bin ? b.bin.toLowerCase() : '';
                    break;
                case 'Note':
                    valA = a.note ? a.note.toLowerCase() : '';
                    valB = b.note ? b.note.toLowerCase() : '';
                    break;
                default:
                    valA = a.section ? a.section.toLowerCase() : '';
                    valB = b.section ? b.section.toLowerCase() : '';
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
        allLocations = [
            { locationId: 'l1', section: 'A', aisle: '1', bin: '101', note: 'Main storage' },
            { locationId: 'l2', section: 'B', aisle: '2', bin: '201', note: 'Secondary storage' },
            { locationId: 'l3', section: 'C', aisle: '3', bin: '301', note: 'Remote storage' }
        ];
        applySortAndSearch();
    } else {
        ajaxHelper.get('/api/v1/admin/locations', function (data) {
            allLocations = data;
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
    let locationData = {};
    const $overlay = $('#myOverlay');
    const $overlayContentWrapper = $overlay.find('.overlay-content-wrapper');
    const $closeBtn = $('#cancelButton');

    function openOverlay(data) {
        locationData = data;
        $overlay.removeClass('invisible opacity-0').addClass('visible opacity-100');
        $overlayContentWrapper.removeClass('-translate-y-full').addClass('translate-y-0');
        $('body').css('overflow', 'hidden');

        $('#section').val(data.section);
        $('#aisle').val(data.aisle);
        $('#bin').val(data.bin);
        $('#note').val(data.note);
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
    $(document).on('click', '#edit-location', function () {
        const data = {
            locationId: $(this).data('id'),
            section: $(this).data('section'),
            aisle: $(this).data('aisle'),
            bin: $(this).data('bin'),
            note: $(this).data('note')
        };
        openOverlay(data);
    });

    // Delete button click with Swal confirmation
    $(document).on('click', '#delete-location', function () {
        const locationId = $(this).data('id');

        Swal.fire({
            title: 'Delete Location?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (!result.isConfirmed) return;

            if (typeof ajaxHelper !== 'undefined') {
                ajaxHelper.post('/api/v1/admin/locations/delete-location', { locationId }, function (response) {
                    Swal.fire('Deleted!', 'Location has been deleted.', 'success');
                    ajaxHelper.get('/api/v1/admin/locations', function (data) {
                        allLocations = data;
                        applySortAndSearch(true);
                    });
                }, function (err) {
                    Swal.fire('Error', 'Failed to delete location.', 'error');
                });
            } else {
                allLocations = allLocations.filter(loc => loc.locationId !== locationId);
                applySortAndSearch(true);
                Swal.fire('Deleted!', 'Location has been deleted.', 'success');
            }
        });
    });

    // Update form submit
    $('#UpdateLocationForm').on('submit', function (e) {
        e.preventDefault();

        const data = {
            locationId: locationData.locationId,
            section: $('#section').val(),
            aisle: $('#aisle').val(),
            bin: $('#bin').val(),
            note: $('#note').val()
        };

        Swal.fire({
            title: 'Update Location?',
            text: 'Do you want to save these changes?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (!result.isConfirmed) return;

            if (typeof ajaxHelper !== 'undefined') {
                ajaxHelper.put('/api/v1/admin/locations', data, function (response) {
                    Swal.fire('Updated!', 'Location updated successfully.', 'success');
                    ajaxHelper.get('/api/v1/admin/locations', function (data) {
                        allLocations = data;
                        applySortAndSearch(true);
                    });
                }, function (err) {
                    Swal.fire('Error', 'Failed to update location.', 'error');
                });
            } else {
                allLocations = allLocations.map(loc =>
                    loc.locationId === data.locationId ? { ...loc, ...data } : loc
                );
                applySortAndSearch(true);
                Swal.fire('Updated!', 'Location updated successfully.', 'success');
            }

            closeOverlay();
        });
    });
});