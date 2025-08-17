$(document).ready(function() {
    // --- Demo Data ---
    const demoData = {
        products: [
            { Product_Id: 1, Product_Name: 'Monitor', Brand_ID: 1 },
            { Product_Id: 2, Product_Name: 'Keyboard', Brand_ID: 2 },
            { Product_Id: 3, Product_Name: 'Mouse', Brand_ID: 2 },
            { Product_Id: 4, Product_Name: 'Webcam', Brand_ID: 1 },
            { Product_Id: 5, Product_Name: 'Laptop', Brand_ID: 3 }
        ],
        suppliers: [
            { supplier_id: 1, supplier_name: 'Supplier X' },
            { supplier_id: 2, supplier_name: 'Supplier Y' }
        ],
        warehouses: [
            { warehouse_id: 1, warehouse_name: 'Main Warehouse' },
            { warehouse_id: 2, warehouse_name: 'Branch Warehouse' }
        ],
        purchaseRequests: [
            { request_id: 101, status: 'Pending' },
            { request_id: 102, status: 'Completed' },
            { request_id: 103, status: 'Completed' },
            { request_id: 104, status: 'Pending' },
            { request_id: 105, status: 'Cancelled' },
            { request_id: 106, status: 'Pending' }
        ],
        productArrivals: [
            { arrival_id: 201, request_id: 102, sku_id: 'SKU-ABC', quantity_received: 50, received_by: 'John Doe', arrival_date: '2024-07-28' },
            { arrival_id: 202, request_id: 103, sku_id: 'SKU-XYZ', quantity_received: 100, received_by: 'Jane Smith', arrival_date: '2024-07-27' },
            { arrival_id: 203, request_id: 101, sku_id: 'SKU-123', quantity_received: 20, received_by: 'John Doe', arrival_date: '2024-07-26' }
        ],
        inventory: [
            { sku_id: 'SKU-ABC', quantity: 45, location: 'WH1-Aisle3-Bin1' },
            { sku_id: 'SKU-XYZ', quantity: 90, location: 'WH2-Aisle1-Bin4' },
            { sku_id: 'SKU-123', quantity: 15, location: 'WH1-Aisle2-Bin5' },
            { sku_id: 'SKU-LOW', quantity: 3, location: 'WH1-Aisle1-Bin1' } // Low stock item
        ],
        checkouts: [
            { checkout_date: '2024-07-29', sku_id: 'SKU-ABC', quantity: 5, product_name: 'Monitor' },
            { checkout_date: '2024-07-29', sku_id: 'SKU-XYZ', quantity: 10, product_name: 'Keyboard' },
            { checkout_date: '2024-07-28', sku_id: 'SKU-123', quantity: 5, product_name: 'Mouse' }
        ]
    };

    // --- Update Summary Cards ---
    function updateSummaryCards() {
        $('#totalProducts').text(demoData.products.length);
        $('#totalSuppliers').text(demoData.suppliers.length);
        $('#totalWarehouses').text(demoData.warehouses.length);
        $('#openRequests').text(demoData.purchaseRequests.filter(pr => pr.status === 'Pending').length);
    }

    // --- Render Purchase Request Status Pie Chart ---
    function renderPurchaseRequestChart() {
        const statusCounts = demoData.purchaseRequests.reduce((acc, req) => {
            acc[req.status] = (acc[req.status] || 0) + 1;
            return acc;
        }, {});

        new Chart(document.getElementById('purchaseRequestStatusChart'), {
            type: 'pie',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: ['#F59E0B', '#34D399', '#EF4444']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false }
                }
            }
        });
    }

    // --- Populate Recent Arrivals Table ---
    function populateArrivalsTable() {
        const $tbody = $('#arrivalsTableBody');
        $tbody.empty();
        demoData.productArrivals.forEach(arrival => {
            $tbody.append(`
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${arrival.arrival_date}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${arrival.request_id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${arrival.sku_id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${arrival.quantity_received}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${arrival.received_by}</td>
                </tr>
            `);
        });
    }

    // --- Populate Recent Checkouts Table ---
    function populateCheckoutsTable() {
        const $tbody = $('#recentCheckoutsTableBody');
        $tbody.empty();
        demoData.checkouts.forEach(checkout => {
            $tbody.append(`
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${checkout.checkout_date}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${checkout.sku_id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${checkout.quantity}</td>
                </tr>
            `);
        });
    }

    // --- Populate Inventory Table (Optional) ---
    function populateInventoryTable() {
        const $tbody = $('#inventoryTableBody');
        if (!$tbody.length) return; // Skip if table not present
        $tbody.empty();
        demoData.inventory.forEach(item => {
            const product = demoData.products.find(p => p.Product_Name.toUpperCase() === item.sku_id.split('-')[1].toUpperCase()) || {};
            const rowClass = item.quantity < 10 ? 'bg-red-100' : '';
            $tbody.append(`
                <tr class="${rowClass}">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.sku_id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.Product_Name || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.quantity}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.location}</td>
                </tr>
            `);
        });
    }

    // --- Initialize Dashboard ---
    updateSummaryCards();
    renderPurchaseRequestChart();
    populateArrivalsTable();
    populateCheckoutsTable();
    populateInventoryTable();
});
