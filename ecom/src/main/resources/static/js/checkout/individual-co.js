$(document).ready(function () {

    // --- Search Button Logic ---
    $("#search").on("click", function (e) {
        e.preventDefault(); // Prevent default form submit

        let serialNumber = $("#serialNumber").val().trim();

        if (!serialNumber) {
            Swal.fire({
                icon: 'warning',
                title: 'Serial number required',
                text: 'Please enter a serial number to search.'
            });
            return;
        }

        // Fetch unit by serial number
        $.ajax({
            url: "/api/v1/individual/find-sn",
            method: "GET",
            data: { serialNumber: serialNumber },
            success: function (units) {
                if (!units || units.length === 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Not Found',
                        text: 'No unit found with this serial number.'
                    });
                    return;
                }

                let unit = units[0];

                // Store fields in variables
                let sku = unit.sku || "";
                let serialNumber2 = unit.serialNumber || "";
                let qty = unit.qty || 1;
                let location = unit.location || "";

                // Fill form
                $("#Sku").val(sku);
                $("#serialNumber2").val(serialNumber2);
                $("#Qty").val(qty);
                $("#location").val(location);

                console.log("Prepared data:", { sku, serialNumber2, qty, location });
                Swal.fire({
                    icon: 'success',
                    title: 'Found',
                    text: 'Unit details loaded successfully.'
                });

                $("#serialNumber").val('');
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

    // --- Check Out Button Logic ---
    $("#addBrandForm").on("submit", function (e) {
        e.preventDefault(); // Prevent form submission

        let sku = $("#Sku").val().trim();
        let serialNumber2 = $("#serialNumber2").val().trim();
        let qty = $("#Qty").val().trim();
        let location = $("#location").val().trim();

        if (!sku || !serialNumber2) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Data',
                text: 'Please search and load a unit before checking out.'
            });
            return;
        }

        // Confirm checkout
        Swal.fire({
            title: 'Confirm Check Out',
            html: `<strong>SKU:</strong> ${sku}<br>
                   <strong>Serial:</strong> ${serialNumber2}<br>
                   <strong>Qty:</strong> ${qty}<br>
                   <strong>Location:</strong> ${location}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Check Out',
            cancelButtonText: 'No, Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Call API to check out serialized product
                $.ajax({
                    url: "/api/v1/checkout/sn",
                    method: "POST",
                    data: { sku: sku, serialNumber: serialNumber2 },
                    success: function (res) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Checked Out!',
                            html: `<strong>SKU:</strong> ${res.sku}<br>
                                   <strong>Serial:</strong> ${res.serialNumber}`
                        });

                        // Clear form
                        $("#Sku").val('');
                        $("#serialNumber2").val('');
                        $("#Qty").val('');
                        $("#location").val('');
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to check out the unit.'
                        });
                    }
                });
            }
        });
    });

});
