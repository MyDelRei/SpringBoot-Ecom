$(document).ready(function () {
    let paymentMethods = [];
    let filteredMethods = [];
    const pageSize = 5;
    let currentPage = 1;

    const $tbody = $('table tbody');
    const $filterSelect = $('#paymentMethodFilter');
    const $searchInput = $('#searchInput');
    const $pagination = $('#pagination');
    const $overlay = $('#updateProductOverlay');
    const $form = $('#updateProductOverlay form');

    // Dummy load function — replace URL and ajax call with your actual API
    function loadPaymentMethods() {
        $.ajax({
            url: '/api/v1/suppliers/payment-method/list',
            method: 'GET',
            success: function (data) {
                paymentMethods = data;
                filteredMethods = paymentMethods;
                currentPage = 1;
                renderTablePage();
                renderPagination();
            },
            error: function () {
                Swal.fire('Error', 'Failed to load payment methods', 'error');
            }
        });
    }

    function renderTablePage() {
        $tbody.empty();
        if (filteredMethods.length === 0) {
            $tbody.append(`<tr><td colspan="7" class="text-center py-4 text-gray-500">No payment methods found.</td></tr>`);
            return;
        }
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const pageItems = filteredMethods.slice(start, end);

        pageItems.forEach(item => {
            const row = `
      <tr class="border-b border-gray-200 hover:bg-gray-50" data-id="${item.id}">
        <td class="py-3 px-4 border-r border-gray-200 text-center">
          <input type="checkbox" class="cursor-pointer" />
        </td>
        <td class="py-3 px-4 border-r border-gray-200">${item.supplierName || ''}</td>
        <td class="py-3 px-4 border-r border-gray-200">${item.bank || ''}</td>
        <td class="py-3 px-4 border-r border-gray-200">${item.paymentType || ''}</td>
        <td class="py-3 px-4 border-r border-gray-200">${item.accountNumber || ''}</td>
        <td class="py-3 px-4 text-center">
          <button class="editBtn text-indigo-600 hover:text-indigo-900 font-semibold"><i class="fas fa-pencil-alt"></i></button>
          <button class="deleteBtn text-red-600 hover:text-red-900 font-semibold ml-2"><i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>
      `;
            $tbody.append(row);
        });
    }

    function renderPagination() {
        $pagination.empty();
        const totalPages = Math.ceil(filteredMethods.length / pageSize);
        for (let i = 1; i <= totalPages; i++) {
            const btn = $(`<button class="px-3 py-1 rounded ${i === currentPage ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-100'}">${i}</button>`);
            btn.on('click', () => {
                currentPage = i;
                renderTablePage();
                renderPagination();
            });
            $pagination.append(btn);
        }
    }

    function filterMethods() {
        const filterBy = $filterSelect.val().toLowerCase();
        const term = $searchInput.val().toLowerCase();

        if (!term) {
            filteredMethods = paymentMethods;
        } else {
            filteredMethods = paymentMethods.filter(item => {
                switch (filterBy) {
                    case 'title': return (item.supplierName || '').toLowerCase().includes(term);
                    case 'type': return (item.paymentType || '').toLowerCase().includes(term);
                    case 'supplier': return (item.supplierName || '').toLowerCase().includes(term);
                    case 'bank no': return (item.accountNumber || '').toLowerCase().includes(term);
                    default: return true;
                }
            });
        }
        currentPage = 1;
        renderTablePage();
        renderPagination();
    }

    function openEditOverlay(id) {
        const item = paymentMethods.find(pm => pm.id === id);
        if (!item) return;

        $form.find('#Supplier').val(item.supplierName);
        $form.find('#SPMID').val(item.id);
        $form.find('#SupplierId').val(item.supplierId);
        $form.find('#Type').val(item.paymentType);
        $form.find('#Bank').val(item.bank);
        $form.find('#accountNo').val(item.accountNumber);

        if (item.qrImgBase64) {
            $('#imagePreview').html(`<img src="${item.qrImgBase64}" class="max-h-48 mx-auto" alt="QR Image"/>`);
        } else {
            $('#imagePreview').html(`
        <div class="text-center text-gray-400">
          <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p class="mt-1 text-sm">Upload image</p>
        </div>`);
        }

        $overlay.removeClass('hidden');
        setTimeout(() => {
            $('#overlayContent').removeClass('opacity-0').removeClass('-translate-y-10');
        }, 10);
    }

    function closeOverlay() {
        $('#overlayContent').addClass('opacity-0').addClass('-translate-y-10');
        setTimeout(() => $overlay.addClass('hidden'), 500);
    }

    // Stop overlay closing when clicking inside overlay content
    $('#overlayContent').on('click', function (e) {
        e.stopPropagation();
    });

    // Stop overlay closing when clicking buttons inside overlay (Choose base image, Cancel)
    $('#chooseImageBtn, #cancelBtn').on('click', function (e) {
        e.stopPropagation();
    });

    // Stop overlay closing when clicking file input itself
    $('#QRImg').on('click', function(e) {
        e.stopPropagation();
    });

    // Clicking overlay background closes overlay
    $overlay.on('click', function () {
        closeOverlay();
    });

    // Filter handlers
    $filterSelect.on('change', filterMethods);
    $searchInput.on('input', filterMethods);

    // Edit button click
    $tbody.on('click', '.editBtn', function () {
        const id = $(this).closest('tr').data('id');
        openEditOverlay(id);
    });

    // Cancel button closes overlay
    $('#cancelBtn').on('click', closeOverlay);

    // Choose base image button opens file selector
    $('#chooseImageBtn').on('click', function () {
        $('#QRImg').click();
    });

    // Preview chosen image
    $('#QRImg').on('change', function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            $('#imagePreview').html(`<img src="${e.target.result}" class="max-h-48 mx-auto" alt="Preview Image"/>`);
        };
        reader.readAsDataURL(file);
    });

    // Form submit handler with confirmation
    $form.on('submit', function (e) {
        e.preventDefault();

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to save the changes?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const id = $('#SPMID').val();
                const supplierId = $('#SupplierId').val();
                const paymentType = $('#Type').val();
                const bank = $('#Bank').val();
                const accountNumber = $('#accountNo').val();

                let qrImgBase
                let qrImgBase64 = null;
                const imgSrc = $('#imagePreview img').attr('src');
                if (imgSrc && imgSrc.startsWith('data:image')) {
                    qrImgBase64 = imgSrc.split(',')[1]; // extract base64 string only
                }

                const payload = {
                    supplierId,
                    paymentType,
                    bank,
                    accountNumber,
                    qrImg: qrImgBase64
                };
                console.log(payload);

                ajaxHelper.put(`/api/v1/suppliers/payment-method/${id}`, payload,
                    function () {
                        Swal.fire('Saved', 'Payment method updated successfully!', 'success');
                        closeOverlay();
                        loadPaymentMethods();
                    },
                    function () {
                        Swal.fire('Error', 'Failed to update payment method', 'error');
                    }
                );
            }
        });
    });

    // Initial load
    loadPaymentMethods();
});
