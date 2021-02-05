const Modal = {
  open() {
    // Abrir modal
    // Adicionar classe active ao modal
    document
      .querySelector('.modal-overlay')
      .classList
      .add('active');
  }, 
  close() {
    // fechar o modal 
    // remover a class active no modal
    document
      .querySelector('.modal-overlay')
      .classList
      .remove('active');
  }
}

const body = document.querySelector("body")
const checkbox = document.querySelector("input[name=theme]")

const getStyle = (element, style) => {
      window
            .getComputedStyle(element)
            .getPropertyValue(style)
}

const initialColors = {
      bg: getStyle(body, "background-color")

}

const darkMode = {
      bg: "#333333",
      }

const changeColors = (colors) => {
      Object.keys(colors).map(key => 
            html.style.setProperty("--bg", "#33333"))
}

checkbox.addEventListener("change", ({target}) => {
      target.checked ? changeColors(darkMode) : changeColors(initialColors)
})

const Storage = {
     get() {
          return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
     },

     set(transactions) {
          localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
     }
}

const Transaction = {
     all: Storage.get(),

      add(transaction) {
            Transaction.all.push(transaction)

            App.reload()
      },

      remove(index) {
          Transaction.all.splice(index, 1)

          App.reload()
      },

      incomes() {
            let income = 0;
            // pegar todas as Transações
            // para cada transação,
            Transaction.all.forEach(transaction => {
                  // se ela for maior que zero
                  if (transaction.amount > 0) {
                        // somar a uma variável e retornar a variável
                        income += transaction.amount;
                  }
            })
            return income;
      },

      expenses() {
      // somar as saídas
      let expense = 0;
            // pegar todas as Transações
            // para cada transação,
            Transaction.all.forEach(transaction => {
                  // se ela for maior que zero
                  if (transaction.amount < 0) {
                        // somar a uma variável e retornar a variável
                        expense += transaction.amount;
                  }
                  return expense;
            })
            return expense;
      },

      total() {
            return Transaction.incomes() + Transaction.expenses();
      }
}

const DOM = {
      transactionsContainer: document.querySelector('#data-table tbody'),

      addTransaction(transaction, index) {
      const tr = document.createElement('tr')
      tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
      tr.dataset.index = index

      DOM.transactionsContainer.appendChild(tr)

      },

      innerHTMLTransaction(transaction, index) {
            const CSSclass = transaction.amount > 0 ? "income" : "expense"

            const amount = Utils.formatCurrency(transaction.amount);

            const html = 
                  `
                  <td class="description">${transaction.description}</td>
                  <td class="${CSSclass}">${amount}</td>
                  <td class="date">${transaction.date}</td>
                  <td>
                        <img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="Remover transação">
                  </td>
                  `

            return html
      },

      updateBalance() {
            {
                  document.getElementById('incomeDisplay')
                        .innerHTML = Utils.formatCurrency(Transaction.incomes())
                  document.getElementById('expenseDisplay')
                        .innerHTML = Utils.formatCurrency(Transaction.expenses())
                  document.getElementById('totalDisplay')
                        .innerHTML = Utils.formatCurrency(Transaction.total())
            }
      },

      clearTransactions() {
          DOM.transactionsContainer.innerHTML = ""
      }
}

const Utils = {
      formatAmount(value) {
            value = Number(value.replace(/\,\./g, "")) * 100

            return value
      },

      formatDate(date) {
            const splitteDate = date.split("-")
            return `${splitteDate[2]}/${splitteDate[1]}/${splitteDate[0]}`
      },


      formatCurrency(value) {
            const signal = Number(value) < 0 ? "-" : ""
            
            value = String(value).replace(/\D/g, "")

            value = Number(value) / 100

            value = value.toLocaleString("pt-BR", {
                  // Currency = moeda
                  style: "currency",
                  currency: "BRL"
            })
            
            return (signal + value)
      }
}

const Form = {
     description: document.querySelector('input#description'),
     amount: document.querySelector('input#amount'),
     date: document.querySelector('input#date'),

     getValues() {
          return {
               description: Form.description.value,
               amount: Form.amount.value,
               date: Form.date.value
          }
     },

     validateFields() {
          const { description, amount, date } = Form.getValues()

          if ( description.trim() === ""||
               amount.trim() === "" ||  
               date.trim() === "") {
               throw new Error("Por favor, preencha todos os campos")
          }
     },

      formatValues() {
            let {description, amount, date} = Form.getValues()
            
            amount = Utils.formatAmount(amount)

            date = Utils.formatDate(date)

            return {
                  description,
                  amount,
                  date
            }
      },

      clearFields() {
            Form.description.value = ""
            Form.amount.value = ""
            Form.date.value = ""
      },

     submit(event) {
          event.preventDefault()

          // tente
          try {
               // formatar os dados para salvar
               Form.validateFields()
               const transaction = Form.formatValues()
               // salvar 
               Transaction.add(transaction)
               // apagar os dados do formulário
               Form.clearFields()
               // modal feche
               Modal.close()
               // atualizar a aplicação
          } catch (error) {
               alert(error.message)
          }
     }
}

const App = {
     init() {
          // forEach é para objetos do tipo array
          // para cada elemento, ele vai executar uma funcionalidade
          Transaction.all.forEach(DOM.addTransaction)

          DOM.updateBalance()

          Storage.set(Transaction.all)
     },
     reload() {
          DOM.clearTransactions()
          App.init()
     },
}

App.init()