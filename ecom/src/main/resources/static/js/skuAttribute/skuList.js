$(document).ready(function () {
  let allSkus = [];
  let currentSearchTerm = "";
  let rowsPerPage = 5;
  let currentPage = 1;
  let totalPages = 1;

  function renderTable(data) {
    const tbody = $("table tbody");
    tbody.empty();

    totalPages = Math.ceil(data.length / rowsPerPage);
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginated = data.slice(start, end);

    if (paginated.length === 0) {
      tbody.append(
          '<tr><td colspan="6" class="py-3 px-4 text-center text-gray-500">No SKUs found.</td></tr>'
      );
      renderPagination();
      return;
    }

    paginated.forEach((sku) => {
      tbody.append(`
        <tr class="border-b border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-normal">
          <td class="py-3 px-4 border-r border-gray-200">
            <input type="checkbox" id="check-${sku.skuId}" />
          </td>
          <td class="py-3 px-4 border-r border-gray-200">${sku.skuCode || ""}</td>
          <td class="py-3 px-4 border-r border-gray-200">${sku.productName || ""}</td>
          <td class="py-3 px-4 border-r border-gray-200">${sku.isSerialized === "Y" ? "Yes" : "No"}</td>
          <td class="py-3 px-4 border-r border-gray-200">
            <button class="btn-detail text-indigo-500 p-2" data-skuid="${sku.skuId}">
              <span class="px-2 py-1 bg-blue-100 rounded">Detail</span>
            </button>
          </td>
          <td class="py-3 px-4 text-center space-x-2">
            <button class="btn-edit text-red-500 p-2" data-skuid="${sku.skuId}">
              <i class="fas fa-trash-alt"></i>
            </button>
           
          </td>
        </tr>
      `);
    });

    renderPagination();
  }

  function renderPagination() {
    const container = $("#pagination");
    container.empty();

    if (totalPages <= 1) return;

    container.append(`
      <button class="prev-btn p-2 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}">
        <i class="fas fa-chevron-left text-sm"></i>
      </button>
    `);

    for (let i = 1; i <= totalPages; i++) {
      container.append(`
        <button class="pagination-btn px-3 py-1 rounded-lg ${
          i === currentPage ? "bg-indigo-600 text-white" : "hover:bg-gray-200"
      }" data-page="${i}">${i}</button>
      `);
    }

    container.append(`
      <button class="next-btn p-2 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}">
        <i class="fas fa-chevron-right text-sm"></i>
      </button>
    `);
  }

  function applySearchAndRender() {
    const filtered = allSkus.filter((sku) => {
      if (!currentSearchTerm) return true;
      const term = currentSearchTerm.toLowerCase();
      return (
          sku.skuCode?.toLowerCase().includes(term) ||
          sku.productName?.toLowerCase().includes(term)
      );
    });

    renderTable(filtered);
  }

  function loadInitialData() {
    $.get("/api/v1/admin/sku-attributes/with-details", function (data) {
      allSkus = Array.isArray(data) ? data : [];
      currentPage = 1;
      applySearchAndRender();
    });
  }

  // Pagination events
  $(document).on("click", ".pagination-btn", function () {
    currentPage = parseInt($(this).data("page"));
    applySearchAndRender();
  });

  $(document).on("click", ".prev-btn", function () {
    if (currentPage > 1) {
      currentPage--;
      applySearchAndRender();
    }
  });

  $(document).on("click", ".next-btn", function () {
    if (currentPage < totalPages) {
      currentPage++;
      applySearchAndRender();
    }
  });

  // Search input
  $("#search").on("input", function () {
    currentSearchTerm = $(this).val();
    currentPage = 1;
    applySearchAndRender();
  });

  // Detail button opens overlay
  $(document).on("click", ".btn-detail", function () {
    const skuId = $(this).data("skuid");
    const sku = allSkus.find((s) => s.skuId === skuId);
    if (!sku) return;

    $("#detail-sku-code").text(sku.skuCode);
    $("#detail-product-name").text(sku.productName);
    $("#detail-description").text(sku.description || "");
    $("#detail-price").text(sku.salePrice ? `$${sku.salePrice}` : "-");

    const $attributeSection = $("#attribute-section");
    $attributeSection.empty();
    (sku.attributes || []).forEach((attr) => {
      $attributeSection.append(`
        <div class="mb-2">
          <strong>${attr.attributeName}</strong>: ${attr.attributeValue} ${attr.unitOfMeasure || ""}
        </div>
      `);
    });

    // Image gallery fix
    const $thumbnailContainer = $("#thumbnail-container");
    const $mainImage = $("#main-image");

    $thumbnailContainer.empty();
    $mainImage.attr("src", "");
    $mainImage.attr("alt", "");

    const images = sku.images || [];

    if (images.length > 0) {
      $mainImage.attr("src", `data:image/png;base64,${images[0].base64Image}`);
      $mainImage.attr("alt", images[0].altText || "");

      images.forEach((img, idx) => {
        const $thumb = $(`
          <img 
            src="data:image/png;base64,${img.base64Image}" 
            alt="${img.altText || ''}" 
            class="w-20 h-20 cursor-pointer"
            data-index="${idx}"
          />
        `);
        $thumbnailContainer.append($thumb);
      });

      $thumbnailContainer.off("click").on("click", "img", function () {
        const idx = $(this).data("index");
        $mainImage.attr("src", `data:image/png;base64,${images[idx].base64Image}`);
        $mainImage.attr("alt", images[idx].altText || "");
      });
    } else {
      $mainImage.attr("src", "");
      $mainImage.attr("alt", "No image available");
    }

    $("#myOverlay").removeClass("invisible opacity-0").addClass("visible opacity-100");
    $("body").css("overflow", "hidden");
  });

  // Close overlay on click outside content
  $("#myOverlay").on("click", function (e) {
    if (e.target.id === "myOverlay") {
      $("#myOverlay").addClass("invisible opacity-0").removeClass("visible opacity-100");
      $("body").css("overflow", "");
    }
  });

  // Edit button click — store sku in localStorage then redirect
  $(document).on("click", ".btn-edit", function () {
    const skuId = $(this).data("skuid");
    const sku = allSkus.find((s) => s.skuId === skuId);
    if (!sku) return;

    // Copy SKU and remove large images data
    const skuCopy = { ...sku, images: [] };

    localStorage.setItem("editSkuData", JSON.stringify(skuCopy));
    window.location.href = `/sku-att/update?skuId=${skuId}`;
  });


  // Init load
  loadInitialData();
});
