const CURRENT_TAX = 40;

const LAYERS = {
  30: {
    ordinance: {
      1100000: [0.15, 89703],
      850000: [0.13, 57203],
      650000: [0.11, 35203],
      450000: [0.09, 17203],
      250000: [0.07, 3203],
      185940: [0.05, 0],
    },
    minSal: 185940,
    maxRate: 0.15,
    oneTimeRate: 0.05,
    oneTimeRateFr: 1.05263157894737,
  },
  20: {
    ordinance: {
      260000: [0.18, 21000],
      230000: [0.16, 16200],
      200000: [0.14, 12000],
      170000: [0.12, 8400],
      140000: [0.1, 5400],
      110000: [0.08, 3000],
      80000: [0.06, 1200],
      50000: [0.04, 0],
    },
    minSal: 92570,
    maxRate: 0.18,
    oneTimeRate: 0.1,
    oneTimeRateFr: 1.1111111111,
  },
  40: {
    ordinance: {
      1100000: [0.15, 84470],
      850000: [0.13, 51970],
      650000: [0.11, 29970],
      450000: [0.09, 11970],
      279000: [0.07, 0],
    },
    minSal: 279000,
    maxRate: 0.15,
    oneTimeRate: 0.05,
    oneTimeRateFr: 1.05263157894737,
  },
};

const form = document.querySelector("form");
const errorMessage = document.getElementById("error-msg");
const output = document.getElementById("output");
const outputContainer = document.querySelector(".form__output");

editOrdinanceTitle();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  calculate();
});

function calculate() {
  output.innerHTML = "";
  errorMessage.innerHTML = "";
  errorMessage.classList.add("hidden");
  outputContainer.classList.add("hidden");

  const minSalaryValue = LAYERS[CURRENT_TAX].minSal;
  let salary = +document.getElementById("salary").value;
  let socialSecuritySalary = document.getElementById('ss-salary').value;

  if (socialSecuritySalary < minSalaryValue && socialSecuritySalary !== '') {
    const error = document.createTextNode("الراتب التأميني يجب أن يكون أكبر من " + minSalaryValue.toLocaleString());
    errorMessage.appendChild(error);
    errorMessage.classList.remove("hidden");
    return;
  }

  if (socialSecuritySalary === '') {
    socialSecuritySalary = salary;
  } else if (socialSecuritySalary > 0) {
    socialSecuritySalary = salary - (+socialSecuritySalary * 0.07)
  }

  if (salary <= 0 || salary === "") {
    const error = document.createTextNode("الراتب يجب أن يكون أكبر من الصفر");
    errorMessage.appendChild(error);
    errorMessage.classList.remove("hidden");
    return;
  }

  const taxLayerValue = taxLayer(socialSecuritySalary);
  const grossFixedSalaryValue = grossFixedSalary(salary);
  const taxLayerRow = createRow("الضريبة", taxLayerValue.toLocaleString());
  const grossFixedSalaryRow = createRow(
    "الراتب الاجمالي ليكون " + salary.toLocaleString() + " صافياً",
    grossFixedSalaryValue.toLocaleString()
  );

  output.appendChild(taxLayerRow);
  output.appendChild(grossFixedSalaryRow);
  outputContainer.classList.remove("hidden");

  return;
}

function editOrdinanceTitle() {
  const ordinance = document.getElementById("ordinance");
  const text = document.createTextNode(CURRENT_TAX);

  ordinance.innerHTML = "";
  ordinance.appendChild(text);
  return;
}

function createRow(key, value) {
  const tr = document.createElement("tr");
  const tdKey = document.createElement("td");
  const tdValue = document.createElement("td");
  const tdKeyText = document.createTextNode(key);
  const tdValueText = document.createTextNode(value);

  tdKey.appendChild(tdKeyText);
  tdValue.appendChild(tdValueText);
  tr.appendChild(tdKey);
  tr.appendChild(tdValue);

  return tr;
}

function taxLayer(salary) {
  let tax = 0;
  const currentOrdinance = LAYERS[CURRENT_TAX].ordinance;

  let data = [];

  for (let x in currentOrdinance) {
    let row = [x, ...currentOrdinance[x]];
    data.push(row);
  }

  data.sort((a, b) => b[0] - a[0]);

  for (let row of data) {
    let [layer, rate, amount] = row;
    if (salary > layer) {
      tax = (salary - layer) * rate + amount;
      return Math.ceil(tax / 100) * 100;
    }
  }

  return Math.ceil(tax / 100) * 100;
}

function grossFixedSalary(salary) {
  if (taxLayer(salary) === 0) return Math.round(salary);

  let minSalary = salary;
  let maxSalary = Math.round(salary * 1.5);

  while (true) {
    let midSalary = Math.round((minSalary + maxSalary) / 2);
    let midNetSalary = midSalary - taxLayer(midSalary);

    if (midNetSalary > salary) {
      maxSalary = midSalary;
    } else if (midNetSalary < salary) {
      minSalary = midSalary;
    } else {
      return Math.round(midSalary);
    }
  }
}
