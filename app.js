// Budget controller
var budgetController = (function () {
  var Expenses = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value
  }
  var Incomes = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value
  }

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }
  return {
    addNewItem: function (type, des, val) {
      var newItem, ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1
        console.log(ID)
      }

      else ID = 0;

      if (type === 'exp') {
        newItem = new Expenses(ID, des, val)
      } else if (type === 'inc') {
        newItem = new Incomes(ID, des, val)
      }
      data.allItems[type].push(newItem)
    },
    test: function () {
      console.log(data);

    }
  }


})();


// UI controller
var uIController = (function () {
  var domStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn"
  };
  return {
    getInputValues: function () {
      return {
        type: document.querySelector(domStrings.inputType).value,
        description: document.querySelector(domStrings.inputDescription).value,
        value: document.querySelector(domStrings.inputValue).value
      };
    },
    getDOMStrings: function () {
      return domStrings;
    }
  };
})();

// Global App controller
var controller = (function (budgetCtr, UICtr) {
  var setUpEventLestiners = function () {
    var DOM = UICtr.getDOMStrings();
    document.querySelector(DOM.addBtn).addEventListener("click", addItem);
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        addItem();
      }
    });
  }

  var addItem = function () {
    var inputs = UICtr.getInputValues();
    budgetCtr.addNewItem(inputs.type, inputs.description, inputs.value)
  };

  return {
    init: function () {
      setUpEventLestiners()
    }
  }

})(budgetController, uIController);

controller.init();