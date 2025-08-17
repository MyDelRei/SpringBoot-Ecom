$(document).ready(function () {

    // Click handler for the Search button
    $("#search").on("click", function (e) {
        e.preventDefault(); // Prevent form submission

        // Get SKU from input
        let sku = $("#Sku").val().trim();

        if (!sku) {
            Swal.fire({
                icon: 'warning',
                title: 'SKU required',
                text: 'Please enter a SKU to search.'
            });
            return;
        }

        // Call inventory API to fetch SKU details
        $.ajax({
            url: "/api/inventory/find-sku",
            method: "GET",
            data: { sku: sku },
            success: function (data) {
                if (!data || data.length === 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Not Found',
                        text: 'No inventory found with this SKU.'
                    });
                    return;
                }

                let item = data[0];

                // Prepare variables
                let sku2 = item.sku || "";
                let qty = 1; // default quantity
                let location = item.location || "";

                // Fill form fields
                $("#Sku2").val(sku2);
                $("#Qty").val(qty);
                $("#location").val(location);

                console.log("Prepared data:", { sku2, qty, location });

                Swal.fire({
                    icon: 'success',
                    title: 'Found',
                    text: 'Inventory details loaded successfully.'
                });

                $("#Sku").val('');
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch data from server.'
                });
            }
        });
    });

    // Form submit handler for checkout
    $("#NonSerialForm").on("submit", function (e) {
        e.preventDefault();

        let skuCode = $("#Sku2").val().trim();
        let quantity = parseInt($("#Qty").val().trim());

        if (!skuCode || !quantity || quantity <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Input',
                text: 'Please enter valid SKU and quantity.'
            });
            return;
        }

        // Confirm checkout with Swal
        Swal.fire({
            title: `Check out ${quantity} of ${skuCode}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, check out',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                // Call checkout API
                $.ajax({
                    url: "/api/v1/checkout/ns/non-serial",
                    method: "POST",
                    data: { skuCode: skuCode, quantity: quantity },
                    success: function (res) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Checked Out',
                            text: res.message
                        });

                        // Clear form fields
                        $("#Sku2").val('');
                        $("#Qty").val('');
                        $("#location").val('');
                    },
                    error: function (xhr) {
                        let errMsg = xhr.responseJSON?.message || "Failed to check out";
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: errMsg
                        });
                    }
                });
            }
        });
    });

});
