const journalEntries = [];

const accountState = {
  cash: 0,
  equipment: 0,
  debt: 0,
  ownerEquity: 0,
  income: 0,
  expenses: 0,
};

const actions = {
  equity: {
    debit: "Bank",
    credit: "Egenkapital",
    amount: 100000,
    apply() {
      accountState.cash += 100000;
      accountState.ownerEquity += 100000;
    },
  },
  loan: {
    debit: "Bank",
    credit: "Lån",
    amount: 50000,
    apply() {
      accountState.cash += 50000;
      accountState.debt += 50000;
    },
  },
  equipment: {
    debit: "Utstyr",
    credit: "Bank",
    amount: 20000,
    apply() {
      accountState.equipment += 20000;
      accountState.cash -= 20000;
    },
  },
  income: {
    debit: "Bank",
    credit: "Inntekter",
    amount: 15000,
    apply() {
      accountState.cash += 15000;
      accountState.income += 15000;
    },
  },
  rent: {
    debit: "Kostnader",
    credit: "Bank",
    amount: 8000,
    apply() {
      accountState.expenses += 8000;
      accountState.cash -= 8000;
    },
  },
};

function formatNok(value) {
  return `${value.toLocaleString("no-NO")} NOK`;
}

function postAction(actionKey) {
  const action = actions[actionKey];
  if (!action) return;

  action.apply();
  journalEntries.push({
    debit: action.debit,
    credit: action.credit,
    amount: action.amount,
  });

  renderJournal();
  renderBalance();
  renderResult();
}

function renderJournal() {
  const tbody = document.getElementById("journal-body");
  tbody.innerHTML = "";

  for (const entry of journalEntries) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.debit}</td>
      <td>${entry.credit}</td>
      <td>${formatNok(entry.amount)}</td>
    `;
    tbody.appendChild(row);
  }
}

function renderBalance() {
  const assets = accountState.cash + accountState.equipment;
  const liabilities = accountState.debt;
  const result = accountState.income - accountState.expenses;
  const equity = accountState.ownerEquity + result;

  document.getElementById("assets-total").textContent = formatNok(assets);
  document.getElementById("liabilities-total").textContent = formatNok(liabilities);
  document.getElementById("equity-total").textContent = formatNok(equity);
}

function renderResult() {
  const result = accountState.income - accountState.expenses;
  document.getElementById("result-total").textContent = formatNok(result);
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  const screens = document.querySelectorAll(".screen");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      screens.forEach((screen) => screen.classList.remove("is-active"));

      tab.classList.add("is-active");
      const id = tab.dataset.screen;
      document.getElementById(id).classList.add("is-active");
    });
  });
}

function setupActions() {
  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      postAction(btn.dataset.action);
    });
  });
}

setupTabs();
setupActions();
renderBalance();
renderResult();
