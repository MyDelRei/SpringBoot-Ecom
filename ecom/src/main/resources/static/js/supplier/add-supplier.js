$(document).ready(function () {
    $('#addSupplierForm').on('submit', function (e) {
        e.preventDefault();

        const supplierData = {
            supplierName: $('#supplierName').val().trim(),
            phone: $('#Phone').val().trim(),
            email: $('#email').val().trim(),
            address: $('#address').val().trim()
        };

        // Basic check
        if (!supplierData.supplierName || !supplierData.phone || !supplierData.email || !supplierData.address) {
            Swal.fire({
                icon: 'warning',
                title: 'All fields are required!',
                confirmButtonColor: '#6366F1'
            });
            return;
        }

        // Ask for confirmation first
        Swal.fire({
            icon: 'question',
            title: 'Add this supplier?',
            text: 'Are you sure you want to add this supplier?',
            showCancelButton: true,
            confirmButtonText: 'Yes, Add',
            cancelButtonText: 'No',
            confirmButtonColor: '#6366F1',
            cancelButtonColor: '#6B7280'
        }).then((result) => {
            if (result.isConfirmed) {
                // If confirmed, send to backend
                $.ajax({
                    url: '/api/v1/suppliers',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(supplierData),
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: 'Supplier added successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            window.location.href = '/supplier/list-supplier?success=Supplier added successfully'; // adjust route
                        });
                    },
                    error: function (xhr) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Failed to add supplier!',
                            text: xhr.responseText || 'Something went wrong.',
                            confirmButtonColor: '#EF4444'
                        });
                    }
                });
            }
        });
    });
});
