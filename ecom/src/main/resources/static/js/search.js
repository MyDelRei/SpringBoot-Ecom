

const routes = [
    { name: "Dashboard", path: "/" },
    { name: "Brand List", path: "/brands" },
    { name: "Add Brand", path: "/brands/add-brand" },
    { name: "Category List", path: "/category" },
    { name: "Add Category", path: "/category/add-category" },
    { name: "Product List", path: "/product" },
    { name: "Add Product", path: "/product/add-product" },
    { name: "SKU List", path: "/sku" },
    { name: "Add SKU", path: "/sku/add-sku" },
    { name: "Warehouse List", path: "/warehouse" },
    { name: "Add Warehouse", path: "/warehouse/add-warehouse" },
    { name: "Attribute List", path: "/attributes" },
    { name: "Add Attribute", path: "/attributes/add-attributes" },
    { name: "Checkout", path: "/checkout" },
    { name: "Checkout SN", path: "/checkout/sn" },
    { name: "Checkout NS", path: "/checkout/ns" },
    { name: "Report", path: "/report" },
    { name: "Request Product", path: "/Request" },
    { name: "Purchase Product", path: "/Request/purchase" },
    { name: "Payment Purchase", path: "/payment/purchase" },
    { name: "Payment List", path: "/payment-list" },
    { name: "Product Arrival", path: "/product-arrival" },
    { name: "Add Product Arrival", path: "/product-arrival/add" },
    { name: "Supplier", path: "/supplier" },
    { name: "Add Supplier", path: "/supplier/add-supplier" },
    { name: "Supplier List", path: "/supplier/list-supplier" },
    { name: "Add Supplier Product", path: "/supplier/add-product" },
    { name: "Supplier Payment Methods", path: "/supplier/payment-method" },
    { name: "Add Supplier Payment Method", path: "/supplier/add-payment-method" },
    { name: "Stock", path: "/stock" },
    { name: "List Individual Unit", path: "/stock/list-individual" },
    { name: "Add Individual Unit", path: "/stock/add-individual-stock" },
    { name: "Inventory", path: "/stock/list-inventory" },
    { name: "Add Inventory Unit", path: "/stock/add-inventory" },
    { name: "View Stock", path: "/stock/view-stock" },
    // Add more routes as needed
];
document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const searchOverlay = document.getElementById("searchOverlay");
    const closeSearchOverlayBtn = document.getElementById("closeSearchOverlay");
    const overlaySearchInput = document.getElementById("overlaySearchInput");
    const searchResults = document.getElementById("searchResults");

    // Show overlay
    searchInput.addEventListener("click", function() {
        searchOverlay.classList.remove("invisible", "opacity-0");
        searchOverlay.classList.add("visible", "opacity-100");
        overlaySearchInput.focus();
        searchResults.innerHTML = ""; // clear previous results
    });

    // Close overlay
    closeSearchOverlayBtn.addEventListener("click", function() {
        searchOverlay.classList.remove("visible", "opacity-100");
        searchOverlay.classList.add("invisible", "opacity-0");
    });

    searchOverlay.addEventListener("click", function(event) {
        if (event.target === searchOverlay) {
            searchOverlay.classList.remove("visible", "opacity-100");
            searchOverlay.classList.add("invisible", "opacity-0");
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && searchOverlay.classList.contains("visible")) {
            searchOverlay.classList.remove("visible", "opacity-100");
            searchOverlay.classList.add("invisible", "opacity-0");
        }
    });

    // Filter and display results
    overlaySearchInput.addEventListener("input", function() {
        const query = overlaySearchInput.value.toLowerCase();
        searchResults.innerHTML = "";

        if(query.length === 0) return;

        const filtered = routes
            .filter(r => r.name.toLowerCase().includes(query) || r.path.toLowerCase().includes(query))
            .slice(0, 8); // limit to 8 results

        filtered.forEach(r => {
            const div = document.createElement("div");
            div.className = "p-2 cursor-pointer hover:bg-gray-100 rounded";
            div.textContent = `${r.name} (${r.path})`;
            div.addEventListener("click", () => {
                window.location.href = r.path;
            });
            searchResults.appendChild(div);
        });
    });

});

