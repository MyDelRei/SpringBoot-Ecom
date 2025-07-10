$(document).ready(function(){


    let isSerializedValue = $('#is_serialized').val();
    let isSerializedChar;

    if (isSerializedValue === 'Yes') {
        isSerializedChar = 'Y';
    } else if (isSerializedValue === 'No') {
        isSerializedChar = 'N';
    } else {
        isSerializedChar = 'N';
    }


    ajaxHelper.get('/api/v1/admin/product', function (products) {
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


    $('#addWarehouseForm').on('submit', function (e) {
        e.preventDefault();

        const data = {
            product: { productId: parseInt($('#ProductSelect').val()) },
            skuCode: $('#skuCode').val(),
            description: $('#description').val(),
            basePrice: parseFloat($('#BasePrice').val()),
            salePrice: parseFloat($('#SalePrice').val()),
            isSerialized: isSerializedChar
        };

        console.log(data)

        // First confirmation dialog
        Swal.fire({
            title: 'Add this SKU?',
            text: "Are you sure you want to save this SKU?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Proceed with AJAX request if confirmed
                ajaxHelper.post('/api/v1/admin/sku', data,
                    function (res) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Saved!',
                            text: 'SKU has been added successfully.',
                            confirmButtonText: 'OK'
                        });
                        // Optional: clear form or redirect
                        $('#addWarehouseForm')[0].reset();
                    },
                    function (err) {
                        console.error(err);
                        Swal.fire({
                            icon: 'error',
                            title: 'Failed',
                            text: 'Something went wrong while adding the SKU.'
                        });
                    });
            }
        });
    });





})