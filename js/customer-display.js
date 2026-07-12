// Renders the Customer Display page from the same shared customer data
// used on the Customer Registration page, so both pages always agree.

function renderCustomerDisplayStats() {
    const store = getStore();
    const customers = store.customers;

    const active = customers.filter(function (c) { return c.status === "active"; });
    const newToday = customers.filter(function (c) { return c.lastVisit === todayDate(); });
    let totalVehicles = 0;
    for (let i = 0; i < customers.length; i++) {
        totalVehicles += customers[i].vehiclesOwned;
    }

    document.getElementById("statTotalCustomers").textContent = customers.length;
    document.getElementById("statActiveCustomers").textContent = active.length;
    document.getElementById("statNewCustomers").textContent = newToday.length;
    document.getElementById("statRegisteredVehicles").textContent = totalVehicles;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function renderCustomerDisplayTable() {
    const store = getStore();
    const tableBody = document.getElementById("customerDisplayTableBody");
    tableBody.innerHTML = "";

    store.customers.forEach(function (customer) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.firstName} ${customer.lastName}</td>
            <td>${customer.phone}</td>
            <td>${customer.vehiclesOwned}</td>
            <td>${formatDate(customer.lastVisit)}</td>
            <td><span class="status-badge ${customer.status}">${customer.status === "active" ? "Active" : "Inactive"}</span></td>
            <td class="action-cell">
                <a href="#" class="action-icon view"><i class="fa-solid fa-eye"></i></a>
                <a href="#" class="action-icon edit"><i class="fa-solid fa-pen"></i></a>
                <a href="#" class="action-icon delete delete-customer" data-id="${customer.id}"><i class="fa-solid fa-trash"></i></a>
            </td>
        `;
        tableBody.appendChild(row);
    });

    tableBody.querySelectorAll(".delete-customer").forEach(function (icon) {
        icon.addEventListener("click", function (event) {
            event.preventDefault();
            deleteCustomer(icon.dataset.id);
            renderCustomerDisplay();
        });
    });
}

function renderCustomerDisplay() {
    renderCustomerDisplayStats();
    renderCustomerDisplayTable();
}

renderCustomerDisplay();
