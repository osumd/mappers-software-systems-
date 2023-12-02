function validateMoney() {

    var moneyInput = document.forms["manualForm"]["money"].value;
    // Custom validation for money format (e.g., digits and optional decimal point)
    var moneyRegex = /^\d+(\.\d+)?$/;

    if (!moneyRegex.test(moneyInput)) {
        alert("Please enter a valid money amount (digits and optional two decimal places).");
        return false;
    }

    // You can add more validations for other fields if needed

    return true;
}