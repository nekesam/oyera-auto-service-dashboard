// Validates the two forms on pages/technicians.html:
// 1. Technician Registration form
// 2. Assign Technician to Service form

const technicianForm = document.querySelector(".technician-form");

technicianForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const technicianId = document.getElementById("technician-id");
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const phoneNumber = document.getElementById("phone-number");
    const emailAddress = document.getElementById("email-address");
    const specialization = document.getElementById("specialization");
    const experience = document.getElementById("experience");
    const status = document.getElementById("status");

    let isValid = true;

    if (isEmpty(technicianId.value)) {
        showError(technicianId, "Technician ID is required.");
        isValid = false;
    } else {
        clearError(technicianId);
    }

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

    if (isEmpty(phoneNumber.value)) {
        showError(phoneNumber, "Phone number is required.");
        isValid = false;
    } else if (!isValidPhone(phoneNumber.value)) {
        showError(phoneNumber, "Enter a valid phone number, e.g. 0700123456.");
        isValid = false;
    } else {
        clearError(phoneNumber);
    }

    if (isEmpty(emailAddress.value)) {
        showError(emailAddress, "Email address is required.");
        isValid = false;
    } else if (!isValidEmail(emailAddress.value)) {
        showError(emailAddress, "Enter a valid email address.");
        isValid = false;
    } else {
        clearError(emailAddress);
    }

    if (isEmpty(specialization.value)) {
        showError(specialization, "Please select a specialization.");
        isValid = false;
    } else {
        clearError(specialization);
    }

    if (isEmpty(experience.value)) {
        showError(experience, "Years of experience is required.");
        isValid = false;
    } else if (!isValidNumberInRange(experience.value, 0, 40)) {
        showError(experience, "Enter a number of years between 0 and 40.");
        isValid = false;
    } else {
        clearError(experience);
    }

    if (isEmpty(status.value)) {
        showError(status, "Please select a status.");
        isValid = false;
    } else {
        clearError(status);
    }

    if (isValid) {
        showFormSuccess(technicianForm, "Technician registered successfully!");
        technicianForm.reset();
    }
});

const assignmentForm = document.querySelector(".assignment-form");

assignmentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const plateNumber = document.getElementById("plate-number");
    const serviceType = document.getElementById("service-type");
    const technicianCheckboxes = assignmentForm.querySelectorAll("input[name='assigned-technicians']:checked");

    let isValid = true;

    if (isEmpty(plateNumber.value)) {
        showError(plateNumber, "Vehicle number plate is required.");
        isValid = false;
    } else if (!isValidPlateNumber(plateNumber.value)) {
        showError(plateNumber, "Enter a valid plate number, e.g. UBA 472M.");
        isValid = false;
    } else {
        clearError(plateNumber);
    }

    if (isEmpty(serviceType.value)) {
        showError(serviceType, "Please select a service type.");
        isValid = false;
    } else {
        clearError(serviceType);
    }

    const firstCheckbox = assignmentForm.querySelector("input[name='assigned-technicians']");
    const checkboxGroup = firstCheckbox.closest(".form-group");
    if (technicianCheckboxes.length === 0) {
        showError(checkboxGroup, "Select at least one technician.");
        isValid = false;
    } else {
        clearError(checkboxGroup);
    }

    if (isValid) {
        showFormSuccess(assignmentForm, "Technician assigned successfully!");
        assignmentForm.reset();
    }
});
