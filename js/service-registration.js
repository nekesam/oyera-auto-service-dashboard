// Fills the Service Registration form's dropdowns and checkboxes from real
// stored data, keeps the Service Summary panel live as the form is filled
// in, validates on submit, and saves the job to the shared store.

const serviceRegistrationForm = document.querySelector(".service-registration-form");
const customerSelect = document.getElementById("customer");
const vehicleSelect = document.getElementById("vehicle");
const servicesCheckboxList = document.getElementById("servicesCheckboxList");
const techniciansCheckboxList = document.getElementById("techniciansCheckboxList");
const seniorTechnicianSelect = document.getElementById("senior-technician");
const serviceIdField = document.getElementById("service-id");
const partsTotalField = document.getElementById("estimated-parts-total");
const grandTotalField = document.getElementById("estimated-grand-total");
const paymentStatusSelect = document.getElementById("payment-status");

const LABOUR_CHARGE = 20000;

function fillDropdownsAndCheckboxes() {
    const store = getStore();

    customerSelect.innerHTML = '<option value="">Select customer</option>';
    store.customers.forEach(function (customer) {
        const option = document.createElement("option");
        option.value = customer.id;
        option.textContent = customer.firstName + " " + customer.lastName;
        customerSelect.appendChild(option);
    });

    vehicleSelect.innerHTML = '<option value="">Select vehicle</option>';
    store.vehicles.forEach(function (vehicle) {
        const option = document.createElement("option");
        option.value = vehicle.id;
        option.textContent = vehicle.plate + " - " + vehicle.make + " " + vehicle.model;
        vehicleSelect.appendChild(option);
    });

    servicesCheckboxList.innerHTML = "";
    store.services.forEach(function (service) {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" name="services" value="${service.id}"> ${service.name}`;
        servicesCheckboxList.appendChild(label);
    });

    techniciansCheckboxList.innerHTML = "";
    store.technicians.forEach(function (technician) {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" name="technicians" value="${technician.id}"> ${technician.firstName} ${technician.lastName}`;
        techniciansCheckboxList.appendChild(label);
    });

    seniorTechnicianSelect.innerHTML = '<option value="">Select technician</option>';
    store.technicians.forEach(function (technician) {
        const option = document.createElement("option");
        option.value = technician.id;
        option.textContent = technician.firstName + " " + technician.lastName;
        seniorTechnicianSelect.appendChild(option);
    });

    serviceIdField.value = "SRV-" + todayDate().replace(/-/g, "") + "-" + String(store.serviceJobs.length + 1).padStart(3, "0");
}

function updateSummary() {
    const selectedCustomer = customerSelect.options[customerSelect.selectedIndex];
    const selectedVehicle = vehicleSelect.options[vehicleSelect.selectedIndex];
    const checkedServices = serviceRegistrationForm.querySelectorAll("input[name='services']:checked");
    const checkedTechnicians = serviceRegistrationForm.querySelectorAll("input[name='technicians']:checked");

    document.getElementById("summaryCustomer").textContent = customerSelect.value ? selectedCustomer.textContent : "Not selected";
    document.getElementById("summaryVehicle").textContent = vehicleSelect.value ? selectedVehicle.textContent : "Not selected";
    document.getElementById("summaryServiceCount").textContent = checkedServices.length;
    document.getElementById("summaryTechnicianCount").textContent = checkedTechnicians.length;
    document.getElementById("summaryLabour").textContent = "UGX " + LABOUR_CHARGE.toLocaleString();

    const partsTotal = isEmpty(partsTotalField.value) ? 0 : Number(partsTotalField.value);
    const grandTotal = isEmpty(grandTotalField.value) ? (LABOUR_CHARGE + partsTotal) : Number(grandTotalField.value);
    document.getElementById("summaryTotal").textContent = "UGX " + grandTotal.toLocaleString();

    const paymentBadge = document.getElementById("summaryPaymentStatus");
    paymentBadge.textContent = paymentStatusSelect.options[paymentStatusSelect.selectedIndex].textContent;
    paymentBadge.className = "status-badge " + (paymentStatusSelect.value === "paid" ? "active" : "inactive");
}

fillDropdownsAndCheckboxes();
updateSummary();

serviceRegistrationForm.addEventListener("change", updateSummary);
partsTotalField.addEventListener("input", updateSummary);
grandTotalField.addEventListener("input", updateSummary);

serviceRegistrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const serviceDate = document.getElementById("service-date");
    const serviceBay = document.getElementById("service-bay");
    const seniorTechnician = seniorTechnicianSelect;
    const partsTotal = partsTotalField;
    const grandTotal = grandTotalField;
    const serviceCheckboxes = serviceRegistrationForm.querySelectorAll("input[name='services']:checked");

    let isValid = true;

    if (isEmpty(customerSelect.value)) {
        showError(customerSelect, "Please select a customer.");
        isValid = false;
    } else {
        clearError(customerSelect);
    }

    if (isEmpty(vehicleSelect.value)) {
        showError(vehicleSelect, "Please select a vehicle.");
        isValid = false;
    } else {
        clearError(vehicleSelect);
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
        const today = todayDate();
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

    if (!isValid) {
        return;
    }

    const selectedVehicleText = vehicleSelect.options[vehicleSelect.selectedIndex].textContent;
    const serviceNames = Array.from(serviceCheckboxes).map(function (box) {
        return box.parentElement.textContent.trim();
    });
    const technicianCheckboxes = serviceRegistrationForm.querySelectorAll("input[name='technicians']:checked");
    const technicianNames = Array.from(technicianCheckboxes).map(function (box) {
        return box.parentElement.textContent.trim();
    });
    const partsTotalValue = isEmpty(partsTotal.value) ? 0 : Number(partsTotal.value);
    const grandTotalValue = isEmpty(grandTotal.value) ? (LABOUR_CHARGE + partsTotalValue) : Number(grandTotal.value);

    addServiceJob({
        carType: selectedVehicleText,
        customer: customerSelect.value,
        vehicle: vehicleSelect.value,
        services: serviceNames,
        technicians: technicianNames,
        date: serviceDate.value,
        status: document.getElementById("service-status").value,
        paymentStatus: paymentStatusSelect.value,
        partsQuantity: isEmpty(document.getElementById("parts-quantity").value) ? 0 : Number(document.getElementById("parts-quantity").value),
        grandTotal: grandTotalValue
    });

    showFormSuccess(serviceRegistrationForm, "Service registered successfully!");
    serviceRegistrationForm.reset();
    fillDropdownsAndCheckboxes();
    updateSummary();
});
