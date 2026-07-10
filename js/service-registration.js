// Validates the Service Registration form on pages/service-registration.html

const serviceRegistrationForm = document.querySelector(".service-registration-form");

serviceRegistrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const customer = document.getElementById("customer");
    const vehicle = document.getElementById("vehicle");
    const serviceDate = document.getElementById("service-date");
    const serviceBay = document.getElementById("service-bay");
    const seniorTechnician = document.getElementById("senior-technician");
    const partsTotal = document.getElementById("estimated-parts-total");
    const grandTotal = document.getElementById("estimated-grand-total");
    const serviceCheckboxes = serviceRegistrationForm.querySelectorAll("input[name='services']:checked");

    let isValid = true;

    if (isEmpty(customer.value)) {
        showError(customer, "Please select a customer.");
        isValid = false;
    } else {
        clearError(customer);
    }

    if (isEmpty(vehicle.value)) {
        showError(vehicle, "Please select a vehicle.");
        isValid = false;
    } else {
        clearError(vehicle);
    }

    const firstServiceCheckbox = serviceRegistrationForm.querySelector("input[name='services']");
    const servicesGroup = firstServiceCheckbox.closest("fieldset");
    if (serviceCheckboxes.length === 0) {
        showError(servicesGroup, "Select at least one service.");
        isValid = false;
    } else {
        clearError(servicesGroup);
    }

    if (isEmpty(serviceDate.value)) {
        showError(serviceDate, "Service date is required.");
        isValid = false;
    } else {
        const today = new Date().toISOString().split("T")[0];
        if (serviceDate.value < today) {
            showError(serviceDate, "Service date cannot be in the past.");
            isValid = false;
        } else {
            clearError(serviceDate);
        }
    }

    if (isEmpty(serviceBay.value)) {
        showError(serviceBay, "Please select a service bay.");
        isValid = false;
    } else {
        clearError(serviceBay);
    }

    if (isEmpty(seniorTechnician.value)) {
        showError(seniorTechnician, "Please select a senior technician.");
        isValid = false;
    } else {
        clearError(seniorTechnician);
    }

    if (!isEmpty(partsTotal.value) && !isValidNumberInRange(partsTotal.value, 0, 1000000000)) {
        showError(partsTotal, "Parts total cannot be a negative number.");
        isValid = false;
    } else {
        clearError(partsTotal);
    }

    if (!isEmpty(grandTotal.value) && !isValidNumberInRange(grandTotal.value, 0, 1000000000)) {
        showError(grandTotal, "Grand total cannot be a negative number.");
        isValid = false;
    } else {
        clearError(grandTotal);
    }

    if (isValid) {
        showFormSuccess(serviceRegistrationForm, "Service registered successfully!");
        serviceRegistrationForm.reset();
    }
});
