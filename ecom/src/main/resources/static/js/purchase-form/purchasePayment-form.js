$(document).ready(function () {
    let paymentData = {
        supplierId: null,
        spm_Id: null, // paymentMethodId
        amount: null,
        requestId: null,
        invoiceNumber: null
    };

    // Remove collapsed-open class on dropdown menus (if any)
    $('.dropdown-menu').removeClass('collapsed-open');

    // Load warehouses into #shipTo select
    $.ajax({
        url: '/api/v1/admin/warehouses',
        type: 'GET',
        success: function (data) {
            const $select = $('#shipTo');
            $select.empty();
            $select.append('<option value="">Select a warehouse</option>');
            data.forEach(function (warehouse) {
                $select.append(`<option value="${warehouse.warehouseId}">${warehouse.warehouseName}, Location : ${warehouse.location}</option>`);
            });
        },
        error: function () {
            $('#shipTo').html('<option value="">Failed to load warehouses</option>');
        }
    });

    // Generate invoice number and save to paymentData
    $.ajax({
        url: '/api/v1/purchases/generate',
        type: 'GET',
        success: function (data) {
            $('#invoiceNo').val(data);
            paymentData.invoiceNumber = data;
            console.log('Invoice No loaded:', data);
        },
        error: function () {
            alert('Failed to generate invoice number.');
        }
    });

    // Get requestId from URL and save
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get("requestId");
    paymentData.requestId = requestId;

    // Fetch purchase amount and update UI + paymentData
    function fetchPurchaseAmount(requestId) {
        $.ajax({
            url: `/api/v1/purchases/${requestId}/amount`,
            type: "GET",
            success: function (data) {
                const amount = parseFloat(data.totalAmount);
                $('#grandTotal').val(amount.toFixed(2) + '$');
                paymentData.amount = amount;
                updateReceiptPreview();
                console.log('Amount loaded:', amount);
                logPaymentData();
            },
            error: function (xhr, status, error) {
                console.error("Error fetching amount:", error);
            }
        });
    }

    // Store paymentMethods in a global map after fetchSupplierPaymentInfo runs
    let paymentMethodsMap = {};

    // Fetch supplier payment info, populate payment methods, update paymentData
    function fetchSupplierPaymentInfo(requestId) {
        $.ajax({
            url: `/api/v1/purchases/${requestId}/supplier/get-for-payment`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                // Redirect if status is 'paid'
                if (data.status && data.status.toLowerCase() === 'paid') {
                    window.location.href = '/Request';
                    return;
                }

                $('#Supplier').val(data.supplierName || '');
                $('#status').val(data.status || '');

                paymentData.supplierId = data.supplierId || null;

                const $paymentSelect = $('#payment');
                $paymentSelect.empty();

                paymentMethodsMap = {}; // reset map

                if (data.paymentMethods && data.paymentMethods.length > 0) {
                    data.paymentMethods.forEach(pm => {
                        paymentMethodsMap[pm.paymentMethodId] = pm; // store in map

                        $paymentSelect.append(
                            $('<option></option>').val(pm.paymentMethodId).text(pm.paymentType)
                        );
                    });

                    $paymentSelect.val(data.paymentMethods[0].paymentMethodId);
                    $('#number').val(data.paymentMethods[0].accountNumber || '');
                    paymentData.spm_Id = data.paymentMethods[0].paymentMethodId;

                    bindShowQrButton(data.paymentMethods[0]);
                    logPaymentData();
                } else {
                    $paymentSelect.append('<option value="">No payment methods</option>');
                    $('#number').val('');
                }
            },
            error: function (xhr, status, error) {
                console.error(error);
                window.location.href = '/Request';
            }
        });
    }

    // Update paymentData and #number input when payment method changes
    $('#payment').on('change', function () {
        const selectedId = $(this).val();
        paymentData.spm_Id = selectedId;

        if (paymentMethodsMap[selectedId]) {
            const selectedMethod = paymentMethodsMap[selectedId];
            $('#number').val(selectedMethod.accountNumber || '');

            // Re-bind QR button with selected method's QR data
            bindShowQrButton(selectedMethod);
        } else {
            $('#number').val('');
        }

        updateReceiptPreview();
        logPaymentData();
    });

    // Bind show QR button event for a payment method object
    function bindShowQrButton(paymentMethod) {
        $('button:contains("show QR")').off('click').on('click', function (e) {
            e.preventDefault();
            if (paymentMethod.qrImg) {
                $('#qrImage').attr('src', `data:image/png;base64,${paymentMethod.qrImg}`);
                $('#qrOverlay').css('display', 'flex');
            } else {
                alert("No QR code available.");
            }
        });
    }

    // Close QR overlay
    $('#closeQrOverlay').click(function () {
        $('#qrOverlay').hide();
    });

    // Load purchase items
    function loadPurchaseItems(requestId) {
        $.ajax({
            url: `/api/v1/purchases/${requestId}/item`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                const $tbody = $('#receiptProductBody');
                $tbody.empty();

                const grouped = {};
                data.forEach(item => {
                    if (!grouped[item.requestItemId]) {
                        grouped[item.requestItemId] = {
                            productName: item.productName,
                            quantity: item.quantity,
                            basePrice: item.basePrice,
                            attributes: []
                        };
                    }
                    grouped[item.requestItemId].attributes.push(`${item.attributeName}: ${item.attributeValue}`);
                });

                Object.values(grouped).forEach(item => {
                    const attrString = item.attributes.join(', ');
                    const amount = item.basePrice * item.quantity;
                    const row = `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.productName}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${attrString}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.quantity}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${amount.toFixed(2)}</td>
                        </tr>`;
                    $tbody.append(row);
                });
            },
            error: function (xhr, status, error) {
                console.error('Failed to load purchase items:', error);
            }
        });
    }

    // Update receipt preview and paymentData sync
    function updateReceiptPreview() {
        const supplierName = $('#Supplier').val();
        const paymentMethodText = $('#payment option:selected').text();

        $('#receiptSupplierName').text(supplierName);
        $('#receiptSupplierPaymentMethod').text(paymentMethodText);
        $('#receiptBillToName').text(supplierName);

        const shipToText = $('#shipTo option:selected').text();
        $('#receiptShipToName').text(shipToText);
        $('#receiptShipToLocation').text(shipToText);

        const invoiceNo = $('#invoiceNo').val();
        $('#receiptInvoiceNo').text(invoiceNo);
        paymentData.invoiceNumber = invoiceNo;

        const today = new Date().toLocaleDateString('en-GB');
        $('#receiptInvoiceDate').text(today);

        const status = $('#status').val();
        $('#receiptPaymentStatus').text(status);
        $('#receiptPaymentDate').text(today);

        const grandTotal = $('#grandTotal').val();
        $('#receiptSubTotal').text(grandTotal);
        $('#receiptGrandTotal').text(grandTotal);
        $('#receiptSalesTax').text('Included');

        const rawAmount = parseFloat(grandTotal.replace('$', ''));
        if (!isNaN(rawAmount)) {
            paymentData.amount = rawAmount;
        }

        logPaymentData();
    }

    // Log paymentData in console for debugging
    function logPaymentData() {
        console.log("✅ paymentData:", paymentData);
    }

    // Bind listeners for changes on key inputs to update receipt
    $('#Supplier, #payment, #shipTo, #invoiceNo, #status, #grandTotal').on('change input', function () {
        updateReceiptPreview();
    });

    // Load all initial data
    function loadPurchaseData(requestId) {
        if (!requestId) return;
        fetchPurchaseAmount(requestId);
        fetchSupplierPaymentInfo(requestId);
        loadPurchaseItems(requestId);
    }

    loadPurchaseData(requestId);

    // Continue button PDF generation + payment POST (jQuery style)
    $('#continueButton').on('click', function () {
        const $invoiceReceipt = $('#invoiceReceipt');
        const $invoiceTableContainer = $('#invoiceTableContainer');
        const originalOverflowClass = $invoiceTableContainer.hasClass('overflow-x-auto') ? 'overflow-x-auto' : '';

        console.log("paymentData:", paymentData); // Debug to check data

        Swal.fire({
            title: 'Confirm Payment',
            text: 'Are you sure you want to proceed with this payment?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, pay now',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/api/v1/supplier-payments',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(paymentData),
                    success: function (message) {
                        Swal.fire({
                            title: 'Success',
                            text: message,
                            icon: 'success',
                        });
                    },
                    error: function (xhr) {
                        Swal.fire({
                            title: 'Error',
                            text: xhr.responseText || 'Payment failed',
                            icon: 'error',
                        });
                    }
                });
            }
        });

        $invoiceTableContainer.removeClass('overflow-x-auto');

        const pdfOptions = {
            margin: [15, 15, 15, 15],
            filename: 'invoice_receipt.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 4,
                logging: true,
                dpi: 300,
                letterRendering: true,
                useCORS: true,
                windowWidth: 2100,
                windowHeight: 2970
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },
            pagebreak: {
                mode: ['css', 'legacy'],
                before: '.page-break',
            }
        };

        html2pdf().from($invoiceReceipt[0]).set(pdfOptions).outputPdf('datauristring').then(function (pdfDataUri) {
            if (originalOverflowClass) {
                $invoiceTableContainer.addClass(originalOverflowClass);
            }

            const newWindow = window.open();
            if (newWindow) {
                newWindow.document.write('<iframe width="100%" height="100%" src="' + pdfDataUri + '"></iframe>');
                newWindow.document.title = 'Invoice Receipt Preview';
            } else {
                console.error("Failed to open new window for PDF preview. Please allow pop-ups for this site.");
                html2pdf().from($invoiceReceipt[0]).set(pdfOptions).save();
            }
        }).catch(error => {
            console.error("Error generating PDF:", error);
            if (originalOverflowClass) {
                $invoiceTableContainer.addClass(originalOverflowClass);
            }
            html2pdf().from($invoiceReceipt[0]).set(pdfOptions).save();
        });
    });

});
