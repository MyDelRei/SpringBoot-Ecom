$(document).ready(function () {
    let allSuppliers = [];
    let searchTerm = '';
    let sortBy = 'supplierName';
    let rowsPerPage = 5;
    let currentPage = 1;
    let totalPages = 1;

    // --- RENDER TABLE ---
    function renderTable(suppliers) {
        const tbody = $('table tbody').empty();
        const start = (currentPage - 1) * rowsPerPage;
        const paginated = suppliers.slice(start, start + rowsPerPage);

        if (!paginated.length) {
            tbody.append('<tr><td colspan="7" class="text-center py-4 text-gray-500">No suppliers found.</td></tr>');
            renderPagination();
            return;
        }

        paginated.forEach(s => {
            // Join product names as a comma-separated string for display
            const productNames = s.products.length > 0
                ? s.products.map(p => p.productName).join(', ')
                : 'No products';

            tbody.append(`
                <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-4 border-r border-gray-200">
                        <label class="flex items-center cursor-pointer relative">
                            <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" id="check-${s.id}" />
                            <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                            </span>
                        </label>
                    </td>
                    <td class="py-3 px-4 border-r border-gray-200">${s.supplierName}</td>
                    <td class="py-3 px-4 border-r border-gray-200">${s.phone}</td>
                    <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">${s.email}</td>
                    <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">${s.address}</td>
                    <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">
                        <button class="show-more-btn h-[32px] px-3 py-1 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors" data-id="${s.id}">Show more</button>
                       
                    </td>
                    
                     <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">
                        
                        <button class="add-more-btn h-[32px] px-3 py-1 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors" 
                            data-supplier-id="${s.id}" 
                            data-supplier-name="${s.supplierName}">
                            add more
                        </button>
                    </td>
                    
                    <td class="py-3 px-4 text-center space-x-2">
                        <a href="/supplier/update-product?supplierId=${s.id}" class="edit-btn text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100"  data-id="${s.id}" ">
                            <i class="fas fa-pencil-alt"></i>
                        </a>
                        <button class="delete-btn text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100" data-id="${s.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `);
        });

        renderPagination();
    }

    // --- PAGINATION ---
    function renderPagination() {
        const container = $('#pagination').empty();
        totalPages = Math.ceil(filteredSuppliers().length / rowsPerPage);
        if (totalPages <= 1) return;

        container.append(`<button class="prev-btn px-3 py-1 ${currentPage === 1 ? 'opacity-50' : ''}"><i class="fas fa-chevron-left"></i></button>`);

        for (let i = 1; i <= totalPages; i++) {
            container.append(`<button class="pagination-btn px-3 py-1 ${i === currentPage ? 'bg-indigo-600 text-white' : ''}" data-page="${i}">${i}</button>`);
        }

        container.append(`<button class="next-btn px-3 py-1 ${currentPage === totalPages ? 'opacity-50' : ''}"><i class="fas fa-chevron-right"></i></button>`);
    }

    // --- FILTER & SORT ---
    function filteredSuppliers() {
        let result = [...allSuppliers];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(s =>
                s.supplierName.toLowerCase().includes(term) ||
                s.phone.toLowerCase().includes(term) ||
                s.email.toLowerCase().includes(term) ||
                s.address.toLowerCase().includes(term)
            );
        }

        result.sort((a, b) => {
            const aVal = a[sortBy]?.toLowerCase?.() || '';
            const bVal = b[sortBy]?.toLowerCase?.() || '';
            return aVal.localeCompare(bVal);
        });

        return result;
    }

    function updateTable(resetPage = true) {
        if (resetPage) currentPage = 1;
        renderTable(filteredSuppliers());
    }

    // --- FETCH SUPPLIERS ---
    function loadSuppliers() {
        $.ajax({
            url: '/api/v1/suppliers/all-supplier-products',
            method: 'GET',
            success: function (data) {
                allSuppliers = data;
                console.log(allSuppliers);
                updateTable();
            },
            error: function () {
                alert('Failed to load suppliers');
            }
        });
    }

    // --- DELETE SUPPLIER ---
    function deleteSupplier(id) {
        Swal.fire({
            title: 'Delete Supplier?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
        }).then(result => {
            if (!result.isConfirmed) return;

            $.ajax({
                url: `/api/v1/suppliers/${id}`,
                type: 'DELETE',
                success: function () {
                    Swal.fire('Deleted!', 'Supplier has been deleted.', 'success');
                    loadSuppliers();
                },
                error: function () {
                    Swal.fire('Error', 'Failed to delete supplier.', 'error');
                }
            });
        });
    }

    // --- EVENT BINDINGS ---
    $('#search').on('input', function () {
        searchTerm = $(this).val();
        updateTable();
    });

    $('#sort-table').on('change', function () {
        sortBy = $(this).val();
        updateTable();
    });

    $(document).on('click', '.pagination-btn', function () {
        currentPage = parseInt($(this).data('page'));
        updateTable(false);
    });

    $(document).on('click', '.prev-btn', function () {
        if (currentPage > 1) currentPage--;
        updateTable(false);
    });

    $(document).on('click', '.next-btn', function () {
        if (currentPage < totalPages) currentPage++;
        updateTable(false);
    });

    $(document).on('click', '.delete-btn', function () {
        deleteSupplier($(this).data('id'));
    });


    function showOverlay(id) {
        const overlay = $('#' + id);
        overlay.removeClass('invisible opacity-0');
        setTimeout(() => {
            overlay.find('.overlay-content-wrapper').removeClass('-translate-y-full');
        }, 20);
        $('body').css('overflow', 'hidden');
    }

    function hideOverlay(id) {
        const overlay = $('#' + id);
        overlay.find('.overlay-content-wrapper').addClass('-translate-y-full');
        setTimeout(() => {
            overlay.addClass('invisible opacity-0');
            $('body').css('overflow', '');
        }, 500);
    }




    $(document).on('click', '.show-more-btn', function () {
        const supplierId = $(this).data('id');
        const supplier = allSuppliers.find(s => s.id === supplierId);

        if (!supplier) return alert('Supplier data not found');

        if (supplier.products && supplier.products.length > 0) {
            $('#supplierNameWithProducts').text(supplier.supplierName);
            const productsList = $('#productsList').empty();

            supplier.products.forEach(p => {
                productsList.append(`
                <div class="border border-slate-200 rounded-[15px] p-3 flex justify-between">
                    <div>
                        <div class="text-xs text-gray-500">Product</div>
                        <div>${p.productName}</div>
                    </div>
                    <div class="items-center justify-center flex text-center">${p.costPrice} $</div>
                </div>
            `);
            });

            showOverlay('overlayWithProducts');
            hideOverlay('overlayNoProducts');
        } else {
            $('#supplierNameNoProducts')
                .text(supplier.supplierName)
                .data('id', supplier.id);
            showOverlay('overlayNoProducts');
            hideOverlay('overlayWithProducts');
        }
    });

    $('#closeWithProducts').on('click', () => {
        hideOverlay('overlayWithProducts');
    });

    $('#closeNoProducts').on('click', () => {
        hideOverlay('overlayNoProducts');
    });

    $('#addProductLink').on('click', function () {
        const supplierName = $('#supplierNameNoProducts').text();
        const supplierId = $('#supplierNameNoProducts').data('id');

        const encodedName = encodeURIComponent(supplierName);
        const encodedId = encodeURIComponent(supplierId);

        window.location.href = `/supplier/add-product?supplierId=${encodedId}&supplierName=${encodedName}`;
    });

    $(document).on('click', '.add-more-btn', function () {
        const supplierName = $(this).data('supplier-name');
        const supplierId = $(this).data('supplier-id');

        const encodedName = encodeURIComponent(supplierName);
        const encodedId = encodeURIComponent(supplierId);

        window.location.href = `/supplier/add-product?supplierId=${encodedId}&supplierName=${encodedName}`;
    });







    // Initial fetch
    loadSuppliers();
});
