$(document).ready(function () {
    const $unitList = $('#unit-list');
    const $pagination = $('#pagination');
    const $loadingSpinner = $('#loadingSpinner');
    const pageSize = 20;
    let currentPage = 0;
    let currentSearch = '';

    // Render table rows
    function renderTable(data) {
        $unitList.empty();
        if (!data.length) {
            $unitList.append('<tr><td colspan="8" class="py-4 text-center text-gray-500">No records found.</td></tr>');
            return;
        }
        data.forEach(item => {
            $unitList.append(`
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="py-3 px-4 border-b border-r border-gray-200">
            <div class="inline-flex items-center">
              <label class="flex items-center cursor-pointer relative">
                <input type="checkbox" class="peer h-5 w-5 cursor-pointer rounded shadow border border-slate-300 checked:bg-purple-600 checked:border-purple-600" />
                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </span>
              </label>
            </div>
          </td>
          <td class="py-3 px-4 border-b border-r border-gray-200">
            <div class="flex flex-col">
              <span class="text-gray-900 font-semibold">${item.productName}</span>
              <span class="text-gray-500 text-sm">${item.brandName || ''}</span>
            </div>
          </td>
          <td class="py-3 px-4 border-b border-r border-gray-200 text-gray-700">${item.skuCode}</td>
          <td class="py-3 px-4 border-b border-r border-gray-200">
            <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">${item.isSerialized === 'Y' ? 'Y' : 'N'}</span>
          </td>
          <td class="py-3 px-4 border-b border-r border-gray-200">
            <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">${item.categoryName || ''}</span>
          </td>
          <td class="py-3 px-4 border-b border-r border-gray-200 text-gray-700">${item.locationPath || ''}</td>
          <td class="py-3 px-4 border-b border-r border-gray-200 text-gray-700">${item.quantity || 0}</td>
          <td class="py-3 px-4 text-center border-b border-gray-200">
            <a href="#" class="text-indigo-600 hover:text-indigo-900 font-medium">
              <i class="fas fa-pencil-alt"></i>
            </a>
          </td>
        </tr>
      `);
        });
    }

    // Render pagination buttons
    function renderPagination(meta) {
        $pagination.empty();
        const totalPages = meta.totalPages || 1;
        if (totalPages <= 1) return;

        for (let i = 0; i < totalPages; i++) {
            const isActive = i === meta.pageNumber;
            $pagination.append(`
        <button class="px-3 py-1 rounded ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-200'}" data-page="${i}">
          ${i + 1}
        </button>
      `);
        }
    }

    // Fetch data from API
    function fetchData(page = 0, search = '') {
        currentPage = page;
        currentSearch = search;
        $loadingSpinner.removeClass('hidden');

        $.ajax({
            url: '/api/inventory/view-stock',
            method: 'GET',
            data: {
                searchTerm: search,
                page: page,
                size: pageSize
            },
            success: function (response) {
                console.log('API Response:', response);
                renderTable(response.content);
                renderPagination(response.pageable);
                $loadingSpinner.addClass('hidden');
            },
            error: function () {
                $unitList.html('<tr><td colspan="8" class="text-center text-red-600">Failed to load data</td></tr>');
                $loadingSpinner.addClass('hidden');
            }
        });
    }

    // Pagination click handler
    $pagination.on('click', 'button', function () {
        const page = Number($(this).data('page'));
        fetchData(page, currentSearch);
    });

    // Search input with debounce
    let searchTimeout;
    $('#search').on('input', function () {
        clearTimeout(searchTimeout);
        const val = $(this).val();
        searchTimeout = setTimeout(() => {
            fetchData(0, val);
        }, 500);
    });

    // Select All checkbox
    $('#checkAll').on('change', function () {
        const checked = $(this).prop('checked');
        $unitList.find('input[type=checkbox]').prop('checked', checked);
    });

    // Initial fetch
    fetchData();
});
