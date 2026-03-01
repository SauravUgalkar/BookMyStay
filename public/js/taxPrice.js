// taxPrice.js
// This script finds all elements with the class 'listing-price', reads their price, and displays the price including GST (18%).
// Usage: Add class 'listing-price' to the price element in your EJS/HTML.

document.addEventListener('DOMContentLoaded', function() {
    const GST_RATE = 0.18;
    const priceElements = document.querySelectorAll('.listing-price');
    // Create GST info elements but keep them hidden initially
    priceElements.forEach(function(el) {
        // Extract price as number (remove non-digits except dot)
        const priceText = el.textContent.replace(/[^\d.]/g, '');
        const price = parseFloat(priceText);
        if (!isNaN(price)) {
            const gstAmount = price * GST_RATE;
            const total = price + gstAmount;
            // Create GST info element
            const gstInfo = document.createElement('div');
            gstInfo.className = 'text-muted small gst-info';
            gstInfo.innerText = `With GST (18%): ₹${total.toFixed(2)}`;
            gstInfo.style.display = 'none';
            el.parentNode.insertBefore(gstInfo, el.nextSibling);
        }
    });

    // Listen for toggle switch
    const taxSwitch = document.getElementById('switchCheckDefault');
    if (taxSwitch) {
        taxSwitch.addEventListener('change', function() {
            const gstInfos = document.querySelectorAll('.gst-info');
            gstInfos.forEach(function(gstEl) {
                gstEl.style.display = taxSwitch.checked ? 'block' : 'none';
            });
        });
    }
});
