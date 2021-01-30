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
const Transaction = {
     all: [
          {
               description: 'Luz',
               amount: -50001,
               date: '23/01/2021'
          },

          {
               description: 'Website',
               amount: 500000,
               date: '23/01/2021'
          },

          {
               description: 'Internet',
               amount: -20012,
               date: '23/01/2021'
          },

          {
               description: 'App',
               amount: 200000,
               date: '23/01/2021'
          }
     ],

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
      tr.innerHTML = DOM.innerHTMLTransaction(transaction)

      DOM.transactionsContainer.appendChild(tr)

      },

      innerHTMLTransaction(transaction) {
            const CSSclass = transaction.amount > 0 ? "income" : "expense"

            const amount = Utils.formatCurrency(transaction.amount);

            const html = 
                  `
                  <td class="description">${transaction.description}</td>
                  <td class="${CSSclass}">${amount}</td>
                  <td class="date">${transaction.date}</td>
                  <td>
                        <img src="assets/minus.svg" alt="Remover transação">
                  </td>
                  `

            return html;
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

     formatData() {
          console.log('Formatar os dados')
     },

     validateFields() {
          const { description, amount, date } = Form.getValues()

          if ( description.trim() == ""||
               amount.trim() == "" ||  
               date.trim() == "") {
               throw new Error("Por favor, preencha todos os campos")
          }
     },

     submit(event) {
          event.preventDefault()

          try {
               // verificar se todas as informações foram preenchidas
               Form.validateFields()
               // formatar os dados para salvar
               // salvar 
               // apagar os dados do formulário
               // modal feche
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
          Transaction.all.forEach(
          transaction => {
               DOM.addTransaction(transaction);
          })

          DOM.updateBalance()
     },
     reload() {
          DOM.clearTransactions()
          App.init()
     },
}

App.init()