// Validates the Customer Registration form on pages/customers.html

const customerForm = document.querySelector(".customer-form");

customerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");

    let isValid = true;

    if (isEmpty(firstName.value)) {
        showError(firstName, "First name is required.");
        isValid = false;
    } else if (!isValidName(firstName.value)) {
        showError(firstName, "First name should only contain letters.");
        isValid = false;
    } else {
        clearError(firstName);
    }

    if (isEmpty(lastName.value)) {
        showError(lastName, "Last name is required.");
        isValid = false;
    } else if (!isValidName(lastName.value)) {
        showError(lastName, "Last name should only contain letters.");
        isValid = false;
    } else {
        clearError(lastName);
    }

    if (isEmpty(phone.value)) {
        showError(phone, "Phone number is required.");
        isValid = false;
    } else if (!isValidPhone(phone.value)) {
        showError(phone, "Enter a valid phone number, e.g. 0700123456.");
        isValid = false;
    } else {
        clearError(phone);
    }

    // Email is optional, but if it's filled in it must look like a real email
    if (!isEmpty(email.value) && !isValidEmail(email.value)) {
        showError(email, "Enter a valid email address.");
        isValid = false;
    } else {
        clearError(email);
    }

    if (isValid) {
        showFormSuccess(customerForm, "Customer details look good!");
        customerForm.reset();
    }
});
