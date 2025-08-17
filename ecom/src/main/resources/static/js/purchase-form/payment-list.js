$(document).ready(function () {
    const tableBody = $("#PurchaseOrderList");
    const productOverlay = $("#productOverlay");
    const productListContainer = $("#product-list-container");
    const editOverlay = $("#EditOverlay");

    // Render a table row for one payment item
    function renderRow(item) {
        const amount = Number(item.amount).toFixed(2);
        const paymentDate = item.paymentDate ?? '';

        const row = $(`
            <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-4 border-r border-gray-200">
                    <input type="checkbox" class="h-5 w-5 border-gray-300 rounded">
                </td>
                <td class="py-3 px-4 border-r border-gray-200">${item.supplierName}</td>
                <td class="py-3 px-4 border-r border-gray-200">${item.invoiceNumber}</td>
                <td class="py-3 px-4 border-r border-gray-200">${amount}</td>
                <td class="py-3 px-4 border-r border-gray-200">${item.requestStatus}</td>
                <td class="py-3 px-4 border-r border-gray-200">${item.paymentMethod}</td>
                <td class="py-3 px-4 border-r border-gray-200">${paymentDate}</td>
                <td class="py-3 px-4 border-r border-gray-200">
                    <button class="show-product-btn h-[32px] px-3 py-1 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors">
                        Show
                    </button>
                </td>
                <td class="py-3 px-4 text-center">
                    <button class="edit-btn text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition duration-200"
                        data-id="${item.requestId}">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                </td>
            </tr>
        `);

        // Attach skuDetails array safely to Show button
        row.find(".show-product-btn").data("products", item.skuDetails);

        return row;
    }

    // Render product details inside the product overlay
    function renderProducts(products) {
        productListContainer.empty();

        if (!Array.isArray(products) || products.length === 0) {
            productListContainer.append('<div>No products found.</div>');
            return;
        }

        products.forEach(p => {
            const price = Number(p.price).toFixed(2);
            productListContainer.append(`
                <div class="p-4 bg-gray-100 rounded-lg flex justify-between">
                    <span>${p.productName}</span>
                    <span class="font-semibold">$${price}</span>
                </div>
            `);
        });
    }

    // Show/hide overlay utility functions
    function showOverlay(overlay) {
        overlay.removeClass("invisible opacity-0").addClass("visible opacity-100");
    }
    function hideOverlay(overlay) {
        overlay.removeClass("visible opacity-100").addClass("invisible opacity-0");
    }

    // Load all payments and render in table
    function loadPayments() {
        $.ajax({
            url: "/api/v1/purchases/payment-list",
            method: "GET",
            dataType: "json",
            success: function (data) {
                tableBody.empty();
                data.forEach(item => {
                    const row = renderRow(item);
                    tableBody.append(row);
                });
            },
            error: function () {
                Swal.fire("Error", "Failed to load purchase payment list", "error");
            }
        });
    }

    // Event delegation for dynamically created Show buttons
    tableBody.on("click", ".show-product-btn", function () {
        let products = $(this).data("products");

        if (typeof products === "string") {
            try {
                products = JSON.parse(products);
            } catch (e) {
                console.error("Failed to parse products JSON:", e);
                products = [];
            }
        }

        renderProducts(products);
        showOverlay(productOverlay);
    });

    // Close product overlay
    $("#closeProductOverlay").on("click", function () {
        hideOverlay(productOverlay);
    });

    // Event delegation for Edit buttons to open edit overlay and set requestId
    tableBody.on("click", ".edit-btn", function () {
        const requestId = $(this).data("id");
        $("#requestIdInput").val(requestId);
        showOverlay(editOverlay);
    });

    // Close edit overlay
    $("#closeEditOverlay").on("click", function () {
        hideOverlay(editOverlay);
    });

    // Handle status update button click (AJAX PUT)
    $("#updateStatus").on("click", function (e) {
        e.preventDefault();

        const requestId = $("#requestIdInput").val();
        const status = $("#status").val();

        $.ajax({
            url: `/api/v1/purchases/${requestId}/status`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
                requestId: Number(requestId), // Ensure number type
                status: status
            }),
            success: function () {
                hideOverlay(editOverlay);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Status updated successfully!',
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    loadPayments();
                });
            },
            error: function (xhr) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Error updating status: " + (xhr.responseJSON?.message || xhr.status),
                });
            }
        });
    });

    // Function to handle the search functionality
    function handleSearch() {
        // Get the search input value and convert to lowercase for case-insensitive comparison
        const searchText = $("#search").val().toLowerCase();

        // Iterate over each table row in the purchase order list
        $("#PurchaseOrderList tr").each(function() {
            const row = $(this);
            let rowText = "";

            // Concatenate the text content of specific cells for searching
            // Get text from the 'Supplier', 'Invoice No', and 'Payment date' columns
            rowText += row.find("td:nth-child(2)").text().toLowerCase();
            rowText += " " + row.find("td:nth-child(3)").text().toLowerCase();
            rowText += " " + row.find("td:nth-child(4)").text().toLowerCase();
            rowText += " " + row.find("td:nth-child(5)").text().toLowerCase();
            rowText += " " + row.find("td:nth-child(6)").text().toLowerCase();
            rowText += " " + row.find("td:nth-child(7)").text().toLowerCase();


            // Check if the search text is present in the combined row text
            if (rowText.includes(searchText)) {
                // If a match is found, show the row
                row.show();
            } else {
                // If no match is found, hide the row
                row.hide();
            }
        });
    }

// Attach the handleSearch function to the keyup event of the search input field
// This will trigger the search every time a user types in the search bar
    $("#search").on("keyup", handleSearch);

    // Initial load on document ready
    loadPayments();
});
