var DOMstrings = (function() {
  return {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn"
  };
})();

//BUDGET CONTROLLER
var budgetController = (function() {
  //some code

  return {
    //some code
  };
})();

//UI CONTROLLER
var UIController = (function() {
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    }
  };
})();

//CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
  var ctrlAddItem = function() {
    var input = UIController.getInput();
    console.log(input);
  };

  document
    .querySelector(DOMstrings.inputButton)
    .addEventListener("click", ctrlAddItem);

  document.addEventListener("keypress", function(e) {
    if (e.keyCode === 13 || e.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
