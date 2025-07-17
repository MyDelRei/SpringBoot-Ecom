// js/supplier/List_Supplier.js

$(document).ready(function() {
    const supplierTableBody = $('#supplierTableBody');
    const searchInput = $('#searchInput');

    // Function to fetch and display suppliers
    function fetchSuppliers(searchTerm = '') {
        // Assume your backend API endpoint for listing suppliers is '/api/suppliers'
        // If you have a search term, append it as a query parameter
        const url = searchTerm ? `/api/suppliers?search=${encodeURIComponent(searchTerm)}` : '/api/suppliers';

        ajaxRequest(url, 'GET')
            .then(suppliers => {
                renderSuppliers(suppliers);
            })
            .catch(error => {
                console.error('Failed to fetch suppliers:', error);
                // Display an error message to the user
                supplierTableBody.html('<tr><td colspan="6" class="text-center py-4 text-red-500">Failed to load suppliers. Please try again.</td></tr>');
            });
    }

    // Function to render suppliers into the table
    function renderSuppliers(suppliers) {
        supplierTableBody.empty(); // Clear existing rows

        if (suppliers.length === 0) {
            supplierTableBody.append('<tr><td colspan="6" class="text-center py-4 text-gray-500">No suppliers found.</td></tr>');
            return;
        }

        suppliers.forEach(supplier => {
            const row = `
                <tr class="border-t hover:bg-gray-50 transition">
                    <td class="px-6 py-4"><input type="checkbox" class="rounded"></td>
                    <td class="px-6 py-4">${supplier.supplierName}</td>
                    <td class="px-6 py-4">${supplier.email}</td>
                    <td class="px-6 py-4">${supplier.phone}</td>
                    <td class="px-6 py-4">${supplier.address}</td>
                    <td class="px-6 py-4 text-center space-x-2">
                        <a href="edit-supplier.html?id=${supplier.id}" class="inline-block p-2 text-blue-500 hover:text-blue-700 transition">
                            <i class="fas fa-edit"></i>
                        </a>
                        <button class="inline-block p-2 text-red-500 hover:text-red-700 transition delete-supplier-btn" data-supplier-id="${supplier.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            supplierTableBody.append(row);
        });
    }

    // Event listener for search input
    let searchTimeout;
    searchInput.on('keyup', function() {
        clearTimeout(searchTimeout);
        const searchTerm = $(this).val();
        searchTimeout = setTimeout(() => {
            fetchSuppliers(searchTerm);
        }, 300); // Debounce search to avoid too many requests
    });

    // Event listener for delete button (using event delegation)
    supplierTableBody.on('click', '.delete-supplier-btn', function() {
        const supplierId = $(this).data('supplier-id');
        if (confirm('Are you sure you want to delete this supplier?')) {
            // Assume your backend API endpoint for deleting a supplier is '/api/suppliers/{id}'
            ajaxRequest(`/api/suppliers/${supplierId}`, 'DELETE')
                .then(() => {
                    alert('Supplier deleted successfully!');
                    fetchSuppliers(searchInput.val()); // Re-fetch list to update table
                })
                .catch(error => {
                    console.error('Failed to delete supplier:', error);
                    alert('Failed to delete supplier. Please try again.');
                });
        }
    });

    // Initial fetch of suppliers when the page loads
    fetchSuppliers();

    // Event listener for "Add Sku" button - change it to "Add Supplier"
    $('.bg-indigo-500.hover\\:bg-indigo-600.text-white.font-medium.py-2.px-4.rounded-full.shadow-lg.transition.duration-200').on('click', function() {
        window.location.href = 'add-supplier.html'; // Navigate to your add supplier page
    });
});