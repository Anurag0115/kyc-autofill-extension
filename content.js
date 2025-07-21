(function autofillKYC() {
  const kycData = JSON.parse(localStorage.getItem("kycData") || "{}");

  if (!kycData?.aadhaar) {
    console.warn("❌ KYC data not found in localStorage.");
    return;
  }

  const fields = {
    name: ['input[name="name"]', 'input[id="name"]', 'input[name*="full"]'],
    aadhaar: ['input[name="aadhaar"]', 'input[id="aadhaar"]', 'input[name*="aadhar"]'],
    dob: ['input[name="dob"]', 'input[id="dob"]', 'input[type="date"]'],
    gender: ['select[name="gender"]', 'select[id="gender"]', 'select']
  };

  function fillField(selectors, value, type = "text") {
    for (let sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        if (type === "select") {
          [...el.options].forEach(opt => {
            if (opt.value.toLowerCase() === value.toLowerCase()) {
              el.value = opt.value;
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        } else {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
        console.log(`✅ Filled ${type} field: ${sel} with "${value}"`);
        return;
      }
    }
    console.warn(`⚠️ Field not found for value: "${value}"`);
  }

  if (kycData.name) fillField(fields.name, kycData.name);
  if (kycData.aadhaar) fillField(fields.aadhaar, kycData.aadhaar);
  if (kycData.dob) fillField(fields.dob, kycData.dob);
  if (kycData.gender) fillField(fields.gender, kycData.gender, "select");
})();
