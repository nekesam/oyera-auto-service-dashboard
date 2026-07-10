// Shared form validation helpers used across the Oyera Bay Service pages.

// Regex patterns for the formats we expect
const NAME_PATTERN = /^[A-Za-z\s'-]+$/;              // letters, spaces, apostrophes, hyphens
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   // something@something.something
const PHONE_PATTERN = /^0\d{3}\s?\d{6}$/;             // e.g. 0700123456 or 0700 123456
const PLATE_PATTERN = /^[A-Za-z]{3}\s?\d{3}[A-Za-z]$/; // e.g. UBA 123X or UBA123X

function isEmpty(value) {
    return value.trim() === "";
}

function isValidName(value) {
    return NAME_PATTERN.test(value.trim());
}

function isValidEmail(value) {
    return EMAIL_PATTERN.test(value.trim());
}

function isValidPhone(value) {
    return PHONE_PATTERN.test(value.trim());
}

function isValidPlateNumber(value) {
    return PLATE_PATTERN.test(value.trim());
}

function isValidNumberInRange(value, min, max) {
    const number = Number(value);
    if (isNaN(number)) {
        return false;
    }
    if (number < min || number > max) {
        return false;
    }
    return true;
}

// Shows a small red error message under an input and marks it red
function showError(input, message) {
    clearError(input);
    input.classList.add("input-error");

    const errorText = document.createElement("small");
    errorText.className = "error-message";
    errorText.textContent = message;
    input.insertAdjacentElement("afterend", errorText);
}

// Removes the error message and red border from an input
function clearError(input) {
    input.classList.remove("input-error");
    const parent = input.parentElement;
    const existingError = parent.querySelector(".error-message");
    if (existingError) {
        existingError.remove();
    }
}

// Shows a green success message right after the submit button, then hides it
function showFormSuccess(form, message) {
    let successBox = form.querySelector(".form-success");
    if (!successBox) {
        successBox = document.createElement("p");
        successBox.className = "form-success";
        const submitBtn = form.querySelector("button[type='submit']");
        submitBtn.insertAdjacentElement("afterend", successBox);
    }
    successBox.textContent = message;
    successBox.style.display = "block";

    setTimeout(function () {
        successBox.style.display = "none";
    }, 4000);
}
