// Budget controller
var budgetController = (function() {
  // some code
})();

// UI controller
var uIController = (function() {
  var domStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn"
  };
  return {
    getInputValues: function() {
      return {
        type: document.querySelector(domStrings.inputType).value,
        description: document.querySelector(domStrings.inputDescription).value,
        value: document.querySelector(domStrings.inputValue).value
      };
    },
    getDOMStrings: function() {
      return domStrings;
    }
  };
})();

// Global App controller
var controller = (function(budgetCtr, UICtr) {
  var DOM = UICtr.getDOMStrings();
  var addItem = function() {
    var inputs = UICtr.getInputValues();
    console.log(inputs);
  };
  document.querySelector(DOM.addBtn).addEventListener("click", addItem);
  document.addEventListener("keypress", function(e) {
    if (e.keyCode === 13 || e.which === 13) {
      addItem();
    }
  });
})(budgetController, uIController);
