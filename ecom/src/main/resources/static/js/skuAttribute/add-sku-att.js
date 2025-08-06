$(document).ready(function () {
  let allSkus = [];
  let skuAttributes = [];

  // Load SKUs - fill SKU code dropdown
  ajaxHelper.get("/api/v1/admin/sku/dto", function (data) {
    allSkus = data;
    const $skuCodeSelect = $("#SkuCodeSelect");
    $skuCodeSelect.empty().append(`<option value="">-- Select SKU Code --</option>`);
    data.forEach((sku) =>
        $skuCodeSelect.append(`<option value="${sku.skuId}">${sku.skuCode}</option>`)
    );
  });

  // When SKU code changes, autofill product info
  $("#SkuCodeSelect").on("change", function () {
    const selectedSkuId = $(this).val();
    if (!selectedSkuId) {
      resetProductPreview();
      $("#ProductName").val("");
      return;
    }

    const sku = allSkus.find((item) => item.skuId == selectedSkuId);
    if (sku) {
      $("#ProductName").val(sku.productName || "");
      $(".product-name").text(sku.productName || "Product name");
      $(".product-price").text(`$${sku.basePrice || 0}`);
      $(".product-description").text(sku.description || "");

      ajaxHelper.get(`/api/images/product/${sku.productId}`, function (imageData) {
        const src = imageData?.[0]
            ? `/api/images/get/${imageData[0].imageId}`
            : "https://placehold.co/600x400/EEE/31343C";
        $(".right-product-preview img").attr("src", src);
      });
    }
  });

  // Load attributes
  ajaxHelper.get("/api/v1/admin/attributes", function (data) {
    const $attributeSelect = $("#AttributeSelect");
    $attributeSelect.empty().append(`<option value="">-- Select Attribute --</option>`);
    data.forEach((attr) =>
        $attributeSelect.append(`<option value="${attr.attributeId}">${attr.attributeName}</option>`)
    );
  });

  // Add attribute row
  $("#btnAddAttribute").on("click", function () {
    const skuId = $("#SkuCodeSelect").val();
    const productName = $("#ProductName").val();
    const skuCode = $("#SkuCodeSelect option:selected").text();
    const attributeId = $("#AttributeSelect").val();
    const attributeName = $("#AttributeSelect option:selected").text();
    const attributeValue = $("#attributeValue").val().trim();

    if (!skuId || !productName || !skuCode || !attributeId || !attributeValue) {
      Swal.fire("Please fill all fields before adding.");
      return;
    }

    if (
        skuAttributes.some(
            (attr) => attr.skuId == skuId && attr.attributeId == attributeId
        )
    ) {
      Swal.fire("Warning", "This attribute already exists for this SKU.", "warning");
      return;
    }

    skuAttributes.push({ skuId: parseInt(skuId), attributeId: parseInt(attributeId), value: attributeValue });

    $("tbody.divide-y").append(`
          <tr data-sku-id="${skuId}" data-attribute-id="${attributeId}">
            <td class="pl-6 pr-3 py-3 w-6"><input type="checkbox" /></td>
            <td class="px-3 py-3">${productName}</td>
            <td class="px-3 py-3">${skuCode}</td>
            <td class="px-3 py-3">${attributeName}</td>
            <td class="px-3 py-3">${attributeValue}</td>
            <td class="px-3 py-3 text-center">
              <button type="button" class="remove-row text-red-500">Remove</button>
            </td>
          </tr>
        `);

    $("#attributeValue").val("");
  });

  // Remove row from table and array
  $("tbody.divide-y").on("click", ".remove-row", function () {
    const $row = $(this).closest("tr");
    const skuId = $row.data("sku-id");
    const attributeId = $row.data("attribute-id");

    skuAttributes = skuAttributes.filter(
        (attr) => !(attr.skuId == skuId && attr.attributeId == attributeId)
    );

    $row.remove();
  });

  // Submit form
  $("#addSkuAttrToProductForm").on("submit", function (e) {
    e.preventDefault();

    if (skuAttributes.length === 0) {
      Swal.fire("Warning", "No attributes added.", "warning");
      return;
    }

    const request = {
      skuId: skuAttributes[0].skuId,
      attributes: skuAttributes.map((a) => ({
        attributeId: a.attributeId,
        value: a.value,
      })),
    };

    $.ajax({
      url: "/api/v1/admin/sku-attributes/create",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(request),
      success: function (response) {
        Swal.fire("Success", response.message || "Saved successfully!", "success").then(() => {
          window.location.href = "/sku-att/sku-list";
        });
      },
      error: function (err) {
        Swal.fire("Error", err.responseJSON?.message || "Something went wrong.", "error");
      },
    });
  });

  // Reset product preview
  function resetProductPreview() {
    $("#ProductName").val("");
    $(".right-product-preview img").attr("src", "https://placehold.co/600x400/EEE/31343C");
    $(".product-name").text("Product name");
    $(".product-price").text("$0");
    $(".product-description").text("");
  }
});