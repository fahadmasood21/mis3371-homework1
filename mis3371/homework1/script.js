window.onload = function () {
  displayToday();
  populateStates();
  setDobLimits();
  setupSlider();
  setupUserIdLowercase();
  setupPasswordChecks();
  setupFormSubmitCheck();
};

// =====================
// DATE DISPLAY
// =====================
function displayToday() {
  const d = new Date();
  const opts = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
  document.getElementById("todayText").textContent =
    d.toLocaleDateString("en-US", opts);
}

// =====================
// STATE DROPDOWN
// =====================
function populateStates() {
  const stateSelect = document.getElementById("state");

  if (!stateSelect) return;

  statesArray.forEach(function (stateCode) {
    const option = document.createElement("option");
    option.value = stateCode;
    option.textContent = stateCode;
    stateSelect.appendChild(option);
  });
}

// =====================
// DOB LIMITS (no future, max 120 years)
// =====================
function setDobLimits() {
  const dob = document.getElementById("dob");
  if (!dob) return;

  const today = new Date();

  const maxDate = formatDate(today);

  const minDateObj = new Date();
  minDateObj.setFullYear(today.getFullYear() - 120);
  const minDate = formatDate(minDateObj);

  dob.max = maxDate;
  dob.min = minDate;
}

function formatDate(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// =====================
// SLIDER VALUE DISPLAY
// =====================
function setupSlider() {
  const slider = document.getElementById("healthScore");
  const output = document.getElementById("healthValue");

  if (!slider || !output) return;

  output.textContent = slider.value;

  slider.addEventListener("input", function () {
    output.textContent = slider.value;
  });
}

// =====================
// USER ID LOWERCASE
// =====================
function setupUserIdLowercase() {
  const userId = document.getElementById("userId");

  if (!userId) return;

  userId.addEventListener("blur", function () {
    userId.value = userId.value.toLowerCase();
  });
}

// =====================
// PASSWORD VALIDATION
// =====================
function setupPasswordChecks() {
  const password = document.getElementById("password");
  const password2 = document.getElementById("password2");

  if (!password || !password2) return;

  password.addEventListener("input", validatePasswordField);
  password2.addEventListener("input", validatePasswordMatch);
}

function validatePasswordField() {
  const password = document.getElementById("password").value;
  const userId = document.getElementById("userId").value.toLowerCase();
  const firstName = document.getElementById("firstName").value.toLowerCase();
  const error = document.getElementById("passwordError");

  if (!error) return;

  let messages = [];

  if (password.length < 8 || password.length > 30) {
    messages.push("Password must be 8 to 30 characters.");
  }

  if (!/[A-Z]/.test(password)) {
    messages.push("Must include uppercase.");
  }

  if (!/[a-z]/.test(password)) {
    messages.push("Must include lowercase.");
  }

  if (!/[0-9]/.test(password)) {
    messages.push("Must include a number.");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};:,.<>/?\\|`~]/.test(password)) {
    messages.push("Must include a special character.");
  }

  if (/['"]/.test(password)) {
    messages.push("Quotes are not allowed.");
  }

  if (userId && password.toLowerCase().includes(userId)) {
    messages.push("Cannot contain user ID.");
  }

  if (firstName && password.toLowerCase().includes(firstName)) {
    messages.push("Cannot contain first name.");
  }

  error.textContent = messages.join(" ");
}

function validatePasswordMatch() {
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;
  const error = document.getElementById("password2Error");

  if (!error) return;

  if (password2.length === 0) {
    error.textContent = "";
    return;
  }

  if (password !== password2) {
    error.textContent = "Passwords do not match.";
  } else {
    error.textContent = "";
  }
}

// =====================
// CLEAR ERRORS
// =====================
function clearAllErrors() {
  const errorFields = document.querySelectorAll(".error");

  errorFields.forEach(function (field) {
    field.textContent = "";
  });
}

// =====================
// FORM VALIDATION
// =====================
function validateForm() {
  clearAllErrors();
  let isValid = true;

  const firstName = document.getElementById("firstName").value.trim();
  const middleInitial = document.getElementById("middleInitial").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const dob = document.getElementById("dob").value;
  const ssn = document.getElementById("ssn").value.trim();
  const email = document.getElementById("email").value.trim();
  const address1 = document.getElementById("address1").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value;
  const zip = document.getElementById("zip").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const userId = document.getElementById("userId").value.trim();
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;

  if (!/^[A-Za-z'-]{1,30}$/.test(firstName)) {
    isValid = false;
  }

  if (middleInitial && !/^[A-Za-z]$/.test(middleInitial)) {
    isValid = false;
  }

  if (!/^[A-Za-z'2-5-]{1,30}$/.test(lastName)) {
    isValid = false;
  }

  if (!dob) {
    isValid = false;
  }

  if (ssn && !/^\d{3}-\d{2}-\d{4}$/.test(ssn)) {
    isValid = false;
  }

  if (!email) {
    isValid = false;
  }

  if (address1.length < 2 || address1.length > 30) {
    isValid = false;
  }

  if (!/^[A-Za-z\s.-]{2,30}$/.test(city)) {
    isValid = false;
  }

  if (!state) {
    isValid = false;
  }

  if (!/^\d{5}(-\d{4})?$/.test(zip)) {
    isValid = false;
  }

  if (phone && !/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
    isValid = false;
  }

  if (!/^[A-Za-z][A-Za-z0-9_-]{4,29}$/.test(userId)) {
    isValid = false;
  }

  validatePasswordField();
  validatePasswordMatch();

  if (
    document.getElementById("passwordError")?.textContent !== "" ||
    document.getElementById("password2Error")?.textContent !== ""
  ) {
    isValid = false;
  }

  return isValid;
}

// =====================
// HELPERS FOR REVIEW
// =====================
function getCheckedValues(name) {
  const checked = document.querySelectorAll(`input[name="${name}"]:checked`);
  let values = [];

  checked.forEach(function (item) {
    values.push(item.value);
  });

  return values.length ? values.join(", ") : "None";
}

function getRadioValue(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : "Not selected";
}

// =====================
// REVIEW FUNCTION
// =====================
function reviewForm() {
  const reviewSection = document.getElementById("reviewSection");
  const reviewContent = document.getElementById("reviewContent");

  const valid = validateForm();

  const firstName = document.getElementById("firstName").value;
  const middleInitial = document.getElementById("middleInitial").value;
  const lastName = document.getElementById("lastName").value;
  const dob = document.getElementById("dob").value;
  const email = document.getElementById("email").value;
  const address1 = document.getElementById("address1").value;
  const address2 = document.getElementById("address2").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const zip = document.getElementById("zip").value;
  const phone = document.getElementById("phone").value || "Not provided";
  const userId = document.getElementById("userId").value.toLowerCase();

  document.getElementById("userId").value = userId;

  const healthScore = document.getElementById("healthScore").value;
  const symptoms =
    document.getElementById("symptoms").value || "None provided";

  const history = getCheckedValues("history");
  const gender = getRadioValue("gender");
  const vaccinated = getRadioValue("vaccinated");
  const insurance = getRadioValue("insurance");

  let output = `
    <p><strong>Name:</strong> ${firstName} ${middleInitial} ${lastName}</p>
    <p><strong>DOB:</strong> ${dob}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Address:</strong> ${address1}, ${city}, ${state} ${zip}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>History:</strong> ${history}</p>
    <p><strong>Gender:</strong> ${gender}</p>
    <p><strong>Vaccinated:</strong> ${vaccinated}</p>
    <p><strong>Insurance:</strong> ${insurance}</p>
    <p><strong>Health:</strong> ${healthScore}</p>
    <p><strong>Symptoms:</strong> ${symptoms}</p>
    <p><strong>User ID:</strong> ${userId}</p>
  `;

  if (!valid) {
    output += `<p style="color:red;"><strong>Fix errors before submitting.</strong></p>`;
  } else {
    output += `<p style="color:green;"><strong>Looks good. You can submit.</strong></p>`;
  }

  reviewContent.innerHTML = output;
  reviewSection.style.display = "block";
}

// =====================
// BLOCK SUBMIT IF INVALID
// =====================
function setupFormSubmitCheck() {
  const form = document.getElementById("registrationForm");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    if (!validateForm()) {
      event.preventDefault();
      reviewForm();
      alert("Please fix errors before submitting.");
    }
  });
}
