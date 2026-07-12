// Saves simple dashboard settings to localStorage so they persist.

const settingsForm = document.getElementById("settingsForm");
const companyName = document.getElementById("companyName");
const notifyEmail = document.getElementById("notifyEmail");
const lowStockAlert = document.getElementById("lowStockAlert");

const savedSettings = JSON.parse(localStorage.getItem("oyeraSettings")) || {};
if (savedSettings.companyName) {
    companyName.value = savedSettings.companyName;
}
if (savedSettings.notifyEmail) {
    notifyEmail.value = savedSettings.notifyEmail;
}
if (savedSettings.lowStockAlert) {
    lowStockAlert.value = savedSettings.lowStockAlert;
}

settingsForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!isEmpty(notifyEmail.value) && !isValidEmail(notifyEmail.value)) {
        showError(notifyEmail, "Enter a valid email address.");
        return;
    }
    clearError(notifyEmail);

    localStorage.setItem("oyeraSettings", JSON.stringify({
        companyName: companyName.value.trim(),
        notifyEmail: notifyEmail.value.trim(),
        lowStockAlert: lowStockAlert.value
    }));

    showFormSuccess(settingsForm, "Settings saved!");
});
