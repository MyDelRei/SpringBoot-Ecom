$(document).ready(function () {
    // Cache DOM elements
    const $productOverlay = $('#productOverlay');
    const $closeProductOverlayButton = $('#closeProductOverlay');
    const $productListContainer = $('#product-list-container');

    const $attributeOverlay = $('#attributeOverlay');
    const $closeAttributeOverlayButton = $('#closeAttributeOverlay');
    const $attributeListContainer = $('#attribute-list-container');

    const $addItemButton = $('#addItemButton');
    const $addItemOverlay = $('#addItemOverlay');
    const $addItemProductTableBody = $('#addItemProductTableBody');
    const $addSelectedItemsButton = $('#addSelectedItems');

    const $addQuantityOverlay = $('#addQuantityOverlay');
    const $quantityInput = $('#quantity-input');
    const $confirmAddItemQtyButton = $('#confirmAddItemQtyButton');

    const $itemPurchaseTableBody = $('#itemPurchaseTableBody');
    const $itemPurchaseCountSpan = $('#item-purchase-count');
    const $grandTotalSpan = $('#grand-total');

    let selectedProductToAdd = null;

    let purchaseRequestData = {
        supplierId: null,
        requestDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: null,
        status: 'pending',
        items: []
    };

    // SweetAlert for messages from server
    function showMessageFromQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        const msg = urlParams.get('msg');
        if (msg) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: msg,
                confirmButtonText: 'OK'
            }).then(() => {
                // Remove query param to avoid showing again on refresh
                urlParams.delete('msg');
                const url = window.location.origin + window.location.pathname + '?' + urlParams.toString();
                window.history.replaceState({}, document.title, url);
            });
        }
    }

    showMessageFromQuery(); // call on page load

    // --- Overlay functions ---
    function showOverlay($overlay) {
        $overlay.removeClass('invisible opacity-0').addClass('visible opacity-100');
        $overlay.find('.bg-white').removeClass('scale-95').addClass('scale-100');
    }

    function hideOverlay($overlay) {
        $overlay.removeClass('visible opacity-100').addClass('invisible opacity-0');
        $overlay.find('.bg-white').removeClass('scale-100').addClass('scale-95');
    }

    function updateSummary() {
        const itemCount = $itemPurchaseTableBody.find('tr').length;
        let grandTotal = 0;
        $itemPurchaseTableBody.find('tr').each(function () {
            const $row = $(this);
            const price = parseFloat($row.find('.cost-price').text().replace('$', '').trim());
            const qty = parseInt($row.find('.qty-display').text());
            if (!isNaN(price) && !isNaN(qty)) grandTotal += price * qty;
        });
        $itemPurchaseCountSpan.text(itemCount);
        $grandTotalSpan.text(grandTotal.toFixed(2) + ' $');
    }

    // --- Supplier selection ---
    $('#supplier-select').on('change', function () {
        purchaseRequestData.supplierId = parseInt($(this).val());
    });

    // --- Product overlay ---
    $('.show-product-btn').on('click', function () {
        const productsData = JSON.parse($(this).data('products'));
        $productListContainer.empty();
        if (productsData.length > 0) {
            productsData.forEach(product => {
                $productListContainer.append(`
                    <div class="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-200">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Product</p>
                            <p class="text-lg font-semibold text-gray-800">${product.name}</p>
                        </div>
                        <p class="text-lg font-bold text-gray-800">${product.price} $</p>
                    </div>
                `);
            });
        } else {
            $productListContainer.html('<p class="text-center text-gray-600">No products found for this order.</p>');
        }
        showOverlay($productOverlay);
    });

    // --- Attribute overlay ---
    $itemPurchaseTableBody.on('click', '.show-attribute-btn', function () {
        const attributesData = $(this).data('attributes') || [];
        $attributeListContainer.empty();
        if (attributesData.length > 0) {
            attributesData.forEach(attr => {
                $attributeListContainer.append(`
                    <div class="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-200">
                        <div>
                            <p class="text-sm font-medium text-gray-500">${attr.attributeName}</p>
                            <p class="text-lg font-semibold text-gray-800">${attr.attributeValue}</p>
                        </div>
                    </div>
                `);
            });
        } else {
            $attributeListContainer.html('<p class="text-center text-gray-600">No attributes found for this product.</p>');
        }
        showOverlay($attributeOverlay);
    });

    // --- Add item overlay ---
    $addItemButton.on('click', function () { showOverlay($addItemOverlay); });

    $addItemProductTableBody.on('click', '.add-item-to-qty-overlay-btn', function () {
        const $row = $(this).closest('tr');
        selectedProductToAdd = {
            skuId: $row.data('sku-id'),
            name: $row.find('.product-name').text(),
            sku: $row.find('.sku-code').text(),
            status: $row.find('.status').text(),
            leadDay: $row.find('.lead-day').text(),
            costPrice: parseFloat($row.find('.cost-price').text()),
            attributes: $row.data('attributes') || []
        };
        $quantityInput.val(1);
        showOverlay($addQuantityOverlay);
    });

    $confirmAddItemQtyButton.on('click', function () {
        const qty = parseInt($quantityInput.val());
        if (isNaN(qty) || qty <= 0) { alert('Please enter a valid quantity.'); return; }

        if (selectedProductToAdd) {
            purchaseRequestData.items.push({ skuId: selectedProductToAdd.skuId, quantityRequest: qty });

            // Calculate expected delivery
            const leadDays = parseInt((selectedProductToAdd.leadDay || '0').replace(/\D/g, '')) || 0;
            const estimated = new Date(purchaseRequestData.requestDate);
            estimated.setDate(estimated.getDate() + leadDays);
            const formattedDate = estimated.toISOString().split('T')[0];
            if (!purchaseRequestData.expectedDeliveryDate || formattedDate > purchaseRequestData.expectedDeliveryDate) {
                purchaseRequestData.expectedDeliveryDate = formattedDate;
            }

            const totalPrice = (selectedProductToAdd.costPrice * qty).toFixed(2);
            $itemPurchaseTableBody.append(`
                <tr data-sku-id="${selectedProductToAdd.skuId}" class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-4 border-r border-gray-200">
                        <input type="checkbox" class="peer h-5 w-5 rounded border border-slate-300 checked:bg-purple-600"/>
                    </td>
                    <td class="py-3 px-4 border-r border-gray-200">${selectedProductToAdd.name}</td>
                    <td class="py-3 px-4 border-r border-gray-200">
                        <button class="show-attribute-btn bg-black text-white px-3 py-1 rounded-full text-sm" 
                            data-attributes='${JSON.stringify(selectedProductToAdd.attributes)}'>Show</button>
                    </td>
                    <td class="py-3 px-4 border-r border-gray-200">${selectedProductToAdd.leadDay}</td>
                    <td class="py-3 px-4 border-r border-gray-200 qty-display">${qty}</td>
                    <td class="py-3 px-4 border-r border-gray-200 cost-price">${totalPrice} $</td>
                    <td class="py-3 px-4 text-center">
                        <button id="removeProductPurchase" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `);
            updateSummary();
        }
        hideOverlay($addQuantityOverlay);
        hideOverlay($addItemOverlay);
        selectedProductToAdd = null;
    });

    // --- Remove items ---
    $itemPurchaseTableBody.on('click', '#removeProductPurchase', function () {
        const $row = $(this).closest('tr');
        const skuId = $row.data('sku-id');
        purchaseRequestData.items = purchaseRequestData.items.filter(i => i.skuId !== skuId);
        $row.remove();
        updateSummary();
    });

    // --- Close overlays ---
    $closeProductOverlayButton.on('click', () => hideOverlay($productOverlay));
    $closeAttributeOverlayButton.on('click', () => hideOverlay($attributeOverlay));
    $addSelectedItemsButton.on('click', () => hideOverlay($addItemOverlay));
    $('.overlay').on('click', function (e) { if (e.target === this) hideOverlay($(this)); });

    // --- Fetch suppliers ---
    $.ajax({ url: '/api/v1/suppliers', method: 'GET', success: function (data) {
            const $select = $('#supplier-select');
            $select.empty().append('<option value="" disabled selected>Select a supplier</option>');
            data.forEach(s => $select.append(`<option value="${s.id}">${s.supplierName}</option>`));
        }});

    updateSummary();
});
