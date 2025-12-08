document.addEventListener('DOMContentLoaded', function () {
  const ageInput = document.getElementById('age');
  const yearsInput = document.getElementById('years');
  const payInput = document.getElementById('pay');
  const resultOutput = document.getElementById('result');
  const calculateBtn = document.getElementById('calculateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const regionSwitch = document.getElementById('regionSwitch');

  // Determine selected region (GB or NI)
  function getSelectedRegion() {
    return regionSwitch.checked ? 'NI' : 'GB';
  }

  // Determine selected rate year (2025 or 2026)
  function getSelectedRateYear() {
    return document.querySelector('input[name="rateYear"]:checked').value;
  }

  calculateBtn.addEventListener('click', function () {
    const age = parseInt(ageInput.value);
    const years = parseInt(yearsInput.value);
    let pay = parseFloat(payInput.value);
    const region = getSelectedRegion();
    const rateYear = getSelectedRateYear();

    // --- STATUTORY WEEKLY PAY CAPS ---
    // 2025–2026 (confirmed)
    // 2026–2027 (redundancy caps NOT released yet → placeholder)
    const caps = {
      GB: {
        "2025": 719,
        "2026": 719 // update here when official 2026/27 redundancy cap is announced
      },
      NI: {
        "2025": 749,
        "2026": 749 // update here when official 2026/27 redundancy cap is announced
      }
    };

    const maxWeeklyPay = caps[region][rateYear];
    const maxYears = 20;

    // Validate inputs
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

    // Apply statutory weekly pay cap
    pay = Math.min(pay, maxWeeklyPay);

    // Only last 20 full years count
    const effectiveYears = Math.min(years, maxYears);
    let totalWeeks = 0;

    // Work backwards year-by-year
    for (let i = 0; i < effectiveYears; i++) {
      const yearAge = age - i - 1;

      if (yearAge < 22) {
        totalWeeks += 0.5;
      } else if (yearAge < 41) {
        totalWeeks += 1;
      } else {
        totalWeeks += 1.5;
      }
    }

    const redundancyPay = (totalWeeks * pay).toFixed(2);

    resultOutput.textContent =
      `Statutory Redundancy Pay (${region === 'GB' ? 'Great Britain' : 'Northern Ireland'} – ${rateYear} rates): £${redundancyPay} (${totalWeeks} weeks)`;
  });

  resetBtn.addEventListener('click', function () {
    ageInput.value = '';
    yearsInput.value = '';
    payInput.value = '';
    resultOutput.textContent = '';
    regionSwitch.checked = false;

    // Reset rate year to 2025
    document.querySelector('input[name="rateYear"][value="2025"]').checked = true;
  });
});
