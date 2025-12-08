document.addEventListener('DOMContentLoaded', function () {
  const ageInput = document.getElementById('age');
  const yearsInput = document.getElementById('years');
  const payInput = document.getElementById('pay');
  const resultOutput = document.getElementById('result');
  const calculateBtn = document.getElementById('calculateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const regionSwitch = document.getElementById('regionSwitch');
  const rateButtons = document.querySelectorAll('.rate-btn');

  let selectedRateYear = "2025"; // default

  // Rate toggle selection
  rateButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      rateButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRateYear = btn.dataset.year;
    });
  });

  function getSelectedRegion() {
    return regionSwitch.checked ? 'NI' : 'GB';
  }

  calculateBtn.addEventListener('click', function () {
    const age = parseInt(ageInput.value);
    const years = parseInt(yearsInput.value);
    let pay = parseFloat(payInput.value);
    const region = getSelectedRegion();
    const rateYear = selectedRateYear;

    const caps = {
      GB: { "2025": 719, "2026": 719 },
      NI: { "2025": 749, "2026": 749 }
    };

    const maxWeeklyPay = caps[region][rateYear];
    const maxYears = 20;

    if (isNaN(age) || isNaN(years) || isNaN(pay)) {
      resultOutput.textContent = 'Please fill in all fields correctly.';
      return;
    }
    if (age < 16 || age > 100) {
      resultOutput.textContent = 'Age must be between 16 and 100.';
      return;
    }
    if (years < 0 || years > 50) {
      resultOutput.textContent = 'Years of service must be between 0 and 50.';
      return;
    }
    if (pay < 0) {
      resultOutput.textContent = 'Weekly pay must be a positive number.';
      return;
    }

    pay = Math.min(pay, maxWeeklyPay);

    const effectiveYears = Math.min(years, maxYears);
    let totalWeeks = 0;
    for (let i = 0; i < effectiveYears; i++) {
      const yearAge = age - i - 1;
      if (yearAge < 22) totalWeeks += 0.5;
      else if (yearAge < 41) totalWeeks += 1;
      else totalWeeks += 1.5;
    }

    const redundancyPay = (totalWeeks * pay).toFixed(2);

    let disclaimer = "";
    if (rateYear === "2025") {
      disclaimer = "The stated rate will remain in effect until 05 April 2026.";
    }

    resultOutput.innerHTML =
      `Statutory Redundancy Pay (${region === 'GB' ? 'Great Britain' : 'Northern Ireland'} – ${rateYear} rates): £${redundancyPay} (${totalWeeks} weeks)<br><em>${disclaimer}</em>`;
  });

  resetBtn.addEventListener('click', function () {
    ageInput.value = '';
    yearsInput.value = '';
    payInput.value = '';
    resultOutput.textContent = '';
    regionSwitch.checked = false;

    rateButtons.forEach(b => b.classList.remove('active'));
    rateButtons[0].classList.add('active');
    selectedRateYear = "2025";
  });
});
