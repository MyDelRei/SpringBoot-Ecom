$(document).ready(function () {
    let skuAttributes = [];
    let skuData = null;
    let attributeList = [];

    // 1. Load attribute list and populate select dropdown
    ajaxHelper.get("/api/v1/admin/attributes", function (data) {
        attributeList = data;
        const $attributeSelect = $("#AttributeSelect");
        $attributeSelect.empty().append(`<option value="">-- Select Attribute --</option>`);
        data.forEach(attr =>
            $attributeSelect.append(`<option value="${attr.attributeId}">${attr.attributeName}</option>`)
        );

        // Render rows if SKU already loaded
        if (skuData?.attributes) {
            renderAttributeRows();
        }
    });

    // 2. Load SKU from localStorage
    const skuDataJSON = localStorage.getItem("editSkuData");
    if (skuDataJSON) {
        try {
            skuData = JSON.parse(skuDataJSON);

            // Fill product fields
            $("#ProductSelect").html(`<option>${skuData.productName}</option>`).prop("disabled", true);
            $("#skucode").val(skuData.skuCode).prop("readonly", true);

            // Prepare skuAttributes
            if (Array.isArray(skuData.attributes)) {
                skuAttributes = skuData.attributes.map(attr => ({
                    skuId: skuData.productId || skuData.skuId,
                    attributeId: attr.attributeId,
                    value: attr.attributeValue
                }));
                renderAttributeRows();
            }
        } catch (e) {
            console.error("Failed to parse SKU from localStorage", e);
        }
    }

    // 3. Add attribute to table (dynamic, not saving)
    $("#btnAddAttribute").on("click", function () {
        const skuId = skuData?.productId || skuData?.skuId;
        const attributeId = parseInt($("#AttributeSelect").val());
        const value = $("#attributeValue").val().trim();

        if (!attributeId || !value) {
            Swal.fire("Please select an attribute and enter a value.");
            return;
        }

        const exists = skuAttributes.some(attr => attr.attributeId === attributeId);
        if (exists) {
            Swal.fire("Attribute already added.");
            return;
        }

        skuAttributes.push({ skuId, attributeId, value });
        $("#attributeValue").val("");
        renderAttributeRows();
    });


    // 5. Render table rows
    function renderAttributeRows() {
        const $tbody = $("tbody.divide-y");
        $tbody.empty();

        const productName = skuData?.productName || $("#ProductSelect option:selected").text();
        const skuCode = skuData?.skuCode || $("#skucode").val();

        skuAttributes.forEach(attr => {
            const attrMeta = attributeList.find(a => a.attributeId === attr.attributeId);
            const attributeName = attrMeta ? attrMeta.attributeName : `#${attr.attributeId}`;
            const value = attr.value || "";

            $tbody.append(`
                <tr data-attribute-id="${attr.attributeId}">
                    <td class="pl-6 pr-3 py-3 w-6"><input type="checkbox" /></td>
                    <td class="px-3 py-3">${productName}</td>
                    <td class="px-3 py-3">${skuCode}</td>
                    <td class="px-3 py-3">${attributeName}</td>
                    <td class="px-3 py-3">${value}</td>
                    <td class="px-3 py-3 text-center">
                        <button type="button" class="remove-row text-red-500">Remove</button>
                    </td>
                </tr>
            `);
        });
    }

    $("tbody.divide-y").on("click", ".remove-row", function () {
        const $row = $(this).closest("tr");
        const attributeId = parseInt($row.data("attribute-id"));
        const skuId = skuData?.productId || skuData?.skuId;

        Swal.fire({
            title: 'Are you sure?',
            text: `Remove this attribute (ID: ${attributeId}) from SKU?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/api/v1/admin/sku-attributes/delete-attribute',
                    method: 'DELETE',
                    contentType: 'application/json',
                    data: JSON.stringify({ skuId, attributeId }),
                    success: function() {
                        // Remove locally and re-render


                        window.location = '/sku-att/sku-list';
                        Swal.fire('Removed!', 'Attribute has been removed from SKU.', 'success');
                    },
                    error: function(xhr) {
                        Swal.fire('Error', xhr.responseJSON?.message || 'Failed to remove attribute.', 'error');
                    }
                });
            }
        });
    });



});
