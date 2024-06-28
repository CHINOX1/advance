document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculateButton');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const quoteTotal = document.getElementById('quoteTotal');

    calculateButton.addEventListener('click', function() {
        let total = 0;
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                total += parseInt(checkbox.value);
            }
        });
        quoteTotal.textContent = total + " CLP";
    });
});
