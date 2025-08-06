let selectedSkuData = null;

// ----------------------
// UTILS
// ----------------------

function getSupplierIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('supplierId');
}

// ----------------------
// FETCH SKU LIST & RENDER
// ----------------------

ajaxHelper.get("/api/v1/admin/sku/dto", function (data) {
    renderSkuTable(data);
});

function renderSkuTable(skuList) {
    const $tbody = $("#productTableBody");
    $tbody.empty();

    if (skuList.length === 0) {
        $tbody.append(`<tr><td colspan="4" class="text-center">No data found</td></tr>`);
        return;
    }

    skuList.forEach(data => {
        const row = `
            <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-4 border-r border-gray-200">
                    <label class="flex items-center cursor-pointer relative">
                        <input type="checkbox" class="peer h-5 w-5 appearance-none rounded shadow border border-slate-300 checked:bg-purple-600 checked:border-purple-600" />
                        <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                        </span>
                    </label>
                </td>
                <td class="py-3 px-4 border-r border-gray-200">${data.productName}</td>
                <td class="py-3 px-4 border-r border-gray-200">${data.skuCode}</td>
                <td class="py-3 px-4 border-r border-gray-200">
                    <button type="button" class="add-btn h-[32px] px-3 py-1 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
                        data-cost-price="${data.basePrice}"
                        data-sku="${data.skuId}"
                        data-sku-code="${data.skuCode}"
                        data-product-name="${data.productName}">
                        + Add
                    </button>
                </td>
            </tr>`;
        $tbody.append(row);
    });
}

// ----------------------
// "+ Add" Button Click
// ----------------------

$(document).on('click', '.add-btn', function () {
    const skuCode = $(this).data('sku-code');

    const alreadyExists = $('#supplierProductTableBody tr').filter(function () {
        return $(this).find('td').eq(2).text().trim() === skuCode;
    }).length > 0;

    if (alreadyExists) {
        Swal.fire({
            icon: 'warning',
            title: 'Duplicate SKU',
            text: `This SKU (${skuCode}) is already added to the supplier product list.`,
        });
        return;
    }

    selectedSkuData = {
        skuId: $(this).data('sku'),
        skuCode,
        productName: $(this).data('product-name'),
        costPrice: $(this).data('cost-price')
    };

    $('#CostPrice').val(selectedSkuData.costPrice);

    $('#overlayNoProducts')
        .removeClass('invisible opacity-0')
        .addClass('visible opacity-100');

    $('.overlay-content-wrapper')
        .removeClass('-translate-y-full')
        .addClass('translate-y-0');
});

// ----------------------
// Render Existing Supplier Products (for Update View)
// ----------------------

function renderSupplierProducts(products) {
    const $tbody = $("#supplierProductTableBody");
    $tbody.empty();

    products.forEach(product => {
        const statusBadge = product.status === 'Available'
            ? `<span class="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">${product.status}</span>`
            : `<span class="inline-block px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">${product.status}</span>`;

        const rowHtml = `
        <tr data-supplier-product-id="${product.supplierProductId}" class="border-b border-gray-200 hover:bg-gray-50">
            <td class="py-3 px-4 border-r border-gray-200">
                <label class="flex items-center cursor-pointer relative">
                    <input type="checkbox" class="peer h-5 w-5 appearance-none rounded shadow border border-slate-300 checked:bg-purple-600 checked:border-purple-600" />
                    <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                    </span>
                </label>
            </td>
            <td class="py-3 px-4 border-r border-gray-200">${product.productName}</td>
            <td class="py-3 px-4 border-r border-gray-200">${product.skuCode}</td>
            <td class="py-3 px-4 border-r border-gray-200">${statusBadge}</td>
            <td class="py-3 px-4 border-r border-gray-200">${product.leadTimeDays}</td>
            <td class="py-3 px-4 border-r border-gray-200">${product.costPrice}</td>
            <td class="py-3 px-4 text-center">
                <button type="button" class="text-red-500 hover:text-red-700 font-semibold remove-btn">Remove</button>
            </td>
        </tr>`;

        $tbody.append(rowHtml);
    });
}

// ----------------------
// Load Supplier Products from API
// ----------------------

function loadSupplierProducts(supplierId) {
    ajaxHelper.get(`/api/v1/suppliers/all-supplier-products/${supplierId}`, function (data) {
        if (data && data.products?.length > 0) {
            renderSupplierProducts(data.products);
            console.log(data.products);
            console.log(data.supplierProductId)
        } else {
            console.warn("No supplier products found.");
        }
    });
}

$(document).on('click', '.remove-btn', function () {
    const $row = $(this).closest('tr');
    const supplierProductId = $row.data('supplier-product-id');

    if (!supplierProductId) {
        console.error("No supplier product ID found.");
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete this product?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            const url = `/api/v1/suppliers/supplier-product/${supplierProductId}`;
            ajaxHelper.delete(url, function () {
                Swal.fire('Deleted!', 'The product has been deleted.', 'success');
                $row.remove(); // Optionally remove the row from the table
            }, function (err) {
                Swal.fire('Error', 'Failed to delete the product.', 'error');
                console.error("Delete failed:", err);
            });
        }
    });
});


// ----------------------
// Init on Page Load
// ----------------------

$(document).ready(function () {
    const supplierId = getSupplierIdFromURL();
    if (supplierId) {
        loadSupplierProducts(supplierId);
    }
});
