$(document).ready(function () {
    const $form = $('#addAttributeForm');
    const $attributeNameInput = $('#attributeName');

    // Handle form submission
    $form.on('submit', function (e) {
        e.preventDefault();

        const attributeName = $attributeNameInput.val().trim();

        // --- Client-Side Validation ---
        if (!attributeName) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Attribute name is required.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return; // Stop the submission
        }

        // --- Confirmation Dialog ---
        Swal.fire({
            title: 'Create Attribute?',
            text: 'Do you want to save this new attribute?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Save it',
            cancelButtonText: 'No, Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // If user confirms, gather data and proceed with AJAX
                const unitOfMeasure = $('#unitOfMeasure').val().trim();
                const description = $('#description').val().trim();

                const attributeData = {
                    attributeName: attributeName,
                    // CORRECTED: Changed to camelCase to match the Java entity
                    unitOfMeasure: unitOfMeasure || null,
                    description: description || null
                };

                // --- AJAX Call ---
                ajaxHelper.post('/api/v1/admin/attributes', attributeData,
                    function (response) {
                        Swal.fire({
                            title: 'Saved!',
                            text: 'Attribute has been added successfully.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            // Redirect to the attributes list page on success
                            window.location.href = '/attributes?success=Successfully added new attribute';
                        });
                    },
                    function (error) {
                        console.error('Add Attribute Failed:', error);
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to add the attribute. Please check the data and try again.',
                            icon: 'error',
                            confirmButtonText: 'Close'
                        });
                    }
                );
            }
        });
    });

    // Handle Cancel button click
    $('#cancelButton').on('click', function () {
        // Redirect back to the attribute list page
        window.location.href = '/attributes';
    });
});