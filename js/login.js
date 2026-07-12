// Validates the login form, then "signs in" and sends you to the dashboard.

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    let isValid = true;

    if (isEmpty(email.value)) {
        showError(email, "Email address is required.");
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, "Enter a valid email address.");
        isValid = false;
    } else {
        clearError(email);
    }

    if (isEmpty(password.value)) {
        showError(password, "Password is required.");
        isValid = false;
    } else if (password.value.length < 4) {
        showError(password, "Password must be at least 4 characters.");
        isValid = false;
    } else {
        clearError(password);
    }

    if (!isValid) {
        return;
    }

    localStorage.setItem("oyeraLoggedIn", "true");
    localStorage.setItem("oyeraUsername", email.value.split("@")[0]);
    window.location.href = "index.html";
});
