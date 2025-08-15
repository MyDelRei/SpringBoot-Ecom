$(document).ready(() => {
    // Fetch warehouses on page load
    const $select = $("#warehouseName");
    $select.prop('disabled', true);
    $select.append('<option value="">Loading...</option>');

    $.get("/api/v1/admin/warehouses")
        .done((warehouses) => {
            $select.empty();
            $select.append('<option value="">-- Select Warehouse --</option>');

            warehouses.forEach(warehouse => {
                $select.append(`<option value="${warehouse.warehouseId}">${warehouse.warehouseName}</option>`);
            });
            $select.prop('disabled', false);
        })
        .fail((err) => {
            console.error('Fetch Warehouses Failed:', err);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load warehouses. Please try again.',
                icon: 'error',
                confirmButtonText: 'Close'
            });
            $select.prop('disabled', false);
        });

    // Handle form submit (add location)
    $('#addLocationForm').on('submit', function (e) {
        e.preventDefault();

        const warehouseId = $('#warehouseName').val();
        const section = $('#section').val();
        const aisle = $('#aisle').val();
        const bin = $('#bin').val();

        if (!warehouseId || !section || !aisle || !bin) {
            Swal.fire({
                title: 'Error!',
                text: 'Please fill in all required fields.',
                icon: 'error',
                confirmButtonText: 'Close'
            });
            return;
        }

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
                        warehouseId: warehouseId
                    },
                    section: section,
                    aisle: aisle,
                    bin: bin,
                    note: $('#note').val()
                };

                console.log(data);
                console.log(data.warehouse);
                console.log(data.warehouse.warehouseId);

                const $submitBtn = $(this).find('button[type="submit"]');
                $submitBtn.prop('disabled', true);

                $.ajax({
                    url: '/api/v1/admin/locations',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: () => {
                        Swal.fire({
                            title: 'Saved!',
                            text: 'Location added successfully.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            window.location.href = `/location?success=Successfully added new location`;
                        });
                    },
                    error: (err) => {
                        console.error('Add Location Failed:', err);
                        const errorMessage = err.responseJSON?.message || 'Failed to add location. Please try again.';
                        Swal.fire({
                            title: 'Error!',
                            text: errorMessage,
                            icon: 'error',
                            confirmButtonText: 'Close'
                        });
                    },
                    complete: () => {
                        $submitBtn.prop('disabled', false);
                    }
                });
            }
        });
    });

    // Handle delete button click
    $(document).on('click', '.delete-location-btn', function () {
        const locationId = $(this).data('id');
        if (!locationId) {
            Swal.fire({
                title: 'Error!',
                text: 'Location ID not found.',
                icon: 'error',
                confirmButtonText: 'Close'
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this location? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete it',
            cancelButtonText: 'No, Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/api/v1/admin/locations/${locationId}`,
                    method: 'DELETE',
                    success: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Location deleted successfully.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            // Option 1: Refresh the page
                            window.location.reload();
                            // Option 2: Remove the row from the DOM (if using a table)
                            // $(this).closest('tr').remove();
                        });
                    },
                    error: (err) => {
                        console.error('Delete Location Failed:', err);
                        const errorMessage = err.responseJSON?.message || 'Failed to delete location. Please try again.';
                        Swal.fire({
                            title: 'Error!',
                            text: errorMessage,
                            icon: 'error',
                            confirmButtonText: 'Close'
                        });
                    }
                });
            }
        });
    });
});