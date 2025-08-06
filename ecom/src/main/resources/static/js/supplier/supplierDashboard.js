$(document).ready(function () {
    // Load all suppliers on page load
    loadSuppliers();


    // Close overlay handlers
    $('#closeWithProducts').on('click', hideOverlayWithProducts);
    $('#closeNoProducts').on('click', hideOverlayNoProducts);
});

function loadSuppliers() {
    ajaxHelper.get('/api/v1/suppliers/all-supplier-products', function (suppliers) {
        const container = $('#supplierContainer .space-y-4');
        container.empty();

        // Limit to first 5 suppliers
        const totalCount = suppliers.length;
        $('#TotalSupplier').text(totalCount);

        const limitedSuppliers = suppliers.slice(0, 5);

        limitedSuppliers.forEach(supplier => {
            const initials = getInitials(supplier.supplierName);
            const cardHtml = `
                <div class="supplier-card h-[68px] flex items-center justify-between border border-slate-200 p-4 rounded-[15px]" data-supplier-id="${supplier.id}" data-supplier-name="${supplier.supplierName}">
                    <div class="flex items-center space-x-3">
                        <img src="https://placehold.co/40x40/DBDFEF/5864BB?text=${initials}" alt="${supplier.supplierName}" class="rounded-lg">
                        <div>
                            <p class="text-sm text-gray-500">Supplier</p>
                            <p class="font-medium text-gray-800">${supplier.supplierName}</p>
                        </div>
                    </div>
                    <button class="show-more-btn h-[32px] px-3 py-1 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors">Show more</button>
                </div>
            `;
            container.append(cardHtml);
        });

        // Re-bind show more buttons
        $('.show-more-btn').on('click', function () {
            const $card = $(this).closest('.supplier-card');
            const supplierId = $card.data('supplier-id');
            const supplierName = $card.data('supplier-name');

            showSupplierProducts(supplierId, supplierName);
        });
    });
}


function showSupplierProducts(supplierId, supplierName) {
    ajaxHelper.get(`/api/v1/suppliers/all-supplier-products/${supplierId}`, function (supplierData) {
        if (supplierData.products && supplierData.products.length > 0) {
            showOverlayWithProducts(supplierName, supplierData.products);
        } else {
            showOverlayNoProducts(supplierName);
        }
    });
}

function showOverlayWithProducts(supplierName, products) {
    $('#supplierNameWithProducts').text(supplierName);
    const productsList = $('#productsList');
    productsList.empty();

    products.forEach(product => {
        const item = `
            <div class="border border-slate-200 rounded-[15px] p-3 flex justify-between">
                    <div>
                        <div class="text-xs text-gray-500">${product.skuCode || 'Unnamed Product'}</div>
                        <div>${product.productName}</div>
                    </div>
                    <div class="items-center justify-center flex text-center">${product.costPrice} $</div>
                </div>
        `;
        productsList.append(item);
    });

    $('#overlayWithProducts').removeClass('invisible opacity-0').find('.overlay-content-wrapper').removeClass('-translate-y-full');
}

function showOverlayNoProducts(supplierName) {
    $('#supplierNameNoProducts').text(supplierName);
    $('#overlayNoProducts').removeClass('invisible opacity-0').find('.overlay-content-wrapper').removeClass('-translate-y-full');
}

function hideOverlayWithProducts() {
    $('#overlayWithProducts').addClass('opacity-0 invisible').find('.overlay-content-wrapper').addClass('-translate-y-full');
}

function hideOverlayNoProducts() {
    $('#overlayNoProducts').addClass('opacity-0 invisible').find('.overlay-content-wrapper').addClass('-translate-y-full');
}

function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
}
