$(document).ready(function () {
    $('#addWarehouseForm').on('submit', function (e) {
        e.preventDefault();

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to save this warehouse?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Save it',
            cancelButtonText: 'No, Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // If user confirms, proceed with AJAX
                const data = {
                    warehouseName: $('#warehouseName').val(),
                    location: $('#location').val(),
                    description: $('#description').val()
                };

                ajaxHelper.post('/api/v1/admin/warehouses', data,
                    function (response) {
                        Swal.fire({
                            title: 'Saved!',
                            text: 'Warehouse added successfully.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            // Optional: redirect after user clicks OK
                            window.location.href = `/warehouse?success=Successfully added new warehouse`;
                        });
                    },
                    function (err) {
                        console.error('Add Warehouse Failed:', err);

                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to add warehouse. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'Close'
                        });
                    }
                );
            } else {
                // User canceled, do nothing
                console.log('User canceled the operation.');
            }
        });
    });
});
