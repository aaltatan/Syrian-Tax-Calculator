function toNumber(num = "") {
  return +num.replaceAll(",", "");
}
// ---------------------------
function layersTax(salary = 0) {
  let tax = 0;
  if (salary > 260000) {
    tax = (salary - 260000) * 0.18 + 21000;
  } else if (salary > 230000) {
    tax = (salary - 230000) * 0.16 + 16200;
  } else if (salary > 200000) {
    tax = (salary - 200000) * 0.14 + 12000;
  } else if (salary > 170000) {
    tax = (salary - 170000) * 0.12 + 8400;
  } else if (salary > 140000) {
    tax = (salary - 140000) * 0.1 + 5400;
  } else if (salary > 110000) {
    tax = (salary - 110000) * 0.08 + 3000;
  } else if (salary > 80000) {
    tax = (salary - 80000) * 0.06 + 1200;
  } else if (salary > 50000) {
    tax = (salary - 50000) * 0.04;
  } else {
    tax = 0;
  }
  return tax;
}
// ---------------------------
function netSalary(salary = 0) {
  if (salary < 50000 || salary > 100000000) return salary;
  let netTarget = salary - layersTax(salary);
  for (let helpSalary = salary; ; ) {
    if (helpSalary <= netTarget) break;
    netTarget = salary - layersTax(salary);
    salary++;
  }
  return salary;
}
// ---------------------------
document.getElementById("salary").onfocus = function () {
  document.getElementById("clc").style.maxHeight = "8rem";
  document.getElementById("salary").select();
};
// ---------------------------
document.getElementById("calc").onclick = function () {
  let sourceSalary = document.getElementById("salary").value;
  if (sourceSalary.toString().length > 8) {
    return;
  }
  document.getElementById("clc").style.maxHeight = "20rem";
  document.getElementById("clc").style.top = "40%";
  document.getElementById("output").innerHTML = `
  Salary = ${(+sourceSalary).toLocaleString()} <br>
  Tax = ${layersTax(sourceSalary).toLocaleString()} <br>
  Net = ${(sourceSalary - layersTax(sourceSalary)).toLocaleString()} <br>
  Full Salary = ${netSalary(sourceSalary).toLocaleString()}
  <button id="copyTax" onclick="taxCopy()">Copy Tax</button>
  <button id="copyFull" onclick="fullCopy()">Copy Full</button>
  `;
};
// ---------------------------
document.getElementById("salary").oninput = (_) => {
  let sourceSalary = 0;
  document.getElementById("clc").style.maxHeight = "8rem";
  document.getElementById("clc").style.top = "50%";
  sourceSalary = document.getElementById("salary").value.toLocaleString();
  document.getElementById("if").innerHTML = `${parseInt(
    sourceSalary
  ).toLocaleString()} s.p.`;
  if (sourceSalary === "") {
    document.getElementById("if").innerHTML = "";
  }
};
// ---------------------------
document
  .getElementById("salary")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("calc").click();
    }
  });
// ---------------------------
function taxCopy() {
  let textCopy = layersTax(document.getElementById("salary").value);
  navigator.clipboard.writeText(textCopy);
}
function fullCopy() {
  let sourceSalary = document.getElementById("salary").value;
  let textCopy = Math.floor(netSalary(sourceSalary));
  navigator.clipboard.writeText(textCopy);
}
