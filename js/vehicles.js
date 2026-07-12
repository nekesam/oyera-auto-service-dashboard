// Validates the Vehicle Registration form and renders the Vehicle
// Records table and stats on pages/vehicles.html using real stored data.

const vehicleForm = document.querySelector(".vehicle-form");
const vehicleTableBody = document.getElementById("vehicleTableBody");

const VEHICLE_STATUS_LABEL = {
    "in-service": "In Service",
    "completed": "Completed",
    "pending": "Pending"
};

function renderVehicleStats() {
    const store = getStore();
    const vehicles = store.vehicles;

    const inService = vehicles.filter(function (v) { return v.status === "in-service"; });
    const pending = vehicles.filter(function (v) { return v.status === "pending"; });
    const completed = vehicles.filter(function (v) { return v.status === "completed"; });

    document.getElementById("statTotalVehicles").textContent = vehicles.length;
    document.getElementById("statVehiclesInService").textContent = inService.length;
    document.getElementById("statVehiclesPending").textContent = pending.length;
    document.getElementById("statVehiclesCompleted").textContent = completed.length;
}

function renderVehicleTable() {
    const store = getStore();
    vehicleTableBody.innerHTML = "";

    store.vehicles.forEach(function (vehicle) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${vehicle.id}</td>
            <td>${vehicle.plate}</td>
            <td>${vehicle.ownerName}</td>
            <td>${vehicle.make}</td>
            <td>${vehicle.model}</td>
            <td><span class="status-badge ${vehicle.status}">${VEHICLE_STATUS_LABEL[vehicle.status]}</span></td>
            <td class="action-cell">
                <a href="#" class="action-icon view" aria-label="View vehicle"><i class="fa-solid fa-eye"></i></a>
                <a href="#" class="action-icon edit" aria-label="Edit vehicle"><i class="fa-solid fa-pen"></i></a>
                <a href="#" class="action-icon delete delete-vehicle" aria-label="Delete vehicle" data-id="${vehicle.id}"><i class="fa-solid fa-trash"></i></a>
            </td>
        `;
        vehicleTableBody.appendChild(row);
    });

    vehicleTableBody.querySelectorAll(".delete-vehicle").forEach(function (icon) {
        icon.addEventListener("click", function (event) {
            event.preventDefault();
            deleteVehicle(icon.dataset.id);
            renderVehicles();
        });
    });
}

function renderVehicles() {
    renderVehicleStats();
    renderVehicleTable();
}

renderVehicles();

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

    if (!isValid) {
        return;
    }

    addVehicle({
        id: vehicleId.value.trim(),
        plate: numberPlate.value.trim(),
        make: vehicleMake.value.trim(),
        model: vehicleModel.value.trim(),
        year: Number(year.value),
        color: color.value.trim(),
        ownerName: customerName.value.trim(),
        type: vehicleType.value,
        phone: phoneNumber.value.trim()
    });

    showFormSuccess(vehicleForm, "Vehicle registered successfully!");
    vehicleForm.reset();
    renderVehicles();
});
