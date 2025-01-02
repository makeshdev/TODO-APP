const form = document.getElementById("formbtn");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const balance = document.getElementById("balance");
let totalIncome = 0;
let totalExpense = 0;
let isEdit = false;
let userData = null;
form.onsubmit = async function (event) {
  event.preventDefault();
  try {
    let title = document.getElementById("title").value;
    let amount = document.getElementById("amount").value;
    let opt = document.getElementById("opt").value;
    if (isEdit == false) {
      let url = await fetch(
        "https://6773d58977a26d4701c67a4d.mockapi.io/api/v1/users",
        {
          method: "POST",
          body: JSON.stringify({
            title: title,
            amount: amount,
            opt: opt,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let data = await url.json();
      form.reset();
      getData();
    } else {
      await fetch(
        `https://6773d58977a26d4701c67a4d.mockapi.io/api/v1/users/${userData}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title: title,
            amount: amount,
            opt: opt,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      isEdit = false;
      userData = null;
      getData();
      form.reset();
    }
    location.reload();
  } catch (error) {
    alert("somting went wrong" + error.message);
  }
};

async function getData() {
  try {
    let url = await fetch(
      "https://6773d58977a26d4701c67a4d.mockapi.io/api/v1/users"
    );
    let data = await url.json();
    data.forEach((ele) => {
      if (ele.opt == "Income") {
        totalIncome += parseInt(ele.amount);
        income.innerText = "₹" + totalIncome;
      } else {
        totalExpense += parseInt(ele.amount);
        expense.innerText = "₹" + totalExpense;
      }
      balance.innerText =
        "₹" + (parseInt(totalIncome) - parseInt(totalExpense));
    });

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
      filterData.forEach((element) => {
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
                      <span onclick=deleteData(${element.id})
                        class="font-medium text-white bg-red-600 cursor-pointer px-3 py-1 rounded-md"
                        >Delete</span
                      >
                    </td>
                  </tr>`;
      });
    }
    showFun(data);
  } catch (error) {
    alert("somting wrong" + error.message);
  }
}

async function editData(params) {
  try {
    let url = await fetch(
      `https://6773d58977a26d4701c67a4d.mockapi.io/api/v1/users/${params}`
    );
    let edit = await url.json();
    document.getElementById("title").value = edit.title;
    document.getElementById("amount").value = edit.amount;
    document.getElementById("opt").value = edit.opt;
    isEdit = true;
    userData = params;
  } catch (error) {
    alert("somting went wrong" + error.message);
  }
}

async function deleteData(params) {
  try {
    let conf = confirm("Are you sure want to delete?");
    if (conf) {
      let url = await fetch(
        `https://6773d58977a26d4701c67a4d.mockapi.io/api/v1/users/${params}`,
        {
          method: "DELETE",
        }
      );
      let data = await url.json();

      if (data.opt == "Income") {
        totalIncome -= parseInt(data.amount);
        income.innerText = "₹" + totalIncome;
      } else {
        totalExpense -= parseInt(data.amount);
        expense.innerText = "₹" + totalExpense;
      }
      balance.innerText =
        "₹" + (parseInt(totalIncome) - parseInt(totalExpense));

      getData();
    }
    location.reload();
  } catch (error) {
    alert("somting went wrong" + error.message);
  }
}
getData();
