// Validates the Vehicle Registration form on pages/vehicles.html

const vehicleForm = document.querySelector(".vehicle-form");

vehicleForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const vehicleId = document.getElementById("vehicle-id");
    const numberPlate = document.getElementById("number-plate");
    const vehicleMake = document.getElementById("vehicle-make");
    const vehicleModel = document.getElementById("vehicle-model");
    const year = document.getElementById("year");
    const color = document.getElementById("color");
    const customerName = document.getElementById("customer-name");
    const vehicleType = document.getElementById("vehicle-type");
    const phoneNumber = document.getElementById("phone-number");

    let isValid = true;

    if (isEmpty(vehicleId.value)) {
        showError(vehicleId, "Vehicle ID is required.");
        isValid = false;
    } else {
        clearError(vehicleId);
    }

    if (isEmpty(numberPlate.value)) {
        showError(numberPlate, "Number plate is required.");
        isValid = false;
    } else if (!isValidPlateNumber(numberPlate.value)) {
        showError(numberPlate, "Enter a valid plate number, e.g. UBA 123X.");
        isValid = false;
    } else {
        clearError(numberPlate);
    }

    if (isEmpty(vehicleMake.value)) {
        showError(vehicleMake, "Vehicle make is required.");
        isValid = false;
    } else {
        clearError(vehicleMake);
    }

    if (isEmpty(vehicleModel.value)) {
        showError(vehicleModel, "Vehicle model is required.");
        isValid = false;
    } else {
        clearError(vehicleModel);
    }

    if (isEmpty(year.value)) {
        showError(year, "Year is required.");
        isValid = false;
    } else if (!isValidNumberInRange(year.value, 1990, 2030)) {
        showError(year, "Enter a year between 1990 and 2030.");
        isValid = false;
    } else {
        clearError(year);
    }

    if (isEmpty(color.value)) {
        showError(color, "Color is required.");
        isValid = false;
    } else {
        clearError(color);
    }

    if (isEmpty(customerName.value)) {
        showError(customerName, "Customer name is required.");
        isValid = false;
    } else if (!isValidName(customerName.value)) {
        showError(customerName, "Customer name should only contain letters.");
        isValid = false;
    } else {
        clearError(customerName);
    }

    if (isEmpty(vehicleType.value)) {
        showError(vehicleType, "Please select a vehicle type.");
        isValid = false;
    } else {
        clearError(vehicleType);
    }

    if (isEmpty(phoneNumber.value)) {
        showError(phoneNumber, "Phone number is required.");
        isValid = false;
    } else if (!isValidPhone(phoneNumber.value)) {
        showError(phoneNumber, "Enter a valid phone number, e.g. 0700000000.");
        isValid = false;
    } else {
        clearError(phoneNumber);
    }

    if (isValid) {
        showFormSuccess(vehicleForm, "Vehicle registered successfully!");
        vehicleForm.reset();
    }
});
