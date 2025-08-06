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

    // Submenu Toggle Logic (Keep this as is)
    // These toggles handle showing/hiding submenus and rotating the chevron.
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

    // --- Active Class Management on Click ---
    // This handler will apply the 'active' class immediately on click,
    // which gives instant visual feedback. When a full page reload occurs,
    // Thymeleaf will then take over and set the active state for the new page.
    $('.nav-item-wrapper').on('click', function(e) {
        // Prevent active state change if clicking directly on a submenu toggle
        // or inside an already open submenu (if you want the active state to apply only to the top-level click).
        // The .product-toggle etc. already preventDefault.
        // We want to ensure that clicking a *link* within a submenu also activates its parent.

        // Find the closest 'a' tag that is a direct nav-link (not a submenu toggle itself if it opens a menu)
        const clickedLink = $(e.target).closest('a.nav-link');

        // Check if the click was on a nav-link (or an icon/text within it) that is NOT a submenu toggle
        if (clickedLink.length && !clickedLink.hasClass('product-toggle') &&
            !clickedLink.hasClass('inventory-toggle') &&
            !clickedLink.hasClass('orders-toggle') &&
            !clickedLink.hasClass('more-orders-toggle')) {

            // Remove 'active' from all nav-item-wrappers first
            $('.nav-item-wrapper').removeClass('active');

            // Add 'active' to the clicked wrapper
            $(this).addClass('active');

            // If the clicked link is inside a submenu, ensure its parent wrapper also gets 'active'
            // (The `open` class is handled by the slideToggle, but 'active' needs explicit management for parents)
            // This line ensures that even if you click "Brand" (a child), "Product" (its parent wrapper) also appears active.
            $(this).parents('.nav-item-wrapper').addClass('active');

        } else if (!$(e.target).closest('.product-menu, .inventory-menu, .orders-menu, .more-orders-menu').length) {
            // This part handles clicks on the top-level nav-item-wrapper itself,
            // but not on the submenu links or the submenu toggles
            $('.nav-item-wrapper').removeClass('active');
            $(this).addClass('active');
        }
    });

    // --- Ensure correct active state on initial load for direct links ---
    // This helps if a direct link (like Dashboard) needs to be highlighted immediately
    // after a full page load if Thymeleaf applied the 'active' class.
    // However, the Thymeleaf setup in the HTML handles this primarily.
    // This part is more for consistency if you modify how 'active' is handled in JS.
    // For your current setup with full page reloads, this isn't strictly necessary
    // because Thymeleaf correctly renders the initial state.
    // If you add AJAX navigation later, this kind of logic becomes very important.
});