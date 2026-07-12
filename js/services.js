// Renders the Services Management stats and table on pages/services.html
// from real stored data, and wires up deleting a service.

const serviceTableBody = document.getElementById("serviceTableBody");

function mostRequestedCategory(services) {
    if (services.length === 0) {
        return "-";
    }
    // just show the first active service as "most requested" since we
    // don't track how many times each one has actually been booked
    const activeServices = services.filter(function (s) { return s.status === "active"; });
    return activeServices.length > 0 ? activeServices[0].name : services[0].name;
}

function renderServiceStats() {
    const store = getStore();
    const services = store.services;

    const active = services.filter(function (s) { return s.status === "active"; });
    const categories = [];
    services.forEach(function (s) {
        if (categories.indexOf(s.category) === -1) {
            categories.push(s.category);
        }
    });

    document.getElementById("statTotalServices").textContent = services.length;
    document.getElementById("statActiveServices").textContent = active.length;
    document.getElementById("statMostRequested").textContent = mostRequestedCategory(services);
    document.getElementById("statServiceCategories").textContent = categories.length;
}

function renderServiceTable() {
    const store = getStore();
    serviceTableBody.innerHTML = "";

    store.services.forEach(function (service) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${service.id}</td>
            <td>${service.name}</td>
            <td>${service.category}</td>
            <td>${service.price}</td>
            <td>${service.duration}</td>
            <td><span class="status-badge ${service.status}">${service.status === "active" ? "Active" : "Inactive"}</span></td>
            <td class="action-cell">
                <a href="#" class="action-icon edit"><i class="fa-solid fa-pen"></i></a>
                <a href="#" class="action-icon delete delete-service" data-id="${service.id}"><i class="fa-solid fa-trash"></i></a>
            </td>
        `;
        serviceTableBody.appendChild(row);
    });

    serviceTableBody.querySelectorAll(".delete-service").forEach(function (icon) {
        icon.addEventListener("click", function (event) {
            event.preventDefault();
            const store = getStore();
            store.services = store.services.filter(function (s) { return s.id !== icon.dataset.id; });
            saveStore(store);
            renderServices();
        });
    });
}

function renderServices() {
    renderServiceStats();
    renderServiceTable();
}

renderServices();
