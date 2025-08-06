$(document).ready(function () {
    let allCategories = []; // This will store the original, unfiltered data
    let currentSearchTerm = '';
    let currentSortBy = 'Title'; // Default sort option

    let rowsPerPage = 5;
    let currentPage = 1;
    let totalPages = 1;

    // --- Function to Render Table Rows (Paginated) ---
    // This is the correct and only renderTable function
    function renderTable(brandsToRender) {
        const tbody = $("table tbody");
        tbody.empty(); // Clear existing rows

        totalPages = Math.ceil(brandsToRender.length / rowsPerPage);
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedBrands = brandsToRender.slice(start, end); // Apply pagination here

        if (paginatedBrands.length === 0) {
            tbody.append('<tr><td colspan="5" class="py-3 px-4 text-center text-gray-500">No Category found.</td></tr>');
            renderPagination(); // Still render pagination even if no results, to show "0 of 0" or similar if desired
            return;
        }

        paginatedBrands.forEach(function (category) {
            const row = `
                <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-4 border-r border-gray-200">
                        <div class="inline-flex items-center">
                            <label class="flex items-center cursor-pointer relative">
                                <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" id="check-${category.categoryId}" />
                                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                </span>
                            </label>
                        </div>
                    </td>
                    <td class="py-3 px-4 border-r border-gray-200">${category.name}</td>
                    <td class="py-3 px-4 border-r border-gray-200">${category.slug}</td>
                    <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">${category.description}</td>
                    <td class="py-3 px-4 text-center space-x-2">
                        <button class="edit-category text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition duration-200"
                            data-id="${category.categoryId}" data-name="${category.name}" data-slug="${category.slug}" data-description="${category.description}">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button id="delete-category" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-200"
                            data-id="${category.categoryId}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });

        renderPagination(); // Call renderPagination after table content is rendered
    }

    // --- Pagination Renderer ---
    function renderPagination() {
        const container = $("#pagination");
        container.empty();

        if (totalPages <= 1) {
            return; // No pagination needed
        }

        const appendPageButton = (page, isActive) => {
            const activeClass = isActive ? 'bg-indigo-600 text-white font-semibold shadow-md' : 'hover:bg-gray-200';
            container.append(`
                <button class="pagination-btn px-3 py-1 rounded-lg transition duration-200 ${activeClass}" data-page="${page}">${page}</button>
            `);
        };

        const appendEllipsis = () => {
            container.append(`<span class="px-3 py-1 text-gray-500">...</span>`);
        };

        // Previous button
        const prevDisabled = currentPage === 1 ? 'opacity-50 cursor-not-allowed' : '';
        container.append(`
            <button class="prev-btn p-2 rounded-lg hover:bg-gray-200 transition duration-200 ${prevDisabled}">
                <i class="fas fa-chevron-left text-sm"></i>
            </button>
        `);

        // Use a Set to store unique page numbers to be displayed
        const pageNumbersToDisplay = new Set();

        // Always add the first page
        pageNumbersToDisplay.add(1);

        // Add pages around the current page
        // For example, if currentPage is 5, add 4, 5, 6
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < totalPages) { // Ensure it's not 1 or totalPages
                pageNumbersToDisplay.add(i);
            }
        }

        // Always add the last page if there's more than one page
        if (totalPages > 1) {
            pageNumbersToDisplay.add(totalPages);
        }

        // Convert Set to Array and sort numerically
        const sortedPageNumbers = Array.from(pageNumbersToDisplay).sort((a, b) => a - b);

        // Render page buttons and ellipses
        let lastRenderedPage = 0;
        sortedPageNumbers.forEach(page => {
            // If there's a gap between the last rendered page and the current page to render, add ellipsis
            if (page > lastRenderedPage + 1) {
                appendEllipsis();
            }
            appendPageButton(page, page === currentPage);
            lastRenderedPage = page;
        });

        // Next button
        const nextDisabled = currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : '';
        container.append(`
            <button class="next-btn p-2 rounded-lg hover:bg-gray-200 transition duration-200 ${nextDisabled}">
                <i class="fas fa-chevron-right text-sm"></i>
            </button>
        `);
    }

    // --- Filtering + Sorting + Rendering ---
    // Added 'resetPage' parameter with a default of true
    function applySortAndSearch(resetPage = true) {
        let filteredBrands = allCategories.slice();

        if (currentSearchTerm) {
            const term = currentSearchTerm.toLowerCase();
            filteredBrands = filteredBrands.filter(brand =>
                brand.name.toLowerCase().includes(term) ||
                brand.slug.toLowerCase().includes(term) ||
                brand.description.toLowerCase().includes(term)
            );
        }

        filteredBrands.sort((a, b) => {
            let valA = '', valB = '';
            switch (currentSortBy) {
                case 'Title':
                case 'Brand Name':
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
                    break;
                case 'Slug':
                    valA = a.slug.toLowerCase();
                    valB = b.slug.toLowerCase();
                    break;
                case 'Description':
                    valA = a.description.toLowerCase();
                    valB = b.description.toLowerCase();
                    break;
                default:
                    // Fallback for unexpected sort values
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
                    break;
            }

            return valA.localeCompare(valB);
        });

        // Only reset to first page if 'resetPage' is true (e.g., on search/sort change)
        if (resetPage) {
            currentPage = 1;
        }
        renderTable(filteredBrands); // Pass the fully filtered and sorted array
    }


    // --- Initial Data Fetch ---
    // Ensure ajaxHelper is defined and available in your context
    // This is a placeholder for your actual data fetching mechanism
    // For demonstration, I'm mocking some data if ajaxHelper is not present
    if (typeof ajaxHelper === 'undefined') {
        console.warn("ajaxHelper is not defined. Using mock data for demonstration.");
        allCategories = [
            { categoryId: 'b1', name: 'Category A', slug: 'category-a', description: 'Description for category A' },
            { categoryId: 'b2', name: 'Category B', slug: 'category-b', description: 'Description for category B' },
            { categoryId: 'b3', name: 'Category C', slug: 'category-c', description: 'Description for category C' },
            { categoryId: 'b4', name: 'Category D', slug: 'category-d', description: 'Description for category D' },
            { categoryId: 'b5', name: 'Category E', slug: 'category-e', description: 'Description for category E' },
            { categoryId: 'b6', name: 'Category F', slug: 'category-f', description: 'Description for category F' },
            { categoryId: 'b7', name: 'Category G', slug: 'category-g', description: 'Description for category G' },
            { categoryId: 'b8', name: 'Category H', slug: 'category-h', description: 'Description for category H' },
            { categoryId: 'b9', name: 'Category I', slug: 'category-i', description: 'Description for category I' },
            { categoryId: 'b10', name: 'Category J', slug: 'category-j', description: 'Description for category J' },
            { categoryId: 'b11', name: 'Category K', slug: 'category-k', description: 'Description for category K' },
            { categoryId: 'b12', name: 'Category L', slug: 'category-l', description: 'Description for category L' },
            { categoryId: 'b13', name: 'Category M', slug: 'category-m', description: 'Description for category M' },
            { categoryId: 'b14', name: 'Category N', slug: 'category-n', description: 'Description for category N' },
            { categoryId: 'b15', name: 'Category O', slug: 'category-o', description: 'Description for category O' },

        ];
        applySortAndSearch(); // Render the table with initial sort/search (defaults to resetPage = true)
    } else {
        ajaxHelper.get("/api/v1/admin/category", function (brands) {
            allCategories = brands; // Store the fetched data
            applySortAndSearch(); // Render the table with initial sort/search (defaults to resetPage = true)
        });
    }

    // --- Event Listeners for Sort and Search ---

    // Sort Dropdown Change
    $('#sort-table').on('change', function () {
        currentSortBy = $(this).val();
        applySortAndSearch(true); // Reset page on sort change
    });

    // Search Bar Input (using 'input' event for real-time filtering)
    $('#search').on('input', function () {
        currentSearchTerm = $(this).val();
        applySortAndSearch(true); // Reset page on search change
    });

    // --- Pagination Button Clicks ---
    $(document).on('click', '.pagination-btn', function () {
        currentPage = parseInt($(this).data('page'));
        applySortAndSearch(false); // Do NOT reset page on pagination click
    });

    $(document).on('click', '.prev-btn', function () {
        if (currentPage > 1) {
            currentPage--;
            applySortAndSearch(false); // Do NOT reset page on pagination click
        }
    });

    $(document).on('click', '.next-btn', function () {
        if (currentPage < totalPages) {
            currentPage++;
            applySortAndSearch(false); // Do NOT reset page on pagination click
        }
    });

    // --- Existing Event Listeners (Untouched, assuming `ajaxHelper` and overlay functions exist) ---

    // Edit Category Button Click
    let categoryData = {}; // Define categoryData in a higher scope if it's used globally
    $(document).on('click', '.edit-category', function (e) {
        const categoryId = $(this).data('id');
        const categoryName = $(this).data('name');
        const slug = $(this).data('slug');
        const description = $(this).data('description');
        categoryData = {
            categoryId: categoryId,
            name: categoryName,
            slug: slug,
            description: description
        }
        console.log(categoryData);
        openOverlay(categoryData)
    });

    // Delete category Button Click
    $(document).on('click', '#delete-category', function (e) {
        e.preventDefault();

        const categoryId = $(this).data('id');

        // Replace native confirm with a custom modal if possible in your UI
        if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            return;
        }

        const dataToSend = {
            categoryId: categoryId
        };

        if (typeof ajaxHelper !== 'undefined') {
            ajaxHelper.post('/api/v1/admin/delete-category', dataToSend,
                function (response) {
                    console.log('Delete successful:', response);
                    // Re-fetch and re-render data
                    ajaxHelper.get("/api/v1/admin/category", function (categories) {
                        allCategories = categories;
                        applySortAndSearch(true); // Reset page after delete, as data has changed
                    });
                    // Consider removing this if you want to avoid a full page reload
                    // window.location.href = `/brands?success=${response}`;
                },
                function (err) {
                    console.error('Delete category Failed:', err);
                    const errorMessage = err.responseJSON ? err.responseJSON.message : (err.responseText || 'Unknown error occurred.');
                    alert('Failed to delete category: ' + errorMessage); // Replace it with a custom modal
                }
            );
        } else {
            console.warn("ajaxHelper is not defined. Delete operation skipped.");
            // Simulate deletion for mock data
            allCategories = allCategories.filter(categories => categories.categoryId !== categories);
            applySortAndSearch(true); // Reset page for mock data as well
        }
        console.log('Attempting to delete brand with ID:', categoryId);
    });

    // Assuming these overlay functions and elements exist in your HTML
    const $closeBtn = $('#cancelButton');
    const $overlay = $('#myOverlay');
    const $overlayContentWrapper = $overlay.find('.overlay-content-wrapper');

    function openOverlay(categoryData) {
        $overlay.removeClass('invisible opacity-0');
        $overlay.addClass('visible opacity-100');

        $('#brandName').val(categoryData.name);
        $('#slug').val(categoryData.slug);
        $('#description').val(categoryData.description);

        $overlayContentWrapper.removeClass('-translate-y-full');
        $overlayContentWrapper.addClass('translate-y-0');

        $('body').css('overflow', 'hidden');
    }

    function closeOverlay() {
        $overlayContentWrapper.addClass('-translate-y-full');
        $overlayContentWrapper.removeClass('translate-y-0');

        setTimeout(() => {
            $overlay.addClass('invisible opacity-0');
            $overlay.removeClass('visible opacity-100');
            $('body').css('overflow', '');
        }, 500);
    }

    $closeBtn.on('click', closeOverlay);

    $overlay.on('click', function(e) {
        if (e.target === this) {
            closeOverlay();
        }
    });

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && !$overlay.hasClass('invisible')) {
            closeOverlay();
        }
    });

    $('#updateCategoryForm').on('submit', function(e) {
        e.preventDefault();

        const data = {
            categoryId: categoryData.categoryId,
            name: $('#categoryName').val(),
            slug: $('#slug').val(),
            description: $('#description').val()
        };

        Swal.fire({
            title: 'Update Category?',
            text: 'Do you want to save these changes?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (!result.isConfirmed) return;

            if (typeof ajaxHelper !== 'undefined') {
                ajaxHelper.put('/api/v1/admin/category', data, function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated',
                        text: 'Category updated successfully!',
                        confirmButtonText: 'OK'
                    });

                    // Re-fetch & re-render the updated list
                    ajaxHelper.get("/api/v1/admin/category", function (brands) {
                        allCategories = brands;
                        applySortAndSearch(true); // Reset page
                    });

                }, function (err) {
                    console.error('Update category Failed:', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Update Failed',
                        text: 'Something went wrong while updating category.'
                    });
                });
            } else {
                console.warn("ajaxHelper is not defined. Update operation skipped.");

                // Simulated local update
                allCategories = allCategories.map(category =>
                    category.categoryId === data.categoryId ? { ...category, ...data } : category
                );
                applySortAndSearch(true);
            }

            closeOverlay(); // Close modal/form
        });
    });

});
