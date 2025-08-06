$(document).ready(function() {
    const productOverlay = document.getElementById('productOverlay');
    const closeProductOverlayButton = document.getElementById('closeProductOverlay');
    const productListContainer = document.getElementById('product-list-container');

    const editOverlay = document.getElementById('EditOverlay');
    const closeEditOverlayButton = document.getElementById('closeEditOverlay');
    const requestIdInput = document.getElementById('requestIdInput');
    const statusSelect = document.getElementById('status');

    function showOverlay(el) {
        el.classList.remove('invisible', 'opacity-0');
        el.querySelector('.bg-white').classList.remove('scale-95');
        el.querySelector('.bg-white').classList.add('scale-100');
        el.classList.add('visible', 'opacity-100');
    }

    function hideOverlay(el) {
        el.classList.remove('visible', 'opacity-100');
        el.classList.add('invisible', 'opacity-0');
        el.querySelector('.bg-white').classList.remove('scale-100');
        el.querySelector('.bg-white').classList.add('scale-95');
    }

    closeProductOverlayButton.addEventListener('click', () => hideOverlay(productOverlay));
    closeEditOverlayButton.addEventListener('click', () => hideOverlay(editOverlay));

    productOverlay.addEventListener('click', e => { if (e.target === productOverlay) hideOverlay(productOverlay); });
    editOverlay.addEventListener('click', e => { if (e.target === editOverlay) hideOverlay(editOverlay); });

    function loadPurchaseOrders() {
        $.ajax({
            url: '/api/v1/purchases/info',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                const $tbody = $('#PurchaseOrderList');
                $tbody.empty();

                data.forEach(order => {
                    const productsDataAttr = JSON.stringify(order.products).replace(/"/g, '&quot;');

                    const row = `
                        <tr class="border-b border-gray-200 hover:bg-gray-50">
                          <td class="py-3 px-4 border-r border-gray-200">
                            <div class="inline-flex items-center">
                              <label class="flex items-center cursor-pointer relative">
                                <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" id="check-purchase-order-${order.requestId}" />
                                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                  </svg>
                                </span>
                              </label>
                            </div>
                          </td>
                          <td class="py-3 px-4 border-r border-gray-200">${order.supplierName}</td>
                          <td class="py-3 px-4 border-r border-gray-200">${order.requestDate}</td>
                          <td class="py-3 px-4 border-r border-gray-200">${order.requestStatus}</td>
                        
                          <td class="py-3 px-4 border-r border-gray-200">${order.expectedDeliveryDate || ''}</td>
                          <td class="py-3 px-4 border-r border-gray-200">
                            <button class="show-product-btn h-[32px] px-3 py-1 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
                                    data-products="${productsDataAttr}">
                              Show
                            </button>
                          </td>
                          <td class="py-3 px-4 border-r border-gray-200">
                           <a href="/payment/purchase?requestId=${order.requestId}" 
                               class="payment-btn h-[32px] px-3 py-1 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
                               data-request='${JSON.stringify(order).replace(/'/g, "&apos;")}'>
                               Payment
                            </a>


                          
                            </td>
                          <td class="py-3 px-4 text-center space-x-2">
                            <button
                              class="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition duration-200 edit-btn"
                              data-id="${order.requestId}"
                              data-status="${order.requestStatus}">
                              <i class="fas fa-pencil-alt"></i>
                            </button>
                            <button id="deleteBtn" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-200" data-id="${order.requestId}">
                              <i class="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                    `;

                    $tbody.append(row);
                });

                attachShowProductListeners();
                attachEditListeners();
            },
            error: function(err) {
                console.error('Failed to fetch purchase orders:', err);
            }
        });
    }

    function attachShowProductListeners() {
        document.querySelectorAll('.show-product-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productsData = JSON.parse(this.getAttribute('data-products'));
                productListContainer.innerHTML = '';

                if (productsData.length > 0) {
                    productsData.forEach(product => {
                        const productItem = `
                          <div class="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-200">
                            <div>
                              <p class="text-sm font-medium text-gray-500">Product</p>
                              <p class="text-lg font-semibold text-gray-800">${product.productName}</p>
                            </div>
                            <p class="text-lg font-bold text-gray-800">Qty: ${product.quantity}</p>
                          </div>
                        `;
                        productListContainer.insertAdjacentHTML('beforeend', productItem);
                    });
                } else {
                    productListContainer.innerHTML = '<p class="text-center text-gray-600">No products found for this order.</p>';
                }
                showOverlay(productOverlay);
            });
        });
    }

    function attachEditListeners() {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                const requestStatus = this.getAttribute('data-status');

                requestIdInput.value = requestId;

                const normalizedStatus = requestStatus ? requestStatus.toLowerCase() : '';
                for (const option of statusSelect.options) {
                    option.selected = option.value.toLowerCase() === normalizedStatus;
                }

                showOverlay(editOverlay);
            });
        });
    }

    $("#updateStatus").on("click", function(e) {
        e.preventDefault();

        const requestId = $("#requestIdInput").val();
        const status = $("#status").val();

        $.ajax({
            url: `/api/v1/purchases/${requestId}/status`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
                requestId: requestId,
                status: status
            }),
            success: function() {
                hideOverlay(editOverlay);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Status updated successfully!',
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    loadPurchaseOrders();
                });
            },
            error: function(xhr) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Error updating status: " + (xhr.responseJSON?.message || xhr.status),
                });
            }
        });
    });

    $(document).on('click', '#deleteBtn', function() {
        const requestId = $(this).data('id');

        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete purchase request #${requestId}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/api/v1/purchases/${requestId}`,
                    type: 'DELETE',
                    success: function() {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Purchase request has been deleted.',
                            timer: 1500,
                            showConfirmButton: false
                        });
                        loadPurchaseOrders();
                    },
                    error: function(xhr) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: `Failed to delete: ${xhr.responseJSON?.message || xhr.statusText || 'Unknown error'}`,
                        });
                    }
                });
            }
        });
    });

    function attachPaymentListeners() {
        document.querySelectorAll('.payment-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent redirect for now

                const requestData = JSON.parse(this.getAttribute('data-request'));

                // Store in localStorage
                localStorage.setItem('selectedPurchaseRequest', JSON.stringify(requestData));

                // Just log it for now
                console.log("Stored Request:", requestData);

                // Later, you can do:
                // window.location.href = `/payment/purchase?requestId=${requestData.requestId}`;
            });
        });
    }


    // Initial load
    loadPurchaseOrders();
});
