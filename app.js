var DOMstrings = (function() {
  return {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list"
  };
})();

//BUDGET CONTROLLER
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(element => {
      sum = sum + element.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, desc, val) {
      var newItem, ID;

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1; //create ID
      } else {
        ID = 0;
      }

      if (type === "inc") {
        newItem = new Income(ID, desc, val);
      } else if (type === "exp") {
        newItem = new Expense(ID, desc, val);
      }

      data.allItems[type].push(newItem);
      return newItem;
    },
    calculateBudget: function() {
      calculateTotal("exp");
      calculateTotal("inc");
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        percentage: data.percentage,
        totalIncome: data.totals.inc,
        totalExpenses: data.totals.exp
      };
    },
    testing: function() {
      console.log(data);
    }
  };
})();

//UI CONTROLLER
var UIController = (function() {
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //"inc" or "exp"
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      var html, newHtml, element;
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
      }
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    clearFields: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );
      var fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(element => {
        element.value = "";
        element.description = "";
      });
      fieldsArray[0].focus();
    }
  };
})();

//CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
  var iniciarEventos = function() {
    document
      .querySelector(DOMstrings.inputButton)
      .addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var updateBudget = function() {
    budgetController.calculateBudget();
    var budget = budgetController.getBudget;
  };

  var ctrlAddItem = function() {
    var input = UIController.getInput();

    if (input.description != "" && !isNaN(input.value) && input.value > 0) {
      var newItem = budgetController.addItem(
        input.type,
        input.description,
        input.value
      );

      UIController.addListItem(newItem, input.type);
      UIController.clearFields();
    }
  };
  return {
    init: function() {
      console.log("app started!");
      iniciarEventos();
    }
  };
})(budgetController, UIController);

controller.init();
