let data = JSON.parse(localStorage.getItem("Data")) || [];

let idCounter = data.length;
let isEditMode = false;
let currentEditId = null;

let totalIncome = 0;
let totalExpense = 0;

const income = document.getElementById("income");
const expense = document.getElementById("expense");
const balance = document.getElementById("balance");

//Read
function readAll() {
  localStorage.setItem("Data", JSON.stringify(data));
  let item = localStorage.getItem("Data");
  let objectdata = JSON.parse(item);

  let ratioBtn = document.querySelectorAll('input[name="filter"]');
  ratioBtn.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      if (event.target.value === "income") {
        const incomeData = data.filter((item) => item.opt === "Income");
        showFun(incomeData);
      } else if (event.target.value === "expense") {
        const expenseData = data.filter((item) => item.opt === "Expense");
        showFun(expenseData);
      } else if (event.target.value === "all") {
        showFun(data);
      }
    });
  });

  function showFun(filterData) {
    let tableData = document.getElementById("tableData");
    tableData.innerHTML = "";
    filterData.forEach((element, id) => {
      tableData.innerHTML += `<tr>
                  <td class="pt-5">
                  ${element.title}
                  </td>
                  <td class="pt-5">${element.amount}</td>
                  <td class="pt-5">
                    <span onclick=editData(${element.id})
                      class="font-medium text-white bg-green-600 cursor-pointer px-3 py-1 rounded-md"
                      >Edit</span
                    >
                    <span onclick=deleteData(${id})
                      class="font-medium text-white bg-red-600 cursor-pointer px-3 py-1 rounded-md"
                      >Delete</span
                    >
                  </td>
                </tr>`;
    });
  }
  updateNum(data);
  showFun(objectdata);
}

const form = document.getElementById("formbtn");
//submit
form.onsubmit = function create(event) {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const opt = document.getElementById("opt").value;
  if (title === "") {
    alert("Please fill the details");
    return false;
  }
  if (amount < 1 || amount === "") {
    alert("Please enter a valid Amount!");
    return false;
  }
  if (isEditMode) {
    let conData = data.findIndex((index) => index.id === currentEditId);
    if (conData !== -1) {
      data[conData] = { id: currentEditId, title, amount, opt };
    }
  } else {
    const NewData = {
      id: ++idCounter,
      title: title,
      amount: amount,
      opt: opt,
    };
    data.push(NewData);
  }
  localStorage.setItem("Data", JSON.stringify(data));
  updateNum(data);
  readAll();
  form.reset();
};

//delete
function deleteData(id) {
  data.splice(id, 1);

  updateNum(data);

  readAll();
}

//edit
function editData(id) {
  let edit = data.find((res) => res.id === id);
  document.getElementById("title").value = edit.title;
  document.getElementById("amount").value = edit.amount;
  document.getElementById("opt").value = edit.opt;
  isEditMode = true;
  currentEditId = id;
  updateNum(data);
}
//Show Data
function updateNum(data) {
  totalIncome = 0;
  totalExpense = 0;
  data.forEach((ele) => {
    if (ele.opt == "Income") {
      totalIncome += parseInt(ele.amount);
      income.innerText = "₹" + totalIncome;
    } else {
      totalExpense += parseInt(ele.amount);
      expense.innerText = "₹" + totalExpense;
    }
    balance.innerText = "₹" + (parseInt(totalIncome) - parseInt(totalExpense));
  });
}
updateNum(data);
readAll();
