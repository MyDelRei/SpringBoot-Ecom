$(document).ready(function () {
    let allProducts = [];
    let filteredProducts = [];
    let currentCategory = '';
    let currentSearchTerm = '';
    let rowsPerPage = 5;
    let currentPage = 1;
    let totalPages = 1;


    const tableBody = $("table tbody");
    const paginationDiv = $('#pagination');
    const categoryFilter = $("#categoryFilter");
    const searchInput = $("#searchInput");

    // Load all products
    ajaxHelper.get("/api/v1/admin/product", function (products) {
        allProducts = products;
        console.log(allProducts)
        applyFilters();
    });

    // Load categories for filter dropdown
    ajaxHelper.get("/api/v1/admin/category", function (categories) {
        categoryFilter.empty().append(`<option value="">All Categories</option>`);
        categories.forEach(cat => {
            categoryFilter.append(`<option value="${cat.name}">${cat.name}</option>`);
        });
    });

    // === EVENT LISTENERS ===
    categoryFilter.on("change", function () {
        currentCategory = $(this).val();
        applyFilters();
    });

    searchInput.on("input", function () {
        currentSearchTerm = $(this).val().toLowerCase();
        applyFilters();
    });

    // === FILTERING FUNCTION ===
    function applyFilters() {
        filteredProducts = allProducts.filter(p => {
            const categories = (p.categoryNames || [p.categoryName || '']).join(', ').toLowerCase();
            const matchesCategory = !currentCategory || categories.includes(currentCategory.toLowerCase());

            const matchesSearch = !currentSearchTerm ||
                p.productName?.toLowerCase().includes(currentSearchTerm) ||
                p.description?.toLowerCase().includes(currentSearchTerm);

            return matchesCategory && matchesSearch;
        });

        totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
        currentPage = 1;
        renderPage();
    }

    // === PAGINATION + TABLE RENDERING ===
    function renderPage() {
        tableBody.empty();
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = filteredProducts.slice(start, end);

        pageData.forEach(product => {
            const categories = product.categoryNames?.join(', ') || product.categoryName || 'N/A';
            const rowHtml = `
                <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-4 border-r border-gray-200">
                        <input type="checkbox" class="h-5 w-5 border border-slate-300 rounded checked:bg-purple-600 checked:border-purple-600">
                    </td>
                    <td class="py-3 px-4 border-r border-gray-200">${product.productName}</td>
                    <td class="py-3 px-4 border-r border-gray-200">${product.brandName || 'N/A'}</td>
                    <td class="py-3 px-4 border-r border-gray-200">${categories}</td>
                    <td class="py-3 px-4 border-r border-gray-200">${product.description || ''}</td>
                    <td class="py-3 px-4 text-center space-x-2">
                        <button class="edit-product-btn text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition duration-200" data-id="${product.productId}">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="delete-product-btn text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-200" data-id="${product.productId}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.append(rowHtml);
        });

        renderPagination();
    }

    function renderPagination() {
        paginationDiv.empty();

        if (totalPages <= 1) return;

        const prevDisabled = currentPage === 1 ? 'opacity-50 cursor-not-allowed' : '';
        const nextDisabled = currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : '';

        paginationDiv.append(`<button class="p-2 rounded-lg hover:bg-gray-200 ${prevDisabled}" ${prevDisabled ? '' : `onclick="changePage(${currentPage - 1})"`}><i class="fas fa-chevron-left text-sm"></i></button>`);

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-gray-200';
            paginationDiv.append(`<button class="px-3 py-1 rounded-lg ${activeClass}" onclick="changePage(${i})">${i}</button>`);
        }

        paginationDiv.append(`<button class="p-2 rounded-lg hover:bg-gray-200 ${nextDisabled}" ${nextDisabled ? '' : `onclick="changePage(${currentPage + 1})"`}><i class="fas fa-chevron-right text-sm"></i></button>`);
    }

    // Allow page change globally
    window.changePage = function (page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderPage();
    };



    function openOverlay() {
        const overlay = $('#updateProductOverlay');
        const content = $('#overlayContent');

        overlay.removeClass('hidden');
        setTimeout(() => {
            content.removeClass('-translate-y-10 opacity-0');
        }, 10);
    }

    function closeOverlay() {
        const overlay = $('#updateProductOverlay');
        const content = $('#overlayContent');

        content.addClass('-translate-y-10 opacity-0');
        setTimeout(() => {
            overlay.addClass('hidden');
        }, 300);
    }


    $(document).on('click', '.edit-product-btn', function () {
        const productId = $(this).data('id');
        openOverlay();
        loadBrandsAndCategories();

        // Get the product data from allProducts[]
        const product = allProducts.find(p => p.productId === productId);
        if (!product) return;

        $('#productId').val(product.productId);
        $('#productName').val(product.productName);
        $('#slug').val(product.slug);
        $('#description').val(product.description || '');
        $('#basePrice').val(product.basePrice || '');

        // Set brand/category if values already loaded
        setTimeout(() => {
            $('#brandName').val(product.brandId);
            $('#categoryName').val(product.categoryId);
        }, 300);

        const imagePreviewIds = [
            '#baseImagePreview',
            '#secondImagePreview',
            '#thirdImagePreview',
            '#fourthImagePreview'
        ];

        // Clear previous images first
        imagePreviewIds.forEach(id => {
            $(id).attr('src', '').addClass('hidden');
        });

        if (product.images && product.images.length > 0) {
            // Sort images by displayOrder ascending
            const sortedImages = product.images.slice().sort((a, b) => a.displayOrder - b.displayOrder);

            // Loop through sorted images and set src for each preview image slot
            sortedImages.forEach((img, index) => {
                if (index < imagePreviewIds.length) {
                    $(imagePreviewIds[index])
                        .attr('src', 'data:image/png;base64,' + img.imageBase64)
                        .removeClass('hidden')
                        .attr('alt', img.altText || `Image ${index + 1}`);
                }
            });
        }
    });




// Close on cancel button
    $('#updateProductOverlay').on('click', '.bg-gray-700', function () {
        closeOverlay();
    });

// Close on outside click
    $('#updateProductOverlay').on('click', function (e) {
        if (e.target === this) {
            closeOverlay();
        }
    });

    function setupImagePreview(inputId, previewId) {
        $('#' + inputId).on('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    $('#' + previewId).attr('src', e.target.result).removeClass('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }

// Setup for all 4 image previews
    setupImagePreview('baseImage', 'baseImagePreview');
    setupImagePreview('secondImage', 'secondImagePreview');
    setupImagePreview('thirdImage', 'thirdImagePreview');
    setupImagePreview('fourthImage', 'fourthImagePreview');


    function loadBrandsAndCategories() {
        ajaxHelper.get("/api/v1/admin/brands", function (brands) {
            console.log(brands);
            let brandSelect = $('#brandName');
            brandSelect.empty().append('<option value="">Choose brand</option>');
            brands.forEach(b => {
                brandSelect.append(`<option value="${b.brandId}">${b.name}</option>`);
            });
        });

        ajaxHelper.get("/api/v1/admin/category", function (categories) {
            console.log(categories);
            let catSelect = $('#categoryName');
            catSelect.empty().append('<option value="">Choose category</option>');
            categories.forEach(c => {
                catSelect.append(`<option value="${c.categoryId}">${c.name}</option>`);
            });
        });
    }

    $(document).on("click", ".delete-product-btn", function () {
        const productId = $(this).data("id");

        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6a5acd', // your indigo color
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                ajaxHelper.post("/api/v1/admin/product/delete", { productId }, function () {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Product has been deleted.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        // redirect with successMessage query param (encode for safety)
                        const msg = encodeURIComponent('Product deleted successfully!');
                        window.location.href = `http://localhost:8081/product?success=${msg}`;
                    });
                }, function (err) {
                    Swal.fire('Failed!', err.responseText || 'Delete failed.', 'error');
                });
            }
        });
    });


    $("#updateProductForm").on("submit", function (e) {
        e.preventDefault();

        const productId = parseInt($("#productId").val());
        if (!productId) {
            console.log("No product ID");
            return;
        }

        // Collect product data
        const productPayload = {
            productId,
            productName: $("#productName").val(),
            description: $("#description").val(),
            brand: {
                brandId: parseInt($("#brandName").val())
            },
            productCategories: [
                {
                    category: {
                        categoryId: parseInt($("#categoryName").val())
                    }
                }
            ]
        };

        // Image inputs config
        const imageInputs = [
            { input: '#baseImage', displayOrder: 1 },
            { input: '#secondImage', displayOrder: 2 },
            { input: '#thirdImage', displayOrder: 3 },
            { input: '#fourthImage', displayOrder: 4 }
        ];

        const filesToSend = [];
        const product = allProducts.find(p => p.productId === productId);
        const existingImages = product?.images || [];

        let processedCount = 0; // count all inputs processed

        function trySubmit() {
            if (processedCount === imageInputs.length) {
                submitUpdate(productPayload, productId, filesToSend);
            }
        }

        imageInputs.forEach(({ input, displayOrder }) => {
            const fileInput = $(input)[0];
            const file = fileInput.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const base64String = e.target.result.split(',')[1];
                    filesToSend.push({
                        imageId: existingImages.find(img => img.displayOrder === displayOrder)?.imageId || null,
                        imageBase64: base64String,
                        displayOrder,
                        altText: `Image ${displayOrder}`
                    });
                    processedCount++;
                    trySubmit();
                };
                reader.readAsDataURL(file);
            } else {
                // Use existing image if no file selected
                const existing = existingImages.find(img => img.displayOrder === displayOrder);
                if (existing) {
                    filesToSend.push({
                        imageId: existing.imageId,
                        imageBase64: existing.imageBase64,
                        displayOrder,
                        altText: existing.altText
                    });
                }
                processedCount++;
                trySubmit();
            }
        });
    });


    function submitUpdate(productPayload, productId, imagePayload) {
        ajaxHelper.put("/api/v1/admin/product", productPayload, function () {
            // Now update images
            ajaxHelper.put("/api/images", {
                productId,
                images: imagePayload
            }, function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Product updated successfully!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    const msg = encodeURIComponent("Product updated successfully!");
                    window.location.href = `/product?success=${msg}`;
                });
            }, function (err) {
                Swal.fire('Image Update Failed', err.responseText || 'Error while updating images.', 'error');
            });
        }, function (err) {
            Swal.fire('Update Failed', err.responseText || 'Error while updating product.', 'error');
        });
    }









});
