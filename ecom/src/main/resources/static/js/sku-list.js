$(document).ready(function () {
    let allBrands = []; // This will store the original, unfiltered data
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
            tbody.append('<tr><td colspan="5" class="py-3 px-4 text-center text-gray-500">No brands found.</td></tr>');
            renderPagination(); // Still render pagination even if no results, to show "0 of 0" or similar if desired
            return;
        }

        paginatedBrands.forEach(function (brand) {
            const row = `
                <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-4 border-r border-gray-200">
                        <div class="inline-flex items-center">
                            <label class="flex items-center cursor-pointer relative">
                                <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" id="check-${brand.brandId}" />
                                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                </span>
                            </label>
                        </div>
                    </td>
                    <td class="py-3 px-4 border-r border-gray-200">${brand.name}</td>
                    <td class="py-3 px-4 border-r border-gray-200">${brand.slug}</td>
                    <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">${brand.description}</td>
                    <td class="py-3 px-4 text-center space-x-2">
                        <button id="edit-brand" class="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition duration-200"
                            data-id="${brand.brandId}" data-name="${brand.name}" data-slug="${brand.slug}" data-description="${brand.description}">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button id="delete-brand" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-200"
                            data-id="${brand.brandId}">
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
        let filteredBrands = allBrands.slice();

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
        allBrands = [
            { brandId: 'b1', name: 'Brand A', slug: 'brand-a', description: 'Description for brand A' },
            { brandId: 'b2', name: 'Brand B', slug: 'brand-b', description: 'Description for brand B' },
            { brandId: 'b3', name: 'Brand C', slug: 'brand-c', description: 'Description for brand C' },
            { brandId: 'b4', name: 'Brand D', slug: 'brand-d', description: 'Description for brand D' },
            { brandId: 'b5', name: 'Brand E', slug: 'brand-e', description: 'Description for brand E' },
            { brandId: 'b6', name: 'Brand F', slug: 'brand-f', description: 'Description for brand F' },
            { brandId: 'b7', name: 'Brand G', slug: 'brand-g', description: 'Description for brand G' },
            { brandId: 'b8', name: 'Brand H', slug: 'brand-h', description: 'Description for brand H' },
            { brandId: 'b9', name: 'Brand I', slug: 'brand-i', description: 'Description for brand I' },
            { brandId: 'b10', name: 'Brand J', slug: 'brand-j', description: 'Description for brand J' },
            { brandId: 'b11', name: 'Brand K', slug: 'brand-k', description: 'Description for brand K' },
            { brandId: 'b12', name: 'Brand L', slug: 'brand-l', description: 'Description for brand L' },
            { brandId: 'b13', name: 'Brand M', slug: 'brand-m', description: 'Description for brand M' },
            { brandId: 'b14', name: 'Brand N', slug: 'brand-n', description: 'Description for brand N' },
            { brandId: 'b15', 'name': 'Brand O', slug: 'brand-o', description: 'Description for brand O' },
        ];
        applySortAndSearch(); // Render the table with initial sort/search (defaults to resetPage = true)
    } else {
        ajaxHelper.get("/api/v1/admin/brands", function (brands) {
            allBrands = brands; // Store the fetched data
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

    // Edit Brand Button Click
    let brandData = {}; // Define brandData in a higher scope if it's used globally
    $(document).on('click', '#edit-brand', function (e) {
        const brandId = $(this).data('id');
        const brandName = $(this).data('name');
        const slug = $(this).data('slug');
        const description = $(this).data('description');
        brandData = {
            brandId: brandId,
            name: brandName,
            slug: slug,
            description: description
        }
        console.log(brandData);
        openOverlay(brandData)
    });

    // Delete Brand Button Click
    $(document).on('click', '#delete-brand', function (e) {
        e.preventDefault();

        const brandId = $(this).data('id');

        // Replace native confirm with a custom modal if possible in your UI
        if (!confirm('Are you sure you want to delete this brand? This action cannot be undone.')) {
            return;
        }

        const dataToSend = {
            brandId: brandId
        };

        if (typeof ajaxHelper !== 'undefined') {
            ajaxHelper.post('/api/v1/admin/delete-brands', dataToSend,
                function (response) {
                    console.log('Delete successful:', response);
                    // Re-fetch and re-render data
                    ajaxHelper.get("/api/v1/admin/brands", function (brands) {
                        allBrands = brands;
                        applySortAndSearch(true); // Reset page after delete, as data has changed
                    });
                    // Consider removing this if you want to avoid a full page reload
                    // window.location.href = `/brands?success=${response}`;
                },
                function (err) {
                    console.error('Delete Brand Failed:', err);
                    const errorMessage = err.responseJSON ? err.responseJSON.message : (err.responseText || 'Unknown error occurred.');
                    alert('Failed to delete brand: ' + errorMessage); // Replace with custom modal
                }
            );
        } else {
            console.warn("ajaxHelper is not defined. Delete operation skipped.");
            // Simulate deletion for mock data
            allBrands = allBrands.filter(brand => brand.brandId !== brandId);
            applySortAndSearch(true); // Reset page for mock data as well
        }
        console.log('Attempting to delete brand with ID:', brandId);
    });

    // Assuming these overlay functions and elements exist in your HTML
    const $closeBtn = $('#cancelButton');
    const $overlay = $('#myOverlay');
    const $overlayContentWrapper = $overlay.find('.overlay-content-wrapper');

    function openOverlay(brandData) {
        $overlay.removeClass('invisible opacity-0');
        $overlay.addClass('visible opacity-100');

        $('#brandName').val(brandData.name);
        $('#slug').val(brandData.slug);
        $('#description').val(brandData.description);

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

    $('#UpdateBrandForm').on('submit', function(e) {
        e.preventDefault();
        const data = {
            brandId: brandData.brandId,
            name: $('#brandName').val(),
            slug: $('#slug').val(),
            description: $('#description').val()
        };
        alert('logic start'); // Replace with custom modal
        console.log(data);

        if (typeof ajaxHelper !== 'undefined') {
            ajaxHelper.put('/api/v1/admin/brands', data, function (response) {
                // Re-fetch and re-render data after a successful update
                ajaxHelper.get("/api/v1/admin/brands", function (brands) {
                    allBrands = brands;
                    applySortAndSearch(true); // Reset page after update, as data has changed
                });
                // Consider removing this if you want to avoid a full page reload
                // window.location.href = `/brands?success=${response}`;
            }, function (err) {
                console.error('Update Brand Failed:', err);
                alert('Failed to update brand.'); // Replace it with a custom modal
            });
        } else {
            console.warn("ajaxHelper is not defined. Update operation skipped.");
            // Simulate update for mock data
            allBrands = allBrands.map(brand => brand.brandId === data.brandId ? {...brand, ...data} : brand);
            applySortAndSearch(true); // Reset page for mock data as well
        }
        closeOverlay();
    });
});
