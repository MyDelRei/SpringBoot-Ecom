$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const supplierName = urlParams.get("supplierName");
    const supplierId = urlParams.get("supplierId");
    let selectedSkuData = null;

    if (supplierName && supplierId) {
        $('#supplier').val(`${supplierName}`);

        // Optional: store supplierId in a hidden input
        if ($('#supplierId').length === 0) {
            $('<input>').attr({
                type: 'hidden',
                id: 'supplierId',
                name: 'supplierId',
                value: supplierId
            }).appendTo('form');
        } else {
            $('#supplierId').val(supplierId);
        }
    }
    ajaxHelper.get("/api/v1/admin/sku/dto", function (data) {
        console.log(data);
        renderSkuTable(data);
    });

    function renderSkuTable(skuList) {
        const tbody = $("#productTableBody");
        tbody.empty(); // Clear existing rows

        if (skuList.length === 0) {
            tbody.append(`<tr><td colspan="4" class="text-center">No data found</td></tr>`);
            return;
        }

        skuList.forEach(data => {
            const row = `
                <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-4 border-r border-gray-200">
                        <label class="flex items-center cursor-pointer relative">
                            <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" />
                            <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                            </span>
                        </label>
                    </td>
                    <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">${data.productName}</td>
                    <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">${data.skuCode}</td>
                    <td class="py-3 px-4 border-r border-gray-200 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis">
                        <button type="button" class="show-more-btn h-[32px] px-3 py-1 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors" data-id="${data.skuCode}">Show more</button>
                    </td>
                    <td class="py-3 px-4 text-center space-x-2">
                         <button type="button" class="add-btn h-[32px] px-3 py-1 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors" data-cost-price="${data.basePrice}" data-sku="${data.skuId}" data-sku-code="${data.skuCode}" data-product-name="${data.productName}">+ Add</button>
                       
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    $(document).on('click', '.add-btn', function () {
        const productName = $(this).data('product-name');
        const skuCode = $(this).data('sku-code');
        const skuId = $(this).data('sku');
        const costPrice = $(this).data('cost-price');


        selectedSkuData = {
            skuCode,
            productName,
            skuId,
            costPrice
        };
        console.log(selectedSkuData);

        $('#CostPrice').val(selectedSkuData.costPrice);



        $('#overlayNoProducts')
            .removeClass('invisible opacity-0')
            .addClass('visible opacity-100');

        $('.overlay-content-wrapper')
            .removeClass('-translate-y-full')
            .addClass('translate-y-0');
    });

    // CLOSE the overlay
    $('#closeNoProducts').on('click', function () {
        $('#overlayNoProducts')
            .removeClass('visible opacity-100')
            .addClass('invisible opacity-0');

        $('.overlay-content-wrapper')
            .removeClass('translate-y-0')
            .addClass('-translate-y-full');
    });

    $('#AddProducts').on('click', function () {
        if (!selectedSkuData) return;


        $('#CostPrice').val(selectedSkuData.costPrice);


        const leadDay = $('#leadDay').val();
        const costPrice = $('#CostPrice').val();
        const status = $('#Status').val();

        if (!leadDay || !costPrice) {
            alert('Please fill in all fields');
            return;
        }

        let statusBadge = '';
        if (status === 'Available') {
            statusBadge = '<span class="inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Available</span>';
        } else if (status === 'Unavailable') {
            statusBadge = '<span class="inline-block px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Unavailable</span>';
        }


        const newRow = `
        <tr data-sku-id="${selectedSkuData.skuId}" class="border-b border-gray-200 hover:bg-gray-50">
            <td class="py-3 px-4 border-r border-gray-200">
                <label class="flex items-center cursor-pointer relative">
                    <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-purple-600 checked:border-purple-600" />
                    <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                    </span>
                </label>
            </td>
            <td class="py-3 px-4 border-r border-gray-200">${selectedSkuData.productName}</td>
            <td class="py-3 px-4 border-r border-gray-200">${selectedSkuData.skuCode}</td>
            <td class="py-3 px-4 border-r border-gray-200">
                ${statusBadge}
            </td>

            <td class="py-3 px-4 border-r border-gray-200">${leadDay}</td>
            <td class="py-3 px-4 border-r border-gray-200">${costPrice}</td>
            <td class="py-3 px-4 text-center">
                <button type="button" class="text-red-500 hover:text-red-700 font-semibold remove-btn">Remove</button>
            </td>
        </tr>
    `;

        $('#supplierProductTableBody').append(newRow);

        // Optional: reset the form
        $('#leadDay').val('');
        $('#CostPrice').val('');
        $('#Status').val('Available');

        // Close overlay
        $('#overlayNoProducts')
            .removeClass('visible opacity-100')
            .addClass('invisible opacity-0');

        $('.overlay-content-wrapper')
            .removeClass('translate-y-0')
            .addClass('-translate-y-full');

        selectedSkuData = null;
    });

    $(document).on('click', '.remove-btn', function () {
        $(this).closest('tr').remove();
    });

    $('#saveButton').on('click', function(e) {
        e.preventDefault();

        // Collect all supplier product rows data
        const productsToSave = [];

        $('#supplierProductTableBody tr').each(function() {
            const $row = $(this);

            const productName = $row.find('td').eq(1).text().trim();
            const skuCode = $row.find('td').eq(2).text().trim();
            const statusText = $row.find('td').eq(3).text().trim();
            const leadDay = $row.find('td').eq(4).text().trim();
            const costPrice = $row.find('td').eq(5).text().trim();

            const supplierId = $('#supplierId').val();
            const skuId = $row.data('sku-id');

            if (!supplierId || !skuId) {
                Swal.fire('Error', 'Missing supplierId or skuId. Cannot save.', 'error');
                return false; // stop iterating
            }

            productsToSave.push({
                supplierId: Number(supplierId),
                skuId: Number(skuId),
                leadTimeDays: Number(leadDay),
                costPrice: Number(costPrice),
                status: statusText
            });
        });

        if (productsToSave.length === 0) {
            Swal.fire('Warning', 'No products to save!', 'warning');
            return;
        }

        console.log(productsToSave);

        // Confirm with SweetAlert2 before sending
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to save ${productsToSave.length} product(s).`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                ajaxHelper.post('/api/v1/suppliers/batch', productsToSave, function(response) {
                    Swal.fire('Success', response.message || 'Products saved successfully!', 'success');
                    // Optional: clear table or reload page here
                }, function(err) {
                    Swal.fire('Error', 'Error saving products. Check console.', 'error');
                    console.error(err);
                });
            }
        });
    });

    // Function to handle the search for the "Product" table
    function searchProducts() {
        const searchText = $("#searchProductInput").val().toLowerCase();

        $("#productTableBody tr").each(function() {
            const row = $(this);
            let rowText = "";

            // Combine text from relevant columns: Product Name, SKU CODE, and Attribute
            rowText += row.find("td:nth-child(2)").text().toLowerCase();
            rowText += " " + row.find("td:nth-child(3)").text().toLowerCase();
            rowText += " " + row.find("td:nth-child(4)").text().toLowerCase();

            if (rowText.includes(searchText)) {
                row.show();
            } else {
                row.hide();
            }
        });
    }

// Function to handle the search for the "Supplier product list" table
    function searchSupplierProducts() {
        const searchText = $("#searchSupplierProductInput").val().toLowerCase();

        $("#supplierProductTableBody tr").each(function() {
            const row = $(this);
            let rowText = "";

            // Combine text from relevant columns: Product Name, SKU CODE, Status, and Lead Day
            rowText += row.find("td:nth-child(2)").text().toLowerCase();
            rowText += " " + row.find("td:nth-child(3)").text().toLowerCase();
            rowText += " " + row.find("td:nth-child(4)").text().toLowerCase();
            rowText += " " + row.find("td:nth-child(5)").text().toLowerCase();

            if (rowText.includes(searchText)) {
                row.show();
            } else {
                row.hide();
            }
        });
    }

// Attach the search functions to the keyup event of their respective input fields
    $("#searchProductInput").on("keyup", searchProducts);
    $("#searchSupplierProductInput").on("keyup", searchSupplierProducts);






});