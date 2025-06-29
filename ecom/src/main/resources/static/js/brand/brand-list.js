$(document).ready(function () {
    ajaxHelper.get("/api/v1/admin/brands", function (brands) {
        const tbody = $("table tbody");
        tbody.empty();

        brands.forEach(function (brand) {
            const row = `
          <tr class="border-b border-gray-200 hover:bg-gray-50">
            <td class="py-3 px-4 border-r border-gray-200">
              <div class="inline-flex items-center">
              <label class="flex items-center cursor-pointer relative">
                <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" id="check7" />
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
              <button id="edit-brand" class="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition duration-200" data-id="${brand.brandId}">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button id="delete-brand" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-200" data-id="${brand.brandId}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        `;
            tbody.append(row);
        });
    });


    $(document).on('click', '#edit-brand', function (e) {
        const brandId = $(this).data('id');
        console.log(brandId);
    })

    $(document).on('click', '#delete-brand', function (e) {
        const brandId = $(this).data('id');
        console.log(brandId);
    })
});