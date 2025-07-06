$(document).ready(function () {

    $('#baseImageInput').on('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Create image preview element
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = "Selected Image";
        img.style.maxWidth = "100%";
        img.style.maxHeight = "200px";
        img.style.borderRadius = "15px";

        // Clear existing preview and placeholder
        $('#imagePreview').empty();
        $('#imagePreview').append(img);
    });


    // Fetch brands
    ajaxHelper.get("/api/v1/admin/brands", function (brands) {
        const brandSelect = $("#brandName");
        brandSelect.empty().append(`<option value="">Select Brand</option>`);

        brands.forEach(function (brand) {
            brandSelect.append(`<option value="${brand.name}">${brand.name}</option>`);
        });
    });

    // Fetch categories
    ajaxHelper.get("/api/v1/admin/category", function (categories) {
        const categorySelect = $("#categoryName");
        categorySelect.empty().append(`<option value="">Select Category</option>`);

        categories.forEach(function (cat) {
            categorySelect.append(`<option value="${cat.name}">${cat.name}</option>`);
        });
    });


    $('#createProductBtn').click(function (e) {
        e.preventDefault();

        // Gather product data
        const productData = {
            productName: $('#productName').val(),
            brandName: $('#brandName').val(),
            description: $('#description').val(),
            categoryNames: [$('#categoryName').val()]
        };

        ajaxHelper.post('/api/v1/admin/product', productData, function (createdProduct) {
            const productId = createdProduct.productId;
            const file = document.getElementById('baseImageInput').files[0];

            if (!file) {
                // No image selected, just show success Swal and redirect
                Swal.fire({
                    icon: 'success',
                    title: 'Product Created',
                    text: 'Your product was successfully created!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = "/product?success=Product created successfully";
                });
                return;
            }

            const reader = new FileReader();
            reader.onload = function () {
                const base64Img = reader.result;

                const imageDTO = {
                    altText: "Base image",
                    displayOrder: 1,
                    imageBase64: base64Img
                };

                const imagePayload = {
                    productId: productId,
                    images: [imageDTO]
                };

                ajaxHelper.post('/api/images', imagePayload, function () {
                    Swal.fire({
                        icon: 'success',
                        title: 'Product & Image Uploaded',
                        text: 'Product and base image uploaded successfully!',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = "/product?success=Product and image uploaded successfully";
                    });
                }, function (err) {
                    console.error("Image upload failed:", err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Image Upload Failed',
                        text: 'Product created but image upload failed.'
                    });
                });
            };
            reader.readAsDataURL(file);

        }, function (err) {
            console.error("Product creation failed:", err);
            Swal.fire({
                icon: 'error',
                title: 'Creation Failed',
                text: 'Something went wrong while creating the product.'
            });
        });
    });




    function uploadImages(productId) {
        const imageFiles = document.querySelector('#imageInput').files;

        const readerPromises = Array.from(imageFiles).map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = e => resolve({ imageData: e.target.result.split(',')[1] }); // remove data:image/jpeg;base64,
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readerPromises).then(images => {
            const payload = {
                productId: productId,
                images: images
            };

            ajaxHelper.post('/api/images', payload, function (res) {
                console.log('Images uploaded:', res);
                alert('Product created successfully with images!');
            });
        });
    }



});
