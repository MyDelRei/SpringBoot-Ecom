$(document).ready(function () {
    // --- State variables ---
    let allAttributes = [];
    let currentSearchTerm = '';
    let currentSortBy = 'attributeName';
    let rowsPerPage = 5;
    let currentPage = 1;
    let totalPages = 1;

    // --- Helper function to fetch and render data ---
    function refreshData() {
        if (typeof ajaxHelper === 'undefined') {
            console.warn("ajaxHelper is not defined. Using mock data for demonstration.");
            allAttributes = [
                 { attributeId: 1, attributeName: "Weight", unitOfMeasure: "kg", description: "The weight of the product in kilograms" },
                 { attributeId: 2, attributeName: "Length", unitOfMeasure: "cm", description: "Length measurement in centimeters" },
                 { attributeId: 3, attributeName: "Volume", unitOfMeasure: "L", description: "Volume in liters" },
            ];
            applySortAndSearch(true);
            return;
        }

        ajaxHelper.get('/api/v1/admin/attributes', function (data) {
            allAttributes = data || [];
            applySortAndSearch(true);
        });
    }

    // --- Rendering Functions ---

    function renderTable(attributesToRender) {
        const tbody = $("table tbody");
        tbody.empty();

        totalPages = Math.ceil(attributesToRender.length / rowsPerPage);
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginated = attributesToRender.slice(start, end);

        if (paginated.length === 0) {
            tbody.append('<tr><td colspan="5" class="py-3 px-4 text-center text-gray-500">No Attributes found.</td></tr>');
            renderPagination();
            return;
        }

        paginated.forEach(att => {
            const attributeDataJSON = JSON.stringify(att);
            const row = `
                <tr class="border-b border-gray-200 hover:bg-gray-50" data-attribute='${attributeDataJSON}'>
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
                  <td class="py-3 px-4 border-r border-gray-200">${att.attributeName || ''}</td>
                  <td class="py-3 px-4 border-r border-gray-200">${att.unitOfMeasure || ''}</td>
                  <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">${att.description || ''}</td>
                  <td class="py-3 px-4 text-center space-x-2">
                    <button class="edit-attribute-btn text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition duration-200">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="delete-attribute-btn text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-200">
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

        container.append(`<button class="prev-btn p-2 rounded-lg hover:bg-gray-200 transition duration-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left text-sm"></i></button>`);
        
        const pageNumbers = new Set([1]);
        if (totalPages > 1) {
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                if (i > 1 && i < totalPages) pageNumbers.add(i);
            }
            pageNumbers.add(totalPages);
        }
        
        const sortedPages = Array.from(pageNumbers).sort((a, b) => a - b);
        let lastPage = 0;
        sortedPages.forEach(page => {
            if (page > lastPage + 1) {
                container.append(`<span class="px-3 py-1 text-gray-500">...</span>`);
            }
            const activeClass = page === currentPage ? 'bg-indigo-600 text-white font-semibold shadow-md' : 'hover:bg-gray-200';
            container.append(`<button class="pagination-btn px-3 py-1 rounded-lg transition duration-200 ${activeClass}" data-page="${page}">${page}</button>`);
            lastPage = page;
        });

        container.append(`<button class="next-btn p-2 rounded-lg hover:bg-gray-200 transition duration-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" ${currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right text-sm"></i></button>`);
    }

    function applySortAndSearch(resetPage = true) {
        let filtered = allAttributes.slice();

        if (currentSearchTerm) {
            const term = currentSearchTerm.toLowerCase();
            filtered = filtered.filter(att =>
                (att.attributeName && att.attributeName.toLowerCase().includes(term)) ||
                (att.unitOfMeasure && att.unitOfMeasure.toLowerCase().includes(term)) ||
                (att.description && att.description.toLowerCase().includes(term))
            );
        }

        filtered.sort((a, b) => {
            const valA = a[currentSortBy] ? String(a[currentSortBy]).toLowerCase() : '';
            const valB = b[currentSortBy] ? String(b[currentSortBy]).toLowerCase() : '';
            return valA.localeCompare(valB);
        });

        if (resetPage) currentPage = 1;
        renderTable(filtered);
    }

    // --- Initial Load ---
    refreshData();

    // --- Event Listeners ---
    $('#sort-table').on('change', function () { currentSortBy = $(this).val(); applySortAndSearch(true); });
    $('#search').on('input', function () { currentSearchTerm = $(this).val(); applySortAndSearch(true); });
    $(document).on('click', '.pagination-btn', function () { currentPage = parseInt($(this).data('page')); applySortAndSearch(false); });
    $(document).on('click', '.prev-btn', function () { if (currentPage > 1) { currentPage--; applySortAndSearch(false); } });
    $(document).on('click', '.next-btn', function () { if (currentPage < totalPages) { currentPage++; applySortAndSearch(false); } });

    // --- Overlay & Edit/Delete Functionality ---
    let currentAttributeInForm = {};
    const $overlay = $('#myOverlay');
    const $overlayContentWrapper = $overlay.find('.overlay-content-wrapper');

    function openOverlay(data) {
        currentAttributeInForm = data;
        $overlay.removeClass('invisible opacity-0').addClass('visible opacity-100');
        $overlayContentWrapper.removeClass('-translate-y-full').addClass('translate-y-0');
        $('body.overflow-y-auto').css('overflow', 'hidden');

        // CORRECTED: Use contextual selectors to populate the form inside the overlay
        $overlay.find('#attributeName').val(data.attributeName);
        $overlay.find('#unitOfMeasure').val(data.unitOfMeasure);
        $overlay.find('#description').val(data.description);
    }

    function closeOverlay() {
        $overlayContentWrapper.addClass('-translate-y-full').removeClass('translate-y-0');
        setTimeout(() => {
            $overlay.addClass('invisible opacity-0').removeClass('visible opacity-100');
            $('body.overflow-y-auto').css('overflow', '');
        }, 500);
    }

    $('#cancelButton').on('click', closeOverlay);
    $overlay.on('click', e => { if (e.target === $overlay[0]) closeOverlay(); });
    $(document).on('keydown', e => { if (e.key === 'Escape' && !$overlay.hasClass('invisible')) closeOverlay(); });

    $(document).on('click', '.edit-attribute-btn', function () {
        const attributeData = $(this).closest('tr').data('attribute');
        openOverlay(attributeData);
    });

    $(document).on('click', '.delete-attribute-btn', function () {
        const attributeToDelete = $(this).closest('tr').data('attribute');
        Swal.fire({
            title: 'Delete Attribute?',
            html: `You are about to delete <strong>${attributeToDelete.attributeName}</strong>. This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (!result.isConfirmed) return;
            ajaxHelper.post('/api/v1/admin/delete-attributes', attributeToDelete, 
                () => { Swal.fire('Deleted!', 'Attribute has been deleted.', 'success'); refreshData(); },
                () => { Swal.fire('Error', 'Failed to delete attribute. Please try again.', 'error'); }
            );
        });
    });

    // Handle the update form submission
    $('#UpdateAttributeForm').on('submit', function (e) {
        e.preventDefault();
        // CORRECTED: Use `$(this)` to reference the form and find elements within it
        const $form = $(this); 

        const unitOfMeasure = $form.find('#unitOfMeasure').val().trim();
        const description = $form.find('#description').val().trim();

        const updatedData = {
            attributeId: currentAttributeInForm.attributeId,
            attributeName: $form.find('#attributeName').val().trim(),
            unitOfMeasure: unitOfMeasure || null,
            description: description || null
        };

        Swal.fire({
            title: 'Update Attribute?',
            text: 'Do you want to save these changes?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (!result.isConfirmed) return;

            ajaxHelper.put('/api/v1/admin/attributes', updatedData, 
                () => { 
                    Swal.fire('Updated!', 'Attribute updated successfully.', 'success'); 
                    refreshData(); 
                    closeOverlay();
                }, 
                () => { Swal.fire('Error', 'Failed to update attribute. Please try again.', 'error'); }
            );
        });
    });
});