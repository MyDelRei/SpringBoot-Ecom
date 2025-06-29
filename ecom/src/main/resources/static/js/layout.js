$(document).ready(function() {

    function openSidebar() {
        $('#sidebar').removeClass('-translate-x-full').addClass('translate-x-0');
    }


    function closeSidebar() {
        $('#sidebar').removeClass('translate-x-0').addClass('-translate-x-full');
    }



    $('#openSidebar').on('click', function() {
        openSidebar();
    });



    $('#closeSidebar').on('click', function() {
        closeSidebar();
    });


    $('.product-toggle').on('click', function(e) {
        e.preventDefault();
        $(this).parent().toggleClass('open');
        $(this).next('.product-menu').slideToggle('fast');
    });


    $('.inventory-toggle').on('click', function(e) {
        e.preventDefault();
        $(this).parent().toggleClass('open');
        $(this).next('.inventory-menu').slideToggle('fast');
    });


    $('.orders-toggle').on('click', function(e) {
        e.preventDefault();
        $(this).parent().toggleClass('open');
        $(this).next('.orders-menu').slideToggle('fast');
    });


    $('.more-orders-toggle').on('click', function(e) {
        e.preventDefault();
        $(this).parent().toggleClass('open');
        $(this).next('.more-orders-menu').slideToggle('fast');
    });


    $('.nav-item-wrapper').on('click', function(e) {

        if (!$(e.target).closest('.product-menu, .inventory-menu, .orders-menu, .more-orders-menu').length) {
            $('.nav-item-wrapper').removeClass('active');
            $(this).addClass('active');
        }
    });
});