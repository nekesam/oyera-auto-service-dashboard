// Renders invoice records from the same service jobs created on the
// dashboard and Service Registration page - no separate invoice data,
// it's just the payment side of the same real jobs.

const PAYMENT_LABEL = {
    "paid": "Paid",
    "partial": "Partial",
    "unpaid": "Unpaid"
};

function renderInvoiceStats() {
    const store = getStore();
    const jobs = store.serviceJobs;

    const paid = jobs.filter(function (job) { return job.paymentStatus === "paid"; });
    const unpaid = jobs.filter(function (job) { return job.paymentStatus !== "paid"; });

    let totalRevenue = 0;
    for (let i = 0; i < paid.length; i++) {
        totalRevenue += paid[i].grandTotal || 0;
    }

    document.getElementById("statTotalInvoices").textContent = jobs.length;
    document.getElementById("statPaidInvoices").textContent = paid.length;
    document.getElementById("statUnpaidInvoices").textContent = unpaid.length;
    document.getElementById("statTotalRevenue").textContent = "UGX " + totalRevenue.toLocaleString();
}

function renderInvoiceTable() {
    const store = getStore();
    const tableBody = document.getElementById("invoiceTableBody");
    tableBody.innerHTML = "";

    store.serviceJobs.forEach(function (job) {
        const status = job.paymentStatus || "unpaid";
        const badgeClass = status === "paid" ? "completed" : (status === "partial" ? "in-service" : "pending");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${job.id}</td>
            <td>${job.carType}</td>
            <td>${job.services.join(", ")}</td>
            <td>${(job.grandTotal || 0).toLocaleString()}</td>
            <td><span class="status-badge ${badgeClass}">${PAYMENT_LABEL[status]}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

renderInvoiceStats();
renderInvoiceTable();
