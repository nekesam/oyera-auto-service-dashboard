// Validates the two forms on pages/technicians.html and renders the
// Technician Records table, stats, and assignment checkboxes from real data.

const technicianForm = document.querySelector(".technician-form");
const technicianTableBody = document.getElementById("technicianTableBody");

const TECHNICIAN_STATUS_LABEL = {
    "available": "Available",
    "busy": "Busy",
    "off-duty": "Off Duty"
};

function renderTechnicianStats() {
    const store = getStore();
    const technicians = store.technicians;

    const available = technicians.filter(function (t) { return t.status === "available"; });
    const busy = technicians.filter(function (t) { return t.status === "busy"; });

    document.getElementById("statTotalTechnicians").textContent = technicians.length;
    document.getElementById("statAvailableTechnicians").textContent = available.length;
    document.getElementById("statBusyTechnicians").textContent = busy.length;
    document.getElementById("statAssignedJobs").textContent = store.assignments.length;
}

function renderTechnicianTable() {
    const store = getStore();
    technicianTableBody.innerHTML = "";

    store.technicians.forEach(function (technician) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${technician.id}</td>
            <td>${technician.firstName} ${technician.lastName}</td>
            <td>${technician.phone}</td>
            <td>${technician.specialization}</td>
            <td>${technician.experience} years</td>
            <td><span class="status-badge ${technician.status}">${TECHNICIAN_STATUS_LABEL[technician.status]}</span></td>
            <td class="action-cell">
                <a href="#" class="action-icon view" aria-label="View technician"><i class="fa-solid fa-eye"></i></a>
                <a href="#" class="action-icon edit" aria-label="Edit technician"><i class="fa-solid fa-pen"></i></a>
                <a href="#" class="action-icon delete delete-technician" aria-label="Delete technician" data-id="${technician.id}"><i class="fa-solid fa-trash"></i></a>
            </td>
        `;
        technicianTableBody.appendChild(row);
    });

    technicianTableBody.querySelectorAll(".delete-technician").forEach(function (icon) {
        icon.addEventListener("click", function (event) {
            event.preventDefault();
            deleteTechnician(icon.dataset.id);
            renderTechnicians();
        });
    });
}

function renderAssignmentCheckboxes() {
    const store = getStore();
    const checkboxContainer = document.getElementById("assignTechnicianCheckboxes");
    checkboxContainer.innerHTML = "";

    store.technicians.forEach(function (technician) {
        const label = document.createElement("label");
        label.className = "checkbox-item";
        label.innerHTML = `
            <input type="checkbox" name="assigned-technicians" value="${technician.id}">
            <span>${technician.firstName} ${technician.lastName}</span>
        `;
        checkboxContainer.appendChild(label);
    });
}

function renderTechnicians() {
    renderTechnicianStats();
    renderTechnicianTable();
    renderAssignmentCheckboxes();
}

renderTechnicians();

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

    if (!isValid) {
        return;
    }

    addTechnician({
        id: technicianId.value.trim(),
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        phone: phoneNumber.value.trim(),
        email: emailAddress.value.trim(),
        specialization: specialization.value,
        experience: Number(experience.value),
        status: status.value.toLowerCase().replace(" ", "-")
    });

    showFormSuccess(technicianForm, "Technician registered successfully!");
    technicianForm.reset();
    renderTechnicians();
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

    if (!isValid) {
        return;
    }

    const technicianIds = Array.from(technicianCheckboxes).map(function (checkbox) {
        return checkbox.value;
    });

    addAssignment({
        plateNumber: plateNumber.value.trim(),
        serviceType: serviceType.value,
        technicianIds: technicianIds
    });

    showFormSuccess(assignmentForm, "Technician assigned successfully!");
    assignmentForm.reset();
    renderTechnicianStats();
});
