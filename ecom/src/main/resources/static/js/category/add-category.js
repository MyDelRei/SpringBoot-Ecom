$(document).ready(function() {
    $('#categoryName').on('input', function () {
        const categoryName = $(this).val(); // Get the current value of the brand name input

        // Generate slug:
        // 1. Convert to lowercase
        // 2. Replace non-alphanumeric characters (except hyphens) with a space
        // 3. Replace spaces with a single hyphen
        // 4. Trim leading/trailing hyphens
        const slug = categoryName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters but keep spaces and hyphens
            .replace(/\s+/g, '-')      // Replace spaces with a single hyphen
            .replace(/^-+|-+$/g, '');   // Trim hyphens from start/end

        // Set the generated slug to the 'Slug' input field
        $('#slug').val(slug);
    });


    $('#addCategoryForm').on('submit', function (e) {
        e.preventDefault();

        const data = {
            name: $('#categoryName').val(),
            slug: $('#slug').val(),
            description: $('#description').val()
        };

        ajaxHelper.post('/api/v1/admin/category', data, function (response) {

            window.location.href = `/category?success=${response}`;
        }, function (err) {
            console.error('Add Category Failed:', err);
            alert('Failed to add category.');
        });
    });
});