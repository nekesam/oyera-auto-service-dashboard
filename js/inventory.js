// Renders the Inventory page from real stored data and lets you add or
// remove stock items.

const inventoryForm = document.querySelector(".inventory-form");
const inventoryTableBody = document.getElementById("inventoryTableBody");

function renderInventoryStats() {
    const store = getStore();
    const items = store.inventory;

    const categories = [];
    items.forEach(function (item) {
        if (categories.indexOf(item.category) === -1) {
            categories.push(item.category);
        }
    });

    const lowStock = items.filter(function (item) { return item.quantity <= item.reorderLevel; });

    document.getElementById("statTotalItems").textContent = items.length;
    document.getElementById("statCategories").textContent = categories.length;
    document.getElementById("statLowStock").textContent = lowStock.length;
}

function renderInventoryTable() {
    const store = getStore();
    inventoryTableBody.innerHTML = "";

    store.inventory.forEach(function (item) {
        const isLow = item.quantity <= item.reorderLevel;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity} ${item.unit}</td>
            <td><span class="status-badge ${isLow ? "in-service" : "completed"}">${isLow ? "Low Stock" : "In Stock"}</span></td>
            <td class="action-cell">
                <a href="#" class="action-icon delete delete-item" data-id="${item.id}"><i class="fa-solid fa-trash"></i></a>
            </td>
        `;
        inventoryTableBody.appendChild(row);
    });

    inventoryTableBody.querySelectorAll(".delete-item").forEach(function (icon) {
        icon.addEventListener("click", function (event) {
            event.preventDefault();
            deleteInventoryItem(icon.dataset.id);
            renderInventory();
        });
    });
}

function renderInventory() {
    renderInventoryStats();
    renderInventoryTable();
}

renderInventory();

inventoryForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("item-name");
    const category = document.getElementById("item-category");
    const quantity = document.getElementById("item-quantity");
    const unit = document.getElementById("item-unit");
    const reorder = document.getElementById("item-reorder");

    let isValid = true;

    if (isEmpty(name.value)) {
        showError(name, "Item name is required.");
        isValid = false;
    } else {
        clearError(name);
    }

    if (isEmpty(category.value)) {
        showError(category, "Category is required.");
        isValid = false;
    } else {
        clearError(category);
    }

    if (isEmpty(quantity.value)) {
        showError(quantity, "Quantity is required.");
        isValid = false;
    } else if (!isValidNumberInRange(quantity.value, 0, 100000)) {
        showError(quantity, "Quantity cannot be negative.");
        isValid = false;
    } else {
        clearError(quantity);
    }

    if (isEmpty(unit.value)) {
        showError(unit, "Unit is required.");
        isValid = false;
    } else {
        clearError(unit);
    }

    if (isEmpty(reorder.value)) {
        showError(reorder, "Reorder level is required.");
        isValid = false;
    } else if (!isValidNumberInRange(reorder.value, 0, 100000)) {
        showError(reorder, "Reorder level cannot be negative.");
        isValid = false;
    } else {
        clearError(reorder);
    }

    if (!isValid) {
        return;
    }

    addInventoryItem({
        name: name.value.trim(),
        category: category.value.trim(),
        quantity: Number(quantity.value),
        unit: unit.value.trim(),
        reorderLevel: Number(reorder.value)
    });

    showFormSuccess(inventoryForm, "Inventory item added!");
    inventoryForm.reset();
    renderInventory();
});
