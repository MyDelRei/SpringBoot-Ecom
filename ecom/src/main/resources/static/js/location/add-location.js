$(document).ready(function () {
    $('#addLocationForm').on('submit', function (e) {
        e.preventDefault();

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to save this location?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Save it',
            cancelButtonText: 'No, Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    warehouse: {
                        warehouseId: $('#warehouseId').val()
                    },
                    section: $('#section').val(),
                    aisle: $('#aisle').val(),
                    bin: $('#bin').val(),
                    note: $('#note').val()
                };

                ajaxHelper.post('/api/v1/admin/locations', data,
                    function (response) {
                        Swal.fire({
                            title: 'Saved!',
                            text: 'Location added successfully.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            window.location.href = `/locations?success=Successfully added new location`;
                        });
                    },
                    function (err) {
                        console.error('Add Location Failed:', err);

                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to add location. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'Close'
                        });
                    }
                );
            } else {
                console.log('User canceled the operation.');
            }
        });
    });
});
