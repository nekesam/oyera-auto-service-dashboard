// Validates the Customer Registration form and renders the Customer
// Records table on pages/customers.html using real stored data.

const customerForm = document.querySelector(".customer-form");
const customerIdField = document.getElementById("customer-id");
const customerTableBody = document.getElementById("customerTableBody");

function renderCustomerTable() {
    const store = getStore();
    customerTableBody.innerHTML = "";

    store.customers.forEach(function (customer) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.firstName} ${customer.lastName}</td>
            <td>${customer.phone}</td>
            <td>${customer.vehiclesOwned}</td>
            <td><span class="status-badge ${customer.status}">${customer.status === "active" ? "Active" : "Inactive"}</span></td>
            <td>
                <i class="fas fa-eye" title="View"></i>
                <i class="fas fa-pen" title="Edit"></i>
                <i class="fas fa-trash delete-customer" title="Delete" data-id="${customer.id}"></i>
            </td>
        `;
        customerTableBody.appendChild(row);
    });

    // next customer id preview, shown as read-only in the form
    customerIdField.value = "C" + String(store.customers.length + 1).padStart(3, "0");

    customerTableBody.querySelectorAll(".delete-customer").forEach(function (icon) {
        icon.addEventListener("click", function () {
            deleteCustomer(icon.dataset.id);
            renderCustomerTable();
        });
    });
}

renderCustomerTable();

customerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const address = document.getElementById("address");

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

    if (!isValid) {
        return;
    }

    addCustomer({
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        address: address.value.trim()
    });

    showFormSuccess(customerForm, "Customer details look good!");
    customerForm.reset();
    renderCustomerTable();
});
