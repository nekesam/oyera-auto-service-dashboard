// Shows a simple summary across all the real stored data.

const store = getStore();

document.getElementById("statCustomers").textContent = store.customers.length;
document.getElementById("statVehicles").textContent = store.vehicles.length;
document.getElementById("statTechnicians").textContent = store.technicians.length;
document.getElementById("statJobs").textContent = store.serviceJobs.length;

let paidRevenue = 0;
let pendingRevenue = 0;

store.serviceJobs.forEach(function (job) {
    if (job.paymentStatus === "paid") {
        paidRevenue += job.grandTotal || 0;
    } else {
        pendingRevenue += job.grandTotal || 0;
    }
});

document.getElementById("reportPaidRevenue").textContent = "UGX " + paidRevenue.toLocaleString();
document.getElementById("reportPendingRevenue").textContent = "UGX " + pendingRevenue.toLocaleString();
