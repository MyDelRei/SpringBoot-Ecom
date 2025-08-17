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

    // Our main purchase data object
    let purchaseRequestData = {
        supplierId: null,
        requestDate: new Date().toISOString().split('T')[0], // format YYYY-MM-DD
        expectedDeliveryDate: null, // set dynamically later
        status: 'pending',
        items: []
    };

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
            const costPriceText = $row.find('.cost-price').text();
            const qtyText = $row.find('.qty-display').text();

            const price = parseFloat(costPriceText.replace('$', '').trim());
            const qty = parseInt(qtyText);

            if (!isNaN(price) && !isNaN(qty)) {
                grandTotal += price * qty;
            }
        });

        $itemPurchaseCountSpan.text(itemCount);
        $grandTotalSpan.text(grandTotal.toFixed(2) + ' $');
    }

    // Supplier selection sets supplierId
    $('#supplier-select').on('change', function () {
        purchaseRequestData.supplierId = parseInt($(this).val());
        console.log('Supplier selected:', purchaseRequestData.supplierId);
    });

    $('.show-product-btn').on('click', function () {
        const productsData = JSON.parse($(this).data('products'));
        $productListContainer.empty();

        if (productsData.length > 0) {
            productsData.forEach(product => {
                const productItem = `
                    <div class="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-200">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Product</p>
                            <p class="text-lg font-semibold text-gray-800">${product.name}</p>
                        </div>
                        <p class="text-lg font-bold text-gray-800">${product.price} $</p>
                    </div>
                `;
                $productListContainer.append(productItem);
            });
        } else {
            $productListContainer.html('<p class="text-center text-gray-600">No products found for this order.</p>');
        }

        showOverlay($productOverlay);
    });

    // Show attributes on purchase table rows
    $itemPurchaseTableBody.on('click', '.show-attribute-btn', function () {
        const attributesData = $(this).data('attributes') || [];

        $attributeListContainer.empty();

        if (attributesData.length > 0) {
            attributesData.forEach(attribute => {
                const attributeItem = `
                <div class="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-200">
                    <div>
                        <p class="text-sm font-medium text-gray-500">${attribute.attributeName}</p>
                        <p class="text-lg font-semibold text-gray-800">${attribute.attributeValue}</p>
                    </div>
                </div>
            `;
                $attributeListContainer.append(attributeItem);
            });
        } else {
            $attributeListContainer.html('<p class="text-center text-gray-600">No attributes found for this product.</p>');
        }

        showOverlay($attributeOverlay);
    });

    $addItemButton.on('click', function () {
        showOverlay($addItemOverlay);
    });

    // When clicking Add button inside supplier product list, prepare selectedProductToAdd
    $addItemProductTableBody.on('click', '.add-item-to-qty-overlay-btn', function () {
        const $row = $(this).closest('tr');
        const attributesData = $row.data('attributes') || [];

        selectedProductToAdd = {
            skuId: $row.data('sku-id'),
            name: $row.find('.product-name').text(),
            sku: $row.find('.sku-code').text(),
            status: $row.find('.status').text(),
            leadDay: $row.find('.lead-day').text(),
            costPrice: parseFloat($row.find('.cost-price').text()),
            attributes: attributesData
        };

        $quantityInput.val(1);
        showOverlay($addQuantityOverlay);
    });

    $confirmAddItemQtyButton.on('click', function () {
        const qty = parseInt($quantityInput.val());

        if (isNaN(qty) || qty <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }

        if (selectedProductToAdd) {
            // Add item to purchaseRequestData with camelCase keys
            purchaseRequestData.items.push({
                skuId: selectedProductToAdd.skuId,
                quantityRequest: qty
            });

            // Auto-calculate expectedDeliveryDate based on max lead days
            const leadDaysText = selectedProductToAdd.leadDay || '0';
            const leadDays = parseInt(leadDaysText.replace(/\D/g, ''), 10) || 0;

            const requestDate = new Date(purchaseRequestData.requestDate);
            const estimatedDeliveryDate = new Date(requestDate);
            estimatedDeliveryDate.setDate(requestDate.getDate() + leadDays);

            // Convert to yyyy-mm-dd
            const formattedExpectedDate = estimatedDeliveryDate.toISOString().split('T')[0];

            // Set only if it's later than current expectedDeliveryDate
            if (!purchaseRequestData.expectedDeliveryDate || formattedExpectedDate > purchaseRequestData.expectedDeliveryDate) {
                purchaseRequestData.expectedDeliveryDate = formattedExpectedDate;
                console.log('Expected delivery date calculated:', formattedExpectedDate);
            }

            console.log('Purchase Request Data updated:', purchaseRequestData);

            const totalPrice = (selectedProductToAdd.costPrice * qty).toFixed(2);

            // Add row with data-sku-id for removal reference
            const newRow = `
            <tr class="border-b border-gray-200 hover:bg-gray-50" data-sku-id="${selectedProductToAdd.skuId}">
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
                <td class="py-3 px-4 border-r border-gray-200">${selectedProductToAdd.name}</td>
                <td class="py-3 px-4 border-r border-gray-200">
                    <button class="show-attribute-btn h-[32px] px-3 py-1 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
                        data-attributes='${JSON.stringify(selectedProductToAdd.attributes)}'>Show</button>
                </td>
                <td class="py-3 px-4 border-r border-gray-200">${selectedProductToAdd.leadDay}</td>
                <td class="py-3 px-4 border-r border-gray-200 qty-display">${qty}</td>
                <td class="py-3 px-4 border-r border-gray-200 cost-price">${totalPrice} $</td>
                <td class="py-3 px-4 text-center space-x-2">
                    <button id="removeProductPurchase" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-200">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
            `;
            $itemPurchaseTableBody.append(newRow);
            updateSummary();
        }

        hideOverlay($addQuantityOverlay);
        hideOverlay($addItemOverlay);
        selectedProductToAdd = null;
    });

    // Remove row and update purchaseRequestData accordingly
    $itemPurchaseTableBody.on('click', '#removeProductPurchase', function () {
        const $row = $(this).closest('tr');
        const skuIdToRemove = $row.data('sku-id');

        if (skuIdToRemove) {
            purchaseRequestData.items = purchaseRequestData.items.filter(item => item.skuId !== skuIdToRemove);
            console.log('Item removed from purchaseRequestData:', purchaseRequestData);
        }

        $row.remove();
        updateSummary();
    });

    // Close buttons
    $closeProductOverlayButton.on('click', () => hideOverlay($productOverlay));
    $closeAttributeOverlayButton.on('click', () => hideOverlay($attributeOverlay));
    $addSelectedItemsButton.on('click', () => hideOverlay($addItemOverlay));

    // Close overlay on outside click
    $('.overlay').on('click', function (e) {
        if (e.target === this) {
            hideOverlay($(this));
        }
    });

    // Fetch suppliers
    $.ajax({
        url: '/api/v1/suppliers',
        method: 'GET',
        success: function (data) {
            const $select = $('#supplier-select');
            $select.empty();

            $select.append('<option value="" disabled selected>Select a supplier</option>');

            data.forEach(supplier => {
                const option = `<option value="${supplier.id}">${supplier.supplierName}</option>`;
                $select.append(option);
            });
        },
        error: function (xhr, status, error) {
            console.error('Failed to fetch suppliers:', error);
        }
    });

    // Fetch supplier products and fill product list on Add Item button click
    $('#addItemButton').on('click', function () {
        const supplierId = $('#supplier-select').val();

        if (!supplierId) {
            alert('Please select a supplier first.');
            return;
        }

        $.ajax({
            url: `/api/v1/suppliers/supplier/${supplierId}/details`,
            method: 'GET',
            success: function (data) {
                const $tbody = $('#addItemProductTableBody');
                $tbody.empty();

                if (!data.skus || data.skus.length === 0) {
                    $tbody.append(`<tr><td colspan="7" class="text-center py-4 text-gray-600">No products found for this supplier.</td></tr>`);
                    return;
                }

                data.skus.forEach((sku, index) => {
                    const status = "Available";    // replace with actual data if exists
                    const leadDay = "5 days";      // replace with actual data if exists

                    const newRow = `
                    <tr class="border-b border-gray-200 hover:bg-gray-50" data-attributes='${JSON.stringify(sku.attributes)}' data-sku-id='${sku.skuId}'>
                        <td class="py-3 px-4 border-r border-gray-200">
                            <div class="inline-flex items-center">
                                <label class="flex items-center cursor-pointer relative">
                                    <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" id="check-add-item-${index + 1}" />
                                    <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                    </span>
                                </label>
                            </div>
                        </td>
                        <td class="py-3 px-4 border-r border-gray-200 product-name">${sku.product.productName}</td>
                        <td class="py-3 px-4 border-r border-gray-200 sku-code">${sku.skuCode}</td>
                        <td class="py-3 px-4 border-r border-gray-200 status">${status}</td>
                        <td class="py-3 px-4 border-r border-gray-200 lead-day">${leadDay}</td>
                        <td class="py-3 px-4 border-r border-gray-200 cost-price">${sku.basePrice.toFixed(2)}</td>
                        <td class="py-3 px-4 text-center">
                            <button class="add-item-to-qty-overlay-btn h-[32px] px-3 py-1 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition-colors">
                                <i class="fas fa-plus mr-1"></i> Add
                            </button>
                        </td>
                    </tr>
                `;
                    $tbody.append(newRow);
                });
            },
            error: function () {
                alert('Failed to fetch supplier product list.');
            }
        });
    });

    $('#continuePurchase').on('click', function () {
        if (!purchaseRequestData.supplierId || !purchaseRequestData.requestDate || !purchaseRequestData.expectedDeliveryDate || purchaseRequestData.items.length === 0) {
            Swal.fire('Error', 'Please fill all required fields and add at least one product.', 'warning');
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to submit this purchase request?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, submit it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // AJAX POST request
                $.ajax({
                    url: '/api/v1/purchases',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(purchaseRequestData),
                    success: function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Submitted!',
                            text: 'Your purchase request has been submitted.',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            // Optional: reset form or redirect
                            location.reload();
                        });
                    },
                    error: function (xhr) {
                        let errorMsg = 'Something went wrong.';
                        if (xhr.responseJSON && xhr.responseJSON.message) {
                            errorMsg = xhr.responseJSON.message;
                        }
                        Swal.fire('Error', errorMsg, 'error');
                    }
                });
            }
        });
    });

    // Initial summary
    updateSummary();
});
