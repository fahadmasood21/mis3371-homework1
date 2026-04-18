window.onload = function () {
  displayToday();
  populateStates();
  setDobLimits();
  setupSlider();
  setupFieldValidation();
  setupFormatting();
  setupButtons();
  toggleSubmit(false);
};

function displayToday() {
  const d = new Date();
  const opts = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
  document.getElementById("todayText").textContent = d.toLocaleDateString("en-US", opts);
}

function populateStates() {
  const stateSelect = document.getElementById("state");
  if (!stateSelect || typeof statesArray === "undefined") return;

  statesArray.forEach(function (stateCode) {
    const option = document.createElement("option");
    option.value = stateCode;
    option.textContent = stateCode;
    stateSelect.appendChild(option);
  });
}

function setDobLimits() {
  const dob = document.getElementById("dob");
  if (!dob) return;

  const today = new Date();
  dob.max = formatDate(today);

  const minDateObj = new Date();
  minDateObj.setFullYear(today.getFullYear() - 120);
  dob.min = formatDate(minDateObj);
}

function formatDate(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function setupSlider() {
  const slider = document.getElementById("healthScore");
  const output = document.getElementById("healthValue");

  if (!slider || !output) return;

  output.textContent = slider.value;
  slider.addEventListener("input", function () {
    output.textContent = slider.value;
  });
}

function showError(fieldId, message) {
  const errorBox = document.getElementById(fieldId + "Error");
  const field = document.getElementById(fieldId);

  if (errorBox) errorBox.textContent = message;
  if (field) field.classList.add("invalid");
}

function clearError(fieldId) {
  const errorBox = document.getElementById(fieldId + "Error");
  const field = document.getElementById(fieldId);

  if (errorBox) errorBox.textContent = "";
  if (field) field.classList.remove("invalid");
}

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function isRadioChecked(name) {
  return document.querySelector(`input[name="${name}"]:checked`) !== null;
}

function getRadioValue(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : "Not selected";
}

function getCheckedValues(name) {
  const checked = document.querySelectorAll(`input[name="${name}"]:checked`);
  let values = [];
  checked.forEach(function (item) {
    values.push(item.value);
  });
  return values.length ? values.join(", ") : "None";
}

function setupFormatting() {
  const ssn = document.getElementById("ssn");
  const phone = document.getElementById("phone");
  const userId = document.getElementById("userId");
  const email = document.getElementById("email");
  const zip = document.getElementById("zip");

  if (ssn) {
    ssn.addEventListener("input", function () {
      let digits = ssn.value.replace(/\D/g, "").substring(0, 9);
      let formatted = "";

      if (digits.length > 0) {
        formatted += digits.substring(0, 3);
      }
      if (digits.length >= 4) {
        formatted += "-" + digits.substring(3, 5);
      }
      if (digits.length >= 6) {
        formatted += "-" + digits.substring(5, 9);
      }

      ssn.value = formatted;
      validateSSN();
      checkFormValiditySilently();
    });
  }

  if (phone) {
    phone.addEventListener("input", function () {
      let digits = phone.value.replace(/\D/g, "").substring(0, 10);
      let formatted = "";

      if (digits.length > 0) {
        formatted += digits.substring(0, 3);
      }
      if (digits.length >= 4) {
        formatted += "-" + digits.substring(3, 6);
      }
      if (digits.length >= 7) {
        formatted += "-" + digits.substring(6, 10);
      }

      phone.value = formatted;
      validatePhone();
      checkFormValiditySilently();
    });
  }

  if (userId) {
    userId.addEventListener("blur", function () {
      userId.value = userId.value.toLowerCase();
      validateUserId();
      validatePassword();
      checkFormValiditySilently();
    });
  }

  if (email) {
    email.addEventListener("blur", function () {
      email.value = email.value.toLowerCase();
      validateEmail();
      checkFormValiditySilently();
    });
  }

  if (zip) {
    zip.addEventListener("input", function () {
      zip.value = zip.value.replace(/\D/g, "").substring(0, 5);
      validateZip();
      checkFormValiditySilently();
    });
  }
}

function setupFieldValidation() {
  addLiveValidation("firstName", validateFirstName);
  addLiveValidation("middleInitial", validateMiddleInitial);
  addLiveValidation("lastName", validateLastName);
  addLiveValidation("dob", validateDOB, ["change", "blur"]);
  addLiveValidation("email", validateEmail);
  addLiveValidation("address1", validateAddress1);
  addLiveValidation("address2", validateAddress2);
  addLiveValidation("city", validateCity);
  addLiveValidation("state", validateState, ["change"]);
  addLiveValidation("symptoms", validateSymptoms);
  addLiveValidation("userId", validateUserId);
  addLiveValidation("password", function () {
    validatePassword();
    validatePasswordMatch();
  });
  addLiveValidation("password2", validatePasswordMatch);

  const genderButtons = document.querySelectorAll('input[name="gender"]');
  const vaccinatedButtons = document.querySelectorAll('input[name="vaccinated"]');
  const insuranceButtons = document.querySelectorAll('input[name="insurance"]');

  genderButtons.forEach(function (btn) {
    btn.addEventListener("change", function () {
      validateGender();
      checkFormValiditySilently();
    });
  });

  vaccinatedButtons.forEach(function (btn) {
    btn.addEventListener("change", function () {
      validateVaccinated();
      checkFormValiditySilently();
    });
  });

  insuranceButtons.forEach(function (btn) {
    btn.addEventListener("change", function () {
      validateInsurance();
      checkFormValiditySilently();
    });
  });
}

function addLiveValidation(fieldId, validator, events) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  const fieldEvents = events || ["input", "blur"];
  fieldEvents.forEach(function (eventName) {
    field.addEventListener(eventName, function () {
      validator();
      checkFormValiditySilently();
    });
  });
}

function validateFirstName() {
  const value = getValue("firstName");
  if (value === "") {
    showError("firstName", "First name is required.");
    return false;
  }
  if (!/^[A-Za-z'-]{1,30}$/.test(value)) {
    showError("firstName", "Use 1 to 30 letters, apostrophes, or dashes only.");
    return false;
  }
  clearError("firstName");
  return true;
}

function validateMiddleInitial() {
  const value = getValue("middleInitial");
  if (value === "") {
    clearError("middleInitial");
    return true;
  }
  if (!/^[A-Za-z]$/.test(value)) {
    showError("middleInitial", "Middle initial must be one letter only.");
    return false;
  }
  clearError("middleInitial");
  return true;
}

function validateLastName() {
  const value = getValue("lastName");
  if (value === "") {
    showError("lastName", "Last name is required.");
    return false;
  }
  if (!/^[A-Za-z'-]{1,30}$/.test(value)) {
    showError("lastName", "Use 1 to 30 letters, apostrophes, or dashes only.");
    return false;
  }
  clearError("lastName");
  return true;
}

function validateDOB() {
  const value = document.getElementById("dob").value;

  if (value === "") {
    showError("dob", "Date of birth is required.");
    return false;
  }

  const dob = new Date(value);
  const today = new Date();
  const oldest = new Date();
  oldest.setFullYear(today.getFullYear() - 120);

  if (dob > today) {
    showError("dob", "Date of birth cannot be in the future.");
    return false;
  }

  if (dob < oldest) {
    showError("dob", "Date of birth cannot be more than 120 years ago.");
    return false;
  }

  clearError("dob");
  return true;
}

function validateSSN() {
  const value = getValue("ssn");
  if (value === "") {
    showError("ssn", "Social Security Number is required.");
    return false;
  }
  if (!/^\d{3}-\d{2}-\d{4}$/.test(value)) {
    showError("ssn", "Enter 9 digits in the format 123-45-6789.");
    return false;
  }
  clearError("ssn");
  return true;
}

function validateEmail() {
  const value = getValue("email").toLowerCase();
  document.getElementById("email").value = value;

  if (value === "") {
    showError("email", "Email is required.");
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    showError("email", "Enter a valid email address like name@domain.com.");
    return false;
  }
  clearError("email");
  return true;
}

function validateAddress1() {
  const value = getValue("address1");
  if (value === "") {
    showError("address1", "Address Line 1 is required.");
    return false;
  }
  if (value.length < 2 || value.length > 30) {
    showError("address1", "Address Line 1 must be 2 to 30 characters.");
    return false;
  }
  clearError("address1");
  return true;
}

function validateAddress2() {
  const value = getValue("address2");
  if (value === "") {
    clearError("address2");
    return true;
  }
  if (value.length < 2 || value.length > 30) {
    showError("address2", "Address Line 2 must be 2 to 30 characters if used.");
    return false;
  }
  clearError("address2");
  return true;
}

function validateCity() {
  const value = getValue("city");
  if (value === "") {
    showError("city", "City is required.");
    return false;
  }
  if (!/^[A-Za-z .'-]{2,30}$/.test(value)) {
    showError("city", "City must be 2 to 30 valid characters.");
    return false;
  }
  clearError("city");
  return true;
}

function validateState() {
  const value = getValue("state");
  if (value === "") {
    showError("state", "Please select a state.");
    return false;
  }
  clearError("state");
  return true;
}

function validateZip() {
  const value = getValue("zip");
  if (value === "") {
    showError("zip", "ZIP code is required.");
    return false;
  }
  if (!/^\d{5}$/.test(value)) {
    showError("zip", "ZIP code must be exactly 5 digits.");
    return false;
  }
  clearError("zip");
  return true;
}

function validatePhone() {
  const value = getValue("phone");
  if (value === "") {
    clearError("phone");
    return true;
  }
  if (!/^\d{3}-\d{3}-\d{4}$/.test(value)) {
    showError("phone", "Phone must be in the format 123-456-7890.");
    return false;
  }
  clearError("phone");
  return true;
}

function validateUserId() {
  const field = document.getElementById("userId");
  field.value = field.value.toLowerCase();
  const value = field.value.trim();

  if (value === "") {
    showError("userId", "User ID is required.");
    return false;
  }
  if (!/^[A-Za-z][A-Za-z0-9_-]{4,19}$/.test(value)) {
    showError("userId", "User ID must start with a letter and be 5 to 20 characters with only letters, numbers, dashes, or underscores.");
    return false;
  }
  clearError("userId");
  return true;
}

function validatePassword() {
  const password = document.getElementById("password").value;
  const userId = getValue("userId").toLowerCase();
  const firstName = getValue("firstName").toLowerCase();

  let messages = [];

  if (password.length < 8) {
    messages.push("Password must be at least 8 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    messages.push("Include at least 1 uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    messages.push("Include at least 1 lowercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    messages.push("Include at least 1 digit.");
  }
  if (userId && password.toLowerCase().includes(userId)) {
    messages.push("Password cannot contain your user ID.");
  }
  if (firstName && password.toLowerCase().includes(firstName)) {
    messages.push("Password cannot contain your first name.");
  }

  if (messages.length > 0) {
    showError("password", messages.join(" "));
    return false;
  }

  clearError("password");
  return true;
}

function validatePasswordMatch() {
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;

  if (password2 === "") {
    showError("password2", "Please re-enter your password.");
    return false;
  }

  if (password !== password2) {
    showError("password2", "Passwords do not match.");
    return false;
  }

  clearError("password2");
  return true;
}

function validateSymptoms() {
  const value = getValue("symptoms");
  if (value === "") {
    showError("symptoms", "Symptoms description is required.");
    return false;
  }
  if (value.length < 3) {
    showError("symptoms", "Please enter at least 3 characters.");
    return false;
  }
  clearError("symptoms");
  return true;
}

function validateGender() {
  const error = document.getElementById("genderError");
  if (!isRadioChecked("gender")) {
    error.textContent = "Please select a gender.";
    return false;
  }
  error.textContent = "";
  return true;
}

function validateVaccinated() {
  const error = document.getElementById("vaccinatedError");
  if (!isRadioChecked("vaccinated")) {
    error.textContent = "Please select yes or no.";
    return false;
  }
  error.textContent = "";
  return true;
}

function validateInsurance() {
  const error = document.getElementById("insuranceError");
  if (!isRadioChecked("insurance")) {
    error.textContent = "Please select yes or no.";
    return false;
  }
  error.textContent = "";
  return true;
}

function validateForm() {
  let valid = true;

  if (!validateFirstName()) valid = false;
  if (!validateMiddleInitial()) valid = false;
  if (!validateLastName()) valid = false;
  if (!validateDOB()) valid = false;
  if (!validateSSN()) valid = false;
  if (!validateEmail()) valid = false;
  if (!validateAddress1()) valid = false;
  if (!validateAddress2()) valid = false;
  if (!validateCity()) valid = false;
  if (!validateState()) valid = false;
  if (!validateZip()) valid = false;
  if (!validatePhone()) valid = false;
  if (!validateUserId()) valid = false;
  if (!validatePassword()) valid = false;
  if (!validatePasswordMatch()) valid = false;
  if (!validateSymptoms()) valid = false;
  if (!validateGender()) valid = false;
  if (!validateVaccinated()) valid = false;
  if (!validateInsurance()) valid = false;

  toggleSubmit(valid);
  return valid;
}

function checkFormValiditySilently() {
  let valid = true;

  if (!validateFirstName()) valid = false;
  if (!validateMiddleInitial()) valid = false;
  if (!validateLastName()) valid = false;
  if (!validateDOB()) valid = false;
  if (!validateSSN()) valid = false;
  if (!validateEmail()) valid = false;
  if (!validateAddress1()) valid = false;
  if (!validateAddress2()) valid = false;
  if (!validateCity()) valid = false;
  if (!validateState()) valid = false;
  if (!validateZip()) valid = false;
  if (!validatePhone()) valid = false;
  if (!validateUserId()) valid = false;
  if (!validatePassword()) valid = false;
  if (!validatePasswordMatch()) valid = false;
  if (!validateSymptoms()) valid = false;
  if (!validateGender()) valid = false;
  if (!validateVaccinated()) valid = false;
  if (!validateInsurance()) valid = false;

  toggleSubmit(valid);
}

function reviewForm() {
  const reviewSection = document.getElementById("reviewSection");
  const reviewContent = document.getElementById("reviewContent");

  const firstName = getValue("firstName");
  const middleInitial = getValue("middleInitial");
  const lastName = getValue("lastName");
  const dob = getValue("dob");
  const email = getValue("email");
  const address1 = getValue("address1");
  const address2 = getValue("address2");
  const city = getValue("city");
  const state = getValue("state");
  const zip = getValue("zip");
  const phone = getValue("phone") || "Not provided";
  const userId = getValue("userId");
  const healthScore = document.getElementById("healthScore").value;
  const symptoms = getValue("symptoms");
  const history = getCheckedValues("history");
  const gender = getRadioValue("gender");
  const vaccinated = getRadioValue("vaccinated");
  const insurance = getRadioValue("insurance");

  let fullName = `${firstName} ${middleInitial} ${lastName}`.replace(/\s+/g, " ").trim();
  let fullAddress = address2
    ? `${address1}, ${address2}, ${city}, ${state} ${zip}`
    : `${address1}, ${city}, ${state} ${zip}`;

  reviewContent.innerHTML = `
    <p><strong>Name:</strong> ${fullName}</p>
    <p><strong>DOB:</strong> ${dob}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Address:</strong> ${fullAddress}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Medical History:</strong> ${history}</p>
    <p><strong>Gender:</strong> ${gender}</p>
    <p><strong>Vaccinated:</strong> ${vaccinated}</p>
    <p><strong>Insurance:</strong> ${insurance}</p>
    <p><strong>Health Score:</strong> ${healthScore}</p>
    <p><strong>Symptoms:</strong> ${symptoms}</p>
    <p><strong>User ID:</strong> ${userId}</p>
  `;

  reviewSection.style.display = "block";
}

function toggleSubmit(show) {
  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) return;

  if (show) {
    submitBtn.classList.remove("hidden-submit");
  } else {
    submitBtn.classList.add("hidden-submit");
  }
}

function clearVisualErrors() {
  const errors = document.querySelectorAll(".error");
  errors.forEach(function (err) {
    err.textContent = "";
  });

  const invalidFields = document.querySelectorAll(".invalid");
  invalidFields.forEach(function (field) {
    field.classList.remove("invalid");
  });
}

function setupButtons() {
  const form = document.getElementById("registrationForm");
  const validateBtn = document.getElementById("validateBtn");
  const clearBtn = document.getElementById("clearBtn");

  validateBtn.addEventListener("click", function () {
    const valid = validateForm();
    reviewForm();

    if (valid) {
      alert("Everything looks good. You may now submit the form.");
    } else {
      alert("Please fix the errors shown on the page.");
    }
  });

  clearBtn.addEventListener("click", function () {
    setTimeout(function () {
      clearVisualErrors();
      document.getElementById("reviewSection").style.display = "none";
      document.getElementById("reviewContent").innerHTML = "";
      document.getElementById("healthValue").textContent = document.getElementById("healthScore").value;
      toggleSubmit(false);
    }, 0);
  });

  form.addEventListener("submit", function (event) {
    if (!validateForm()) {
      event.preventDefault();
      reviewForm();
      alert("Please fix the errors before submitting.");
    }
  });
}
