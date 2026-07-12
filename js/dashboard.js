// Renders the main dashboard stats and active jobs list from real stored data,
// and lets the quick service form actually create a new job.

function isToday(timestamp) {
    const jobDate = new Date(timestamp).toDateString();
    const today = new Date().toDateString();
    return jobDate === today;
}

function renderDashboardStats() {
    const store = getStore();
    const jobs = store.serviceJobs;

    const jobsToday = jobs.filter(function (job) { return isToday(job.createdAt); });

    let revenueToday = 0;
    for (let i = 0; i < jobsToday.length; i++) {
        revenueToday += jobsToday[i].grandTotal || 0;
    }

    const activeJobs = jobs.filter(function (job) {
        return job.status === "in-progress" || job.status === "pending";
    });

    let partsSold = 0;
    for (let i = 0; i < jobs.length; i++) {
        partsSold += jobs[i].partsQuantity || 0;
    }

    document.getElementById("statCarsToday").textContent = jobsToday.length;
    document.getElementById("statRevenue").textContent = "UGX " + revenueToday.toLocaleString();
    document.getElementById("statActiveJobs").textContent = activeJobs.length;
    document.getElementById("statPartsSold").textContent = partsSold;
}

function renderActiveJobs() {
    const store = getStore();
    const jobsList = document.getElementById("activeJobsList");

    // newest jobs first, only show the 5 most recent
    const jobs = store.serviceJobs.slice().reverse().slice(0, 5);

    // remove any job cards from a previous render, but keep the heading
    const oldCards = jobsList.querySelectorAll(".job-card");
    oldCards.forEach(function (card) { card.remove(); });

    if (jobs.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No service jobs yet.";
        jobsList.appendChild(emptyMessage);
        return;
    }

    jobs.forEach(function (job) {
        const card = document.createElement("div");
        card.className = "job-card";
        card.innerHTML = `
            <p><strong>Car:</strong> ${job.carType}</p>
            <p><strong>Technician:</strong> ${job.technicians.join(", ")}</p>
            <p><strong>Service:</strong> ${job.services.join(" + ")}</p>
        `;
        jobsList.appendChild(card);
    });
}

function renderDashboard() {
    renderDashboardStats();
    renderActiveJobs();
}

renderDashboard();

const quickServiceForm = document.getElementById("quickServiceForm");

quickServiceForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const carType = document.getElementById("quickCarType");
    const serviceType = document.getElementById("quickServiceType");
    const technician = document.getElementById("quickTechnician");
    const parts = document.getElementById("quickParts");

    let isValid = true;

    if (isEmpty(carType.value)) {
        showError(carType, "Car type is required.");
        isValid = false;
    } else {
        clearError(carType);
    }

    if (isEmpty(serviceType.value)) {
        showError(serviceType, "Please select a service.");
        isValid = false;
    } else {
        clearError(serviceType);
    }

    if (isEmpty(technician.value)) {
        showError(technician, "Assigned technician is required.");
        isValid = false;
    } else {
        clearError(technician);
    }

    if (!isValid) {
        return;
    }

    addServiceJob({
        carType: carType.value.trim(),
        services: [serviceType.value],
        technicians: [technician.value.trim()],
        partsQuantity: isEmpty(parts.value) ? 0 : 1,
        status: "pending",
        paymentStatus: "unpaid",
        grandTotal: 0
    });

    showFormSuccess(quickServiceForm, "Job registered successfully!");
    quickServiceForm.reset();
    renderDashboard();
});
