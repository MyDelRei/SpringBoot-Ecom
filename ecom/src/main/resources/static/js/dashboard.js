$(document).ready(function() {

    let dashboardData = {}; // global variable to store API data

    // --- Fetch Dashboard Data from API ---
    function fetchDashboardData() {
        $.ajax({
            url: '/api/v1/dashboard/data',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                dashboardData = data; // save globally for overlay
                updateSummaryCards(data);
                renderPurchaseRequestChart(data.recentProductArrival);
                populateArrivalsTable(data.recentProductArrival);
                populateCheckoutsTable(data.recentCheckoutProjections);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching dashboard data:', error);
            }
        });
    }

    // --- Update Summary Cards ---
    function updateSummaryCards(data) {
        $('#totalProducts').text(data.totalSku);
        $('#totalSuppliers').text(data.totalSupplier);
        $('#totalWarehouses').text(data.totalWarehouse);

        // Open requests = arrivals not completed
        const openRequestsCount = data.recentProductArrival.filter(arrival => arrival.requestStatus !== 'completed').length;
        $('#openRequests').text(openRequestsCount);
    }

    // --- Render Purchase Request Status Chart ---
    function renderPurchaseRequestChart(arrivals) {
        const statusCounts = arrivals.reduce((acc, arrival) => {
            const status = arrival.requestStatus || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const ctx = document.getElementById('purchaseRequestStatusChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(statusCounts),
                    datasets: [{
                        data: Object.values(statusCounts),
                        backgroundColor: ['#34D399', '#F59E0B', '#EF4444', '#60A5FA'] // Green, Orange, Red, Blue
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
    }

    // --- Populate Recent Product Arrivals Table ---
    function populateArrivalsTable(arrivals) {
        const $tbody = $('#arrivalsTableBody');
        $tbody.empty();

        arrivals.forEach(arrival => {
            arrival.items.forEach(item => {
                $tbody.append(`
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${arrival.arrivalDate}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.skuCode}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.quantityReceived}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${arrival.invoiceNumber}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button class="border border-purple-500 text-purple-500 text-xs font-medium px-3 py-1 rounded-full 
                                       hover:bg-purple-500 hover:text-white transition-colors duration-200"
                                data-arrival-id="${arrival.id}" 
                                onclick="showProducts(${arrival.id})">
                            Show product
                        </button>
                    </td>
                </tr>
            `);
            });
        });
    }

    // --- Show Products in Overlay ---
    window.showProducts = function(arrivalId) {
        const arrival = dashboardData.recentProductArrival.find(a => a.id === arrivalId);
        if (!arrival) return;

        const $tbody = $('#overlayProductsBody');
        $tbody.empty();

        arrival.items.forEach(item => {
            $tbody.append(`
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.skuCode}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.productName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.quantityReceived}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.note || '-'}</td>
                </tr>
            `);
        });

        // Show the overlay
        $('#productOverlay').removeClass('hidden').addClass('flex');
    }

    // --- Close Overlay ---
    $('#closeOverlay').click(function() {
        $('#productOverlay').addClass('hidden').removeClass('flex');
    });

    // Close overlay on click outside content
    $('#productOverlay').click(function(e) {
        if (e.target.id === 'productOverlay') {
            $(this).addClass('hidden').removeClass('flex');
        }
    });

    // --- Populate Recent Checkouts Table ---
    function populateCheckoutsTable(checkouts) {
        const $tbody = $('#recentCheckoutsTableBody');
        $tbody.empty();

        // Sort by createdAt descending
        checkouts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        checkouts.forEach(checkout => {
            $tbody.append(`
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${checkout.createdAt}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${checkout.sku}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${checkout.quantity}</td>
                </tr>
            `);
        });
    }

    // --- Initialize Dashboard ---
    fetchDashboardData();
});
