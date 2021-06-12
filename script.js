const Modal ={
    open(){
        document.querySelector(".modal-overlay")
        .classList.add('active')
    },
    Close(){
        document.querySelector(".modal-overlay")
        .classList.remove('active')
    }
 }


 const Storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:trasactions')) || []
    },

    set(transactions){
        localStorage.setItem("dev.finances:trasactions", JSON.stringify(transactions))
    },
}

 const Transaction ={
     all: Storage.get(),
       
     add(transaction){

        Transaction.all.push(transaction)
        app.reload()
     },
     remove(intex){
        Transaction.all.splice(intex, 1)
        app.reload()
     },

     incomes(){
         let income = 0;
       
       Transaction.all.forEach( transaction =>{
        if(transaction.amount > 0){
            income += transaction.amount;
        }
       })
         return income;
    
     },

     expenses(){
        let expense = 0;
       
        Transaction.all.forEach( transaction =>{
         if(transaction.amount < 0){
            expense += transaction.amount;
         }
        })
          return expense;
         
        
     },

     total(){
        return Transaction.incomes() + Transaction.expenses () ;
     }
 }
 const DOM ={
     transactionscontainer: document.querySelector('#data-table tbody'),
     

    addtrasition(transaction, intex){
        const tr= document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, intex)
        tr.dataset.intex = intex
        DOM.transactionscontainer.appendChild(tr)

    },

     innerHTMLTransaction(transaction, intex){
         const CSSclass = transaction.amount > 0 ? "income" : "expense"
         const amount = utils.formatCurrency(transaction.amount)
         const HTML= `<tr>
         <td class="description">${transaction.description}</td>
         <td class="${CSSclass}">${amount}</td>
         <td class="date">${transaction.date}</td>
         <td>
             <img onclick ="Transaction.remove(${intex})" src="./assets/minus.svg" alt="remover Transação">
         </td>
        </tr>`
        return HTML
},
    updateBalance(){
        document.getElementById("incomeDisplay")
        .innerHTML = utils.formatCurrency (Transaction.incomes())
        document.getElementById("expenceDisplay")
        .innerHTML = utils.formatCurrency (Transaction.expenses())
        document.getElementById("totalDisplay")
        .innerHTML = utils.formatCurrency (Transaction.total())
    },
    clearTransaction(){
        DOM.transactionscontainer.innerHTML = ""
    },
 }


const utils= {
    formatAmount(value){
        value = value * 100
       return Math.round(value)
    },
    formatDate(date){
      const splittedDate = date.split("-")
      return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    formatCurrency(value){
        const Signal = Number(value) < 0 ? "-" : "" 
        value= String(value).replace(/\D/g, "")
        value= Number(value) / 100

        value= value.toLocaleString("pt-BR", {
            style: "currency",
            currency:"BRL"
        })



        return Signal + value
    }
}
const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),
    getValue(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
           
        }
        
    },
   
    validateFilds(){
        const {description, amount, date} = Form.getValue()
        if(description.trim()===""||amount.trim()==""||date.trim()==""){
            throw new Error("Por favor, preencha todos os campos")
        }
    },
    formatValue(){
        let {description, amount, date} = Form.getValue()
        amount= utils.formatAmount(amount)
        date = utils.formatDate(date)
        return {
            description,
            amount,
            date
        }
    },
    clearFilds(){
        Form.description.value= ""
        Form.amount.value= ""
        Form.date.value= ""
    },

 submit(event){

     event.preventDefault()
     

   try {
    const transaction = Form.formatValue()
    Form.validateFilds()
    Transaction.add(transaction)
    Form.clearFilds()
    Modal.Close()
    
   } catch (error) {
       alert(error.message)
   }
  
    
 },

 
}

const app= {
    init(){
        Transaction.all.forEach( transaction => {
            DOM.addtrasition(transaction)
        })
        DOM.updateBalance()
        Storage.set(Transaction.all)
       
    },
    reload(){
        DOM.clearTransaction()
        app.init()
    }
}
 app.init()


 