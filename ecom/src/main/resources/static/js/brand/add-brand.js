$(document).ready(function () {
    // Slug auto-generator
    $('#brandName').on('input', function () {
        const brandName = $(this).val();

        const slug = brandName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')   // Remove non-alphanumerics except hyphens
            .replace(/\s+/g, '-')           // Spaces to hyphens
            .replace(/^-+|-+$/g, '');       // Trim hyphens

        $('#slug').val(slug);
    });

    // Submit with confirmation
    $('#addBrandForm').on('submit', function (e) {
        e.preventDefault();

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to save this brand?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Save it',
            cancelButtonText: 'No, Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    name: $('#brandName').val(),
                    slug: $('#slug').val(),
                    description: $('#description').val()
                };

                ajaxHelper.post('/api/v1/admin/brands', data,
                    function (response) {
                        Swal.fire({
                            title: 'Saved!',
                            text: 'Brand added successfully.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            window.location.href = `/brands?success=Brand added successfully.`;
                        });
                    },
                    function (err) {
                        console.error('Add Brand Failed:', err);
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to add brand. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'Close'
                        });
                    }
                );
            }
        });
    });
});
