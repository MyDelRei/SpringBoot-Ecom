$(document).ready(function () {
    let supplierList = [];
    const supplierId = $('#SupplierId').val();

    // Fetch supplier data on load
    ajaxHelper.get("/api/v1/suppliers", function (data) {
        supplierList = data;
    });

    // Create the dropdown container dynamically
    const $dropdown = $('<div class="bg-white border border-gray-300 rounded-md absolute z-50 w-full mt-1 hidden shadow-lg max-h-48 overflow-y-auto"></div>');
    $('#Supplier').after($dropdown);

    $('#Supplier').on('input', function () {
        const input = $(this).val().toLowerCase();
        $dropdown.empty();

        const matches = supplierList.filter(supplier =>
            supplier.supplierName.toLowerCase().includes(input)
        );

        if (input && matches.length > 0) {
            matches.forEach(supplier => {
                const $item = $(`<div class="px-4 py-2 hover:bg-indigo-100 cursor-pointer">${supplier.supplierName}</div>`);
                $item.on('click', function () {
                    $('#Supplier').val(supplier.supplierName);
                    $('#SupplierId').val(supplier.id);
                    $dropdown.empty().hide();
                    console.log(supplier.id);
                });
                $dropdown.append($item);
            });

            const offset = $('#Supplier').offset();
            $dropdown.css({
                top: $('#Supplier').outerHeight(),
                left: 0
            });

            $dropdown.show();
        } else {
            $dropdown.hide();
        }
    });

    // Hide dropdown on click outside
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#supplier').length && !$(e.target).closest($dropdown).length) {
            $dropdown.hide();
        }
    });

    $('#QRImg').on('change', function (event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Replace #imagePreview content with the image
                $('#imagePreview').html(`<img src="${e.target.result}" alt="Preview" class="max-h-60 mx-auto rounded-[15px] object-contain" />`);
            };
            reader.readAsDataURL(file);
        } else {
            // Not an image or no file selected — show default placeholder
            $('#imagePreview').html(`
                <div class="text-center text-gray-400">
                    <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p class="mt-1 text-sm">Upload image</p>
                </div>`);
        }
    });

    $('#createPaymentMethodForSuppBtn').on('click', async function (e) {
        e.preventDefault();

        // Find the supplier object by exact name (case-insensitive)
        const supplierNameInput = $('#Supplier').val().trim();
        const supplier = supplierList.find(s => s.supplierName.toLowerCase() === supplierNameInput.toLowerCase());

        if (!supplier) {
            Swal.fire('Invalid Supplier', 'Please select a valid supplier from the dropdown list.', 'warning');
            return;
        }

        // Gather input values
        const dto = {
            supplierId: parseInt($('#SupplierId').val(), 10),
            paymentType: $('#Type').val(),
            bank: $('#Bank').val().trim() || null,
            accountNumber: $('#accountNo').val().trim() || null,
            qrImg: null
        };
        console.log(dto)

        // Validate required fields
        if (!dto.paymentType) {
            Swal.fire('Missing Type', 'Please select the payment method type.', 'warning');
            return;
        }

        // If QR image selected, convert to base64 and then to byte array
        const qrFile = $('#QRImg')[0].files[0];
        if (qrFile) {
            try {
                dto.qrImg = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64String = reader.result.split(',')[1];
                        const byteArray = atob(base64String).split('').map(c => c.charCodeAt(0));
                        resolve(byteArray);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(qrFile);
                });

            } catch (err) {
                Swal.fire('Image Error', 'Failed to process the QR image.', 'error');
                return;
            }
        }

        console.log(dto);


        // Use your ajaxHelper to POST JSON
        ajaxHelper.post('/api/v1/suppliers/payment-method/create', dto,
            function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Supplier payment method created successfully!',
                    confirmButtonColor: '#6366F1'
                }).then(() => {
                    // Reset form and preview image
                    $('form')[0].reset();
                    $('#imagePreview').html(`
                        <div class="text-center text-gray-400">
                            <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <p class="mt-1 text-sm">Upload image</p>
                        </div>`);
                });
            },
            function (err) {
                Swal.fire('Error', err.responseJSON?.message || 'Failed to create payment method', 'error');
            });
    });

});
