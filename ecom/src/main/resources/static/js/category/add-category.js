$(document).ready(function() {
    $('#categoryName').on('input', function () {
        const categoryName = $(this).val();

        const slug = categoryName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')         // Replace spaces with hyphens
            .replace(/^-+|-+$/g, '');     // Trim hyphens

        $('#slug').val(slug);
    });

    $('#addCategoryForm').on('submit', function (e) {
        e.preventDefault();

        Swal.fire({
            title: 'Add new category?',
            text: 'Do you want to create this category?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (!result.isConfirmed) return;

            const data = {
                name: $('#categoryName').val(),
                slug: $('#slug').val(),
                description: $('#description').val()
            };

            ajaxHelper.post('/api/v1/admin/category', data, function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Category Created',
                    text: 'Your category has been added!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = `/category?success=${response}`;
                });
            }, function (err) {
                console.error('Add Category Failed:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add Category',
                    text: 'Something went wrong. Please try again.'
                });
            });
        });
    });
});
