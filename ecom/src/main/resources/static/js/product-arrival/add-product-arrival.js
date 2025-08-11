$(document).ready(function () {
    let allSkus = [];
    let invoiceNumbers = [];
    let users = [];

    // Load SKUs
    ajaxHelper.get("/api/v1/admin/sku/dto", function (data) {
        allSkus = data;
        const $skuSelect = $(".sku-select");
        $skuSelect.empty().append(`<option value="">-- Select SKU --</option>`);
        data.forEach((sku) =>
            $skuSelect.append(`<option value="${sku.skuId}">${sku.skuCode} - ${sku.productName}</option>`)
        );
    });

    // Load Invoice Numbers
    ajaxHelper.get("/api/v1/admin/invoice-numbers", function (data) {
        invoiceNumbers = data;
        const $invoiceNumberSelect = $("#invoice_number");
        $invoiceNumberSelect.empty().append(`<option value="">-- Select Invoice --</option>`);
        data.forEach((invoice) =>
            $invoiceNumberSelect.append(`<option value="${invoice}">${invoice}</option>`)
        );
    });

    // Load Users
    ajaxHelper.get("/api/v1/admin/users", function (data) {
        users = data;
        const $userSelect = $("#received_by");
        $userSelect.empty().append(`<option value="">-- Select User --</option>`);
        data.forEach((user) =>
            $userSelect.append(`<option value="${user.id}">${user.username}</option>`)
        );
    });

    // Handle Invoice Number Change
    $("#invoice_number").on("change", function () {
        const selectedInvoice = $(this).val();
        if (!selectedInvoice) {
            $("#request_id").val("");
            return;
        }

        ajaxHelper.get(`/api/v1/admin/${selectedInvoice}/request`, function (data) {
            if (data && data.requestId) {
                $("#request_id").val(data.requestId);
            } else {
                alert("No associated Request ID found for the selected invoice.");
                $("#request_id").val("");
            }
        }, function () {
            alert("Failed to fetch the request ID for the selected invoice. Please try again.");
            $("#request_id").val("");
        });
    });

    // Add New Product Item
    $("#add-item").on("click", function () {
        const $itemTemplate = $("#item-entries .item-entry").first().clone();
        $itemTemplate.find("select, input").val("");
        $("#item-entries").append($itemTemplate);
        resetItemIndexes();
    });

    // Remove Product Item Entry
    $(document).on("click", ".remove-item", function () {
        if ($("#item-entries .item-entry").length > 1) {
            $(this).closest(".item-entry").remove();
            resetItemIndexes();
        } else {
            alert("At least one item must be present.");
        }
    });

    // Reset Item Indexes
    function resetItemIndexes() {
        $("#item-entries .item-entry").each(function (index) {
            const entryIndex = index + 1;
            $(this).find(".sku-select").attr("id", `sku_id_${entryIndex}`).attr("name", `sku_id_${entryIndex}`);
            $(this).find(".quantity-received").attr("id", `quantity_received_${entryIndex}`).attr("name", `quantity_received_${entryIndex}`);
            $(this).find(".note-input").attr("id", `note_${entryIndex}`).attr("name", `note_${entryIndex}`);
        });
    }

    // Submit Product Arrival Form
    $("#product-arrival-form").on("submit", function (e) {
        e.preventDefault();

        const formData = {
            arrivalDate: $("#arrival_date").val(),
            receivedById: $("#received_by").val(),
            invoiceNumber: $("#invoice_number").val(),
            requestId: $("#request_id").val(),
            items: []
        };

        // Collect Form Data for Items
        let invalidRow = 0;
        $("#item-entries .item-entry").each(function () {
            const skuId = $(this).find(".sku-select").val();
            const quantityReceived = parseInt($(this).find(".quantity-received").val(),10) || 0;
            const note = $(this).find(".note-input").val();

            if (skuId && quantityReceived > 0) {
                formData.items.push({ skuId, quantityReceived, note });
            }else {
                invalidRow++;
            }
        });

        if (!formData.arrivalDate || !formData.receivedById || !formData.invoiceNumber || formData.items.length === 0) {
            Swal.fire("Warning", "Please fill all required fields and add at least one valid item.", "warning");
            return;
        }

        // Send and AJAX POST request
        ajaxHelper.post("/api/v1/admin/product-arrival", formData, function () {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Product arrival created successfully!"
            }).then(() => {
                window.location.href = "/product-arrival";
            });
        }, function (err) {
            console.error("Error during submission:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to create product arrival. Please try again."
            });
        });
    });
});