// Shared data store for the Oyera Bay Service dashboard.
// Everything is kept in localStorage under one key, so every page reads
// and writes the same real data instead of showing hardcoded numbers.

const STORE_KEY = "oyeraStore";

function getDefaultStore() {
    return {
        customers: [
            { id: "C001", firstName: "John", lastName: "Doe", phone: "0701234567", email: "", address: "", vehiclesOwned: 2, lastVisit: "2026-06-12", status: "active" },
            { id: "C002", firstName: "Mary", lastName: "Namusoke", phone: "0780000000", email: "", address: "", vehiclesOwned: 1, lastVisit: "2026-06-01", status: "active" },
            { id: "C003", firstName: "Peter", lastName: "Okello", phone: "0750000000", email: "", address: "", vehiclesOwned: 3, lastVisit: "2026-01-10", status: "inactive" },
            { id: "C004", firstName: "Sarah", lastName: "Achieng", phone: "0771234567", email: "", address: "", vehiclesOwned: 2, lastVisit: "2026-06-20", status: "active" },
            { id: "C005", firstName: "David", lastName: "Okello", phone: "0759876543", email: "", address: "", vehiclesOwned: 1, lastVisit: "2026-06-18", status: "active" }
        ],
        vehicles: [
            { id: "VH-1024", plate: "UBA 421D", make: "Honda", model: "Civic", year: 2019, color: "Black", ownerName: "Sarah K.", type: "small", phone: "0700000000", status: "in-service" },
            { id: "VH-1025", plate: "UBG 990Q", make: "Toyota", model: "RAV4", year: 2021, color: "White", ownerName: "Michael O.", type: "small", phone: "0700000001", status: "completed" },
            { id: "VH-1026", plate: "UBM 315N", make: "Nissan", model: "X-Trail", year: 2020, color: "Silver", ownerName: "Esther T.", type: "small", phone: "0700000002", status: "pending" }
        ],
        technicians: [
            { id: "TECH-1001", firstName: "Samuel", lastName: "Otema", phone: "0770400122", email: "samuel.otema@oasbay.com", specialization: "Engine Service", experience: 8, status: "available" },
            { id: "TECH-1002", firstName: "Harriet", lastName: "Namata", phone: "0752313408", email: "harriet.namata@oasbay.com", specialization: "Brake Service", experience: 6, status: "busy" },
            { id: "TECH-1003", firstName: "Peter", lastName: "Lubega", phone: "0709885221", email: "peter.lubega@oasbay.com", specialization: "Wheel Alignment", experience: 9, status: "off-duty" },
            { id: "TECH-1004", firstName: "Esther", lastName: "Akullo", phone: "0784297541", email: "esther.akullo@oasbay.com", specialization: "Wheel Balancing", experience: 5, status: "available" },
            { id: "TECH-1005", firstName: "John Bosco", lastName: "Ocen", phone: "0714654209", email: "johnbosco.ocen@oasbay.com", specialization: "General Maintenance", experience: 11, status: "busy" }
        ],
        services: [
            { id: "S001", name: "Engine Oil Change", category: "Lubrication", price: "79,000 - 200,000", duration: "30 Minutes", status: "active" },
            { id: "S002", name: "Engine Oil Filter Replacement", category: "Filters", price: "15,000 - 20,000", duration: "15 Minutes", status: "active" },
            { id: "S003", name: "Gearbox Oil Change", category: "Lubrication", price: "79,000 - 200,000", duration: "40 Minutes", status: "active" },
            { id: "S004", name: "Gearbox Filter Replacement", category: "Filters", price: "15,000 - 20,000", duration: "20 Minutes", status: "active" },
            { id: "S005", name: "Brake Fluid Replacement", category: "Fluids", price: "13,000 - 20,000", duration: "20 Minutes", status: "active" },
            { id: "S006", name: "Brake Pad Replacement", category: "Repairs", price: "Varies", duration: "45 Minutes", status: "active" },
            { id: "S007", name: "Greasing", category: "Lubrication", price: "Varies", duration: "20 Minutes", status: "active" },
            { id: "S008", name: "Wheel Alignment", category: "Wheel Service", price: "30,000", duration: "45 Minutes", status: "active" },
            { id: "S009", name: "Wheel Balancing", category: "Wheel Service", price: "20,000", duration: "30 Minutes", status: "active" }
        ],
        inventory: [
            { id: "INV001", name: "Shell Helix 5W30", category: "Engine Oil", quantity: 42, unit: "litres", reorderLevel: 15 },
            { id: "INV002", name: "Total Quartz 10W40", category: "Engine Oil", quantity: 30, unit: "litres", reorderLevel: 15 },
            { id: "INV003", name: "Toyota Oil Filter", category: "Filters", quantity: 18, unit: "pieces", reorderLevel: 10 },
            { id: "INV004", name: "Mazda Oil Filter", category: "Filters", quantity: 6, unit: "pieces", reorderLevel: 10 },
            { id: "INV005", name: "DOT 3 Brake Fluid", category: "Fluids", quantity: 25, unit: "litres", reorderLevel: 10 },
            { id: "INV006", name: "Ceramic Front Brake Pads", category: "Brake Parts", quantity: 9, unit: "sets", reorderLevel: 8 }
        ],
        serviceJobs: [
            { id: "SRV-1001", carType: "Toyota Hiace", customer: "", vehicle: "", services: ["Brake Pad Replacement", "Engine Oil Change"], technicians: ["John"], date: todayDate(), status: "in-progress", paymentStatus: "unpaid", partsQuantity: 2, grandTotal: 65000, createdAt: Date.now() - 3600000 },
            { id: "SRV-1002", carType: "Isuzu Truck", customer: "", vehicle: "", services: ["Wheel Alignment"], technicians: ["Sarah"], date: todayDate(), status: "in-progress", paymentStatus: "unpaid", partsQuantity: 0, grandTotal: 30000, createdAt: Date.now() - 1800000 }
        ],
        assignments: [
            { plateNumber: "UBA 421D", serviceType: "Engine Oil Change", technicianIds: ["TECH-1001"] },
            { plateNumber: "UBG 990Q", serviceType: "Wheel Alignment", technicianIds: ["TECH-1003"] }
        ]
    };
}

function todayDate() {
    return new Date().toISOString().split("T")[0];
}

function getStore() {
    const saved = localStorage.getItem(STORE_KEY);
    if (!saved) {
        const defaultStore = getDefaultStore();
        saveStore(defaultStore);
        return defaultStore;
    }
    return JSON.parse(saved);
}

function saveStore(store) {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function generateId(prefix, list) {
    const number = list.length + 1;
    return `${prefix}${String(number).padStart(3, "0")}`;
}

// ----- Customers -----
function addCustomer(customer) {
    const store = getStore();
    customer.id = "C" + String(store.customers.length + 1).padStart(3, "0");
    customer.vehiclesOwned = 0;
    customer.lastVisit = todayDate();
    customer.status = "active";
    store.customers.push(customer);
    saveStore(store);
    return customer;
}

function deleteCustomer(id) {
    const store = getStore();
    store.customers = store.customers.filter(function (c) { return c.id !== id; });
    saveStore(store);
}

// ----- Vehicles -----
function addVehicle(vehicle) {
    const store = getStore();
    vehicle.status = "pending";
    store.vehicles.push(vehicle);
    saveStore(store);
    return vehicle;
}

function deleteVehicle(id) {
    const store = getStore();
    store.vehicles = store.vehicles.filter(function (v) { return v.id !== id; });
    saveStore(store);
}

// ----- Technicians -----
function addTechnician(technician) {
    const store = getStore();
    store.technicians.push(technician);
    saveStore(store);
    return technician;
}

function deleteTechnician(id) {
    const store = getStore();
    store.technicians = store.technicians.filter(function (t) { return t.id !== id; });
    saveStore(store);
}

// ----- Technician assignments -----
function addAssignment(assignment) {
    const store = getStore();
    store.assignments.push(assignment);
    saveStore(store);
    return assignment;
}

// ----- Service jobs (from the dashboard quick form and Service Registration page) -----
function addServiceJob(job) {
    const store = getStore();
    job.id = generateId("SRV-10", store.serviceJobs) + Math.floor(Math.random() * 90 + 10);
    job.createdAt = Date.now();
    store.serviceJobs.push(job);
    saveStore(store);
    return job;
}

function deleteServiceJob(id) {
    const store = getStore();
    store.serviceJobs = store.serviceJobs.filter(function (j) { return j.id !== id; });
    saveStore(store);
}

// ----- Inventory -----
function addInventoryItem(item) {
    const store = getStore();
    item.id = generateId("INV", store.inventory);
    store.inventory.push(item);
    saveStore(store);
    return item;
}

function deleteInventoryItem(id) {
    const store = getStore();
    store.inventory = store.inventory.filter(function (i) { return i.id !== id; });
    saveStore(store);
}
