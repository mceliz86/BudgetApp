var DOMstrings = (function() {
  return {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expPercentagesLabel: ".item__percentage"
  };
})();

//BUDGET CONTROLLER
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalInc) {
    if (data.totals.inc > 0) {
      this.percentage = Math.round((this.value / totalInc) * 100);
      //percentage;
    } else {
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercentage = function() {
    return this.percentage;
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
    deleteItem: function(type, id) {
      var ids, index;

      ids = data.allItems[type].map(function(e) {
        return e.id;
      });

      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: function() {
      calculateTotal("exp");
      calculateTotal("inc");
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }
    },
    calculatePercentages: function() {
      data.allItems["exp"].forEach(element => {
        element.calcPercentage(data.totals.inc);
      });
    },
    getPorcentages: function() {
      var allPorcentages = data.allItems["exp"].map(function(e) {
        return e.percentage;
      });
      return allPorcentages;
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
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage"></div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
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
    },
    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent =
        obj.totalIncome;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExpenses;
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "%";
      }
    },
    deleteListItem: function(selectorId) {
      var elementToRemove = document.getElementById(selectorId);
      elementToRemove.parentNode.removeChild(elementToRemove);
    },
    displayPercentages: function(percArray) {
      var fields = document.querySelectorAll(DOMstrings.expPercentagesLabel);

      var nodeListForEach = function(nodeList, functionCallback) {
        for (var i = 0; i < nodeList.length; i++) {
          functionCallback(nodeList[i], i);
        }
      };

      nodeListForEach(fields, function(current, item) {
        if (percArray[item] > 0) {
          current.textContent = percArray[item] + " %";
        } else {
          current.textContent = "-";
        }
      });
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

    document
      .querySelector(DOMstrings.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function() {
    budgetCtrl.calculateBudget();
    var budget = budgetCtrl.getBudget();
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function() {
    budgetCtrl.calculatePercentages();
    var percentages = budgetCtrl.getPorcentages();
    console.log(percentages);
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function() {
    var input = UIController.getInput();

    if (input.description != "" && !isNaN(input.value) && input.value > 0) {
      var newItem = budgetCtrl.addItem(
        input.type,
        input.description,
        input.value
      );

      UICtrl.addListItem(newItem, input.type);
      UICtrl.clearFields();
      updatePercentages();
      updateBudget();
    }
  };

  var ctrlDeleteItem = function(event) {
    var splitID, itemID, type, id;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
      budgetCtrl.deleteItem(type, ID);
      UICtrl.deleteListItem(itemID);
      updatePercentages();
      updateBudget();
    }
  };

  return {
    init: function() {
      console.log("app started!");
      UICtrl.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpenses: 0,
        percentage: 0
      });
      iniciarEventos();
    }
  };
})(budgetController, UIController);

controller.init();
