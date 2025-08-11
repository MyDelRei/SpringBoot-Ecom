"use strict"
$(document).ready(function () {

    // RenderTable with pagination
    let rowsPerPage = 5;
    let currentPage = 1;
    let totalPages = 1;
    let arrivalData = [];

    function fetchDataAndRender() {
        ajaxHelper.get('/api/v1/admin/product-arrival', function (arrivals) {
            arrivalData = arrivals.sort((a, b) => a.id - b.id);
            totalPages = Math.ceil(arrivalData.length / rowsPerPage);
            renderTable();
            renderPagination();
            console.log(arrivalData);
        });
    }

    function renderTable() {
        const tbody = $('#arrival-table-body');
        tbody.empty();

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = arrivalData.slice(start, end);

        paginatedData.forEach(item => {
            const encodedProducts = encodeURIComponent(JSON.stringify(item.items));
            const row = `
                <tr class="hover:bg-gray-50 transition-colors duration-200">
                    <td class="py-3 px-4 border-b border-r border-gray-200">
                        <input type="checkbox" class="h-5 w-5 cursor-pointer appearance-none rounded shadow border border-slate-300 checked:bg-purple-600 checked:border-purple-600" />
                    </td>
                    <td class="py-3 px-4 border-b border-r border-gray-200 text-gray-600">${item.id}</td>
                    <td class="py-3 px-4 border-b border-r border-gray-200 text-gray-600">
                        <span class="px-3 py-1 rounded-2xl bg-black hover:bg-white border-1 border-gray-900 hover:text-black hover:border-indigo-600 transition d text-gray-50 text-center cursor-pointer show-products" data-id="${item.id}" data-products="${encodedProducts}">
                            Show
                        </span>
                    </td>
                    <td class="py-3 px-4 border-b border-r border-gray-200 text-gray-600">${item.invoiceNumber}</td>
                    <td class="py-3 px-4 border-b border-r border-gray-200 ${item.requestStatus? 'text-green-600' : 'text-yellow-600'}">
                        ${item.requestStatus}
                    </td>
                    <td class="py-3 px-4 border-b border-r border-gray-200 text-gray-600">${item.items.reduce((sum, i) => sum + i.quantityReceived, 0)}</td>
                    <td class="py-3 px-4 border-b border-r border-gray-200 text-gray-600">${item.arrivalDate}</td>
                    <td class="py-3 px-4 text-center border-b border-gray-200">
                        <a href="#" class="text-red-600 hover:text-red-800 delete-arrival" data-id="${item.id}"><i class="fas fa-trash-alt"></i></a>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
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

    // Event Listeners for Pagination
    $(document).on('click', '.pagination-btn', function () {
        currentPage = parseInt($(this).data('page'));
        renderTable();
        renderPagination();
    });

    $(document).on('click', '.prev-btn', function () {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            renderPagination();
        }
    });

    $(document).on('click', '.next-btn', function () {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            renderPagination();
        }
    });

    // Handle modal open
    function openModal() {
        const modal = $('#product-modal');
        $('body').addClass('modal-open');
        modal.removeClass('hidden');
        setTimeout(() => {
            modal.css('opacity', 1);
            $('#modal-content').removeClass('scale-95 opacity-0').addClass('scale-100 opacity-100');
        }, 10);
    }

    function closeModal() {
        const modal = $('#product-modal');
        $('body').removeClass('modal-open');
        $('#modal-content').removeClass('scale-100 opacity-100').addClass('scale-95 opacity-0');
        modal.css('opacity', 0);
        setTimeout(() => {
            modal.addClass('hidden');
        }, 300);
    }

    // Event handler for showing products
    $(document).on('click', '.show-products', function () {
        const encoded = $(this).data('products');
        if (!encoded) {
            console.error("No product data found on the button.");
            return;
        }
        try {
            const products = JSON.parse(decodeURIComponent(encoded));
            const modalBody = $('#modal-product-body');
            modalBody.empty();

            if (products.length === 0) {
                modalBody.append(`<tr><td colspan="4" class="text-center text-gray-500 py-8">No products were found.</td></tr>`);
            } else {
                products.forEach(items => {
                    const row = `
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap border-r border-gray-200 text-sm font-medium text-gray-900">${items.productName}</td>
                            <td class="px-6 py-4 whitespace-nowrap border-r border-gray-200 text-sm text-gray-500">${items.skuCode}</td>
                            <td class="px-6 py-4 whitespace-nowrap border-r border-gray-200 text-sm text-gray-500 text-center">${items.quantityReceived}</td>
                            <td class="px-6 py-4 whitespace-nowrap border-l border-gray-200 text-sm text-gray-500">${items.note || '<span class="text-gray-400">-</span>'}</td>
                        </tr>
                    `;
                    modalBody.append(row);
                });
            }
            openModal();
        } catch (e) {
            console.error("Failed to parse product data:", e);
            const modalBody = $('#modal-product-body');
            modalBody.empty();
            modalBody.append(`<tr><td colspan="4" class="text-center text-red-500 py-8">Error loading product data.</td></tr>`);
            openModal();
        }
    });

// Event handler for delete action
    $(document).on('click', '.delete-arrival', function (e) {
        e.preventDefault();
        const id = $(this).data('id');
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently delete the product arrival.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                ajaxHelper.delete(`/api/v1/admin/product-arrival/${id}`, function () {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The product arrival has been deleted.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    fetchDataAndRender(); // Refresh table after deletion
                }, function (error) {
                    console.error("Failed to delete product arrival:", error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete product arrival.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                });
            }
        });
    });

    // Event handler for close button
    $('#close-product-modal').on('click', function () {
        closeModal();
    });

    // Event handler to close modal on background click
    $('#product-modal').on('click', function (e) {
        if (e.target.id === 'product-modal') {
            closeModal();
        }
    });

    // Event handler to close modal with Escape key
    $(document).on('keydown', function (e) {
        if (e.key === "Escape" && !$('#product-modal').hasClass('hidden')) {
            closeModal();
        }
    });

    // Initial Load
    fetchDataAndRender();
});