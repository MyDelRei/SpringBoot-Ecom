$(document).ready(function () {

    let allProducts = [];
    let allSkus = [];
    let currentSearchTerm = '';
    let currentSortBy = 'SKU CODE'; // default sort key
    let rowsPerPage = 5;
    let currentPage = 1;
    let totalPages = 1;


    function renderTable(skusToRender) {
        const tbody = $("table tbody");
        tbody.empty();

        totalPages = Math.ceil(skusToRender.length / rowsPerPage);
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginated = skusToRender.slice(start, end);

        if (paginated.length === 0) {
            tbody.append('<tr><td colspan="6" class="py-3 px-4 text-center text-gray-500">No SKUs found.</td></tr>');
            renderPagination();
            return;
        }

        paginated.forEach(sku => {
            const row = `
        <tr class="border-b border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-normal">
          <td class="py-3 px-4 border-r border-gray-200">
            <div class="inline-flex items-center">
              <label class="flex items-center cursor-pointer relative">
                <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" id="check-${sku.skuId}" />
                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </span>
              </label>
            </div>
          </td>
          <td class="py-3 px-4 border-r border-gray-200">${sku.skuCode || ''}</td>
          <td class="py-3 px-4 border-r border-gray-200">${sku.productName || ''}</td>
          <td class="py-3 px-4 border-r border-gray-200">${sku.basePrice != null ? Number(sku.basePrice).toFixed(2) : ''}</td>
          <td class="py-3 px-4 border-r border-gray-200">${sku.salePrice != null ? Number(sku.salePrice).toFixed(2) : ''}</td>
          <td class="py-3 px-4 text-center space-x-2">
            <button id="edit-sku" class="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition duration-200"
              data-id="${sku.skuId}"
              data-skucode="${sku.skuCode}"
              data-productname="${sku.productName}"
              data-description="${sku.description || ''}"
              data-baseprice="${sku.basePrice}"
              data-saleprice="${sku.salePrice}"
              data-isserialized="${sku.isSerialized || 'N'}"
            >
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button id="delete-sku" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-200"
              data-id="${sku.skuId}">
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
        let filtered = allSkus.slice();

        if (currentSearchTerm) {
            const term = currentSearchTerm.toLowerCase();
            filtered = filtered.filter(sku =>
                (sku.skuCode && sku.skuCode.toLowerCase().includes(term)) ||
                (sku.productName && sku.productName.toLowerCase().includes(term)) ||
                (sku.description && sku.description.toLowerCase().includes(term))
            );
        }

        filtered.sort((a, b) => {
            let valA = '', valB = '';
            switch (currentSortBy) {
                case 'SKU CODE':
                    valA = a.skuCode ? a.skuCode.toLowerCase() : '';
                    valB = b.skuCode ? b.skuCode.toLowerCase() : '';
                    break;
                case 'Product':
                    valA = a.productName ? a.productName.toLowerCase() : '';
                    valB = b.productName ? b.productName.toLowerCase() : '';
                    break;
                case 'Base price':
                    valA = Number(a.basePrice) || 0;
                    valB = Number(b.basePrice) || 0;
                    return valA - valB;
                case 'Sale price':
                    valA = Number(a.salePrice) || 0;
                    valB = Number(b.salePrice) || 0;
                    return valA - valB;
                case 'Title': // fallback, treat as skuCode
                default:
                    valA = a.skuCode ? a.skuCode.toLowerCase() : '';
                    valB = b.skuCode ? b.skuCode.toLowerCase() : '';
            }
            return valA.localeCompare(valB);
        });

        if (resetPage) currentPage = 1;

        renderTable(filtered);
    }

    // Overlay & edit functionality
    let skuData = {};
    const $overlay = $('#myOverlay');
    const $overlayContentWrapper = $overlay.find('.overlay-content-wrapper');

    function openOverlay(data) {
        skuData = data;
        $overlay.removeClass('invisible opacity-0').addClass('visible opacity-100');
        $overlayContentWrapper.removeClass('-translate-y-full').addClass('translate-y-0');
        $('body').css('overflow', 'hidden');

        // fill form fields
        $('#skuCode').val(data.skuCode || '');
        $('#description').val(data.description || '');
        $('#BasePrice').val(data.basePrice || '');
        $('#SalePrice').val(data.salePrice || '');
        $('#is_serialized').val(data.isSerialized || 'N');

        // Assuming your SKU data has productId, use it directly:
        if (data.productId) {
            $('#ProductSelect').val(data.productId);
        } else if (data.productName) {
            // fallback: find product by name and set value
            const product = allProducts.find(p => p.productName === data.productName);
            if (product) {
                $('#ProductSelect').val(product.productId);
            } else {
                $('#ProductSelect').val(''); // no match, clear selection
            }
        } else {
            $('#ProductSelect').val(''); // no product info, clear selection
        }
    }


    function closeOverlay() {
        $overlayContentWrapper.addClass('-translate-y-full').removeClass('translate-y-0');
        setTimeout(() => {
            $overlay.addClass('invisible opacity-0').removeClass('visible opacity-100');
            $('body').css('overflow', '');
        }, 500);
    }

    // Helper to find productId by productName — adapt as needed
    function findProductIdByName(productName) {
        // You need to have product list data or SKU DTO to have productId
        return '';
    }


    ajaxHelper.get('/api/v1/admin/product', function (products) {
        allProducts = products; // store globally for reuse

        const $productSelect = $('#ProductSelect');
        $productSelect.empty();
        $productSelect.append(`<option value="">-- Select Product --</option>`);

        products.forEach(function (product) {
            $productSelect.append(
                `<option value="${product.productId}">${product.productName}</option>`
            );
        });
    }, function (err) {
        console.error('Failed to load products:', err);
        alert('Could not load products. Please try again.');
    });


    // Fetch initial data
    ajaxHelper.get('/api/v1/admin/sku/dto', function (data) {
        allSkus = data;
        applySortAndSearch();
    }, function (error) {
        console.error('Failed to load SKUs:', error);
        alert('Failed to load SKU data, please try again.');
    });

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

    // Edit button click
    $(document).on('click', '#edit-sku', function () {
        const data = {
            skuId: $(this).data('id'),
            skuCode: $(this).data('skucode'),
            productName: $(this).data('productname'),
            description: $(this).data('description'),
            basePrice: $(this).data('baseprice'),
            salePrice: $(this).data('saleprice'),
            isSerialized: $(this).data('isserialized')
        };
        openOverlay(data);
    });

    // Close overlay on cancel button or click outside content
    $('#addWarehouseForm button[type="button"]').on('click', closeOverlay);
    $overlay.on('click', e => { if (e.target === $overlay[0]) closeOverlay(); });
    $(document).on('keydown', e => { if (e.key === 'Escape' && !$overlay.hasClass('invisible')) closeOverlay(); });



    $('#UpdateSkuForm').on('submit', function (e) {
        e.preventDefault();

        const data = {
            skuId: skuData.skuId,
            skuCode: $('#skuCode').val(),
            description: $('#description').val(),
            basePrice: parseFloat($('#BasePrice').val()),
            salePrice: parseFloat($('#SalePrice').val()),
            isSerialized: $('#is_serialized').val(),
            product: {
                productId: parseInt($('#ProductSelect').val())
            }
        };
        console.log(data);

        Swal.fire({
            title: 'Update SKU?',
            text: 'Do you want to save these changes?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (!result.isConfirmed) return;

            ajaxHelper.put('/api/v1/admin/sku', data, function (response) {
                Swal.fire({
                    title: 'Updated!',
                    text: 'SKU updated successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    willClose: () => {
                        // Redirect after success alert closes
                        window.location.href = '/sku?success=Successfully updated sku'; // change to your actual list page
                    }
                });
            }, function (error) {
                Swal.fire('Error', 'Failed to update SKU.', 'error');
            });
        });
    });



    $(document).on('click', '#delete-sku', function () {
        const skuId = $(this).data('id');

        Swal.fire({
            title: 'Delete SKU?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (!result.isConfirmed) return;

            const skus = {
                 skuId: skuId
            };

            console.log(skus)

            ajaxHelper.post('/api/v1/admin/sku/delete', skus, function () {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'SKU has been deleted.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = '/sku?success=deleted sku';
                });
            }, function (err) {
                Swal.fire('Error', 'Failed to delete SKU.', 'error');
            });
        });
    });





});
