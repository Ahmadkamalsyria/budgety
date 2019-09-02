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
    },
    budget: 0,
    percentage: -1
  }
  var calculateTotals = function (type) {
    var sum = 0;
    data.allItems[type].forEach(item => {
      sum += item.value;
    })
    data.totals[type] = sum;
  }

  return {
    getBudget: function () {
      return {
        percentage: data.percentage,
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp

      }
    },
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
      data.allItems[type].push(newItem);
      return newItem;
    },
    updateData: function () {
      // calculate income and expenses
      calculateTotals('exp');
      calculateTotals('inc');
      //calculate budget
      data.budget = data.totals.inc - data.totals.exp;
      //calculate percentage
      if (data.totals.inc > 0) {
        data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
      } else
        data.percentage = -1
    }


  }


})();


// UI controller
var uIController = (function () {
  var domStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    expenseList: ".expenses__list",
    incomeList: ".income__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage"

  };
  return {
    getInputValues: function () {
      return {
        type: document.querySelector(domStrings.inputType).value,
        description: document.querySelector(domStrings.inputDescription).value,
        value: parseFloat(document.querySelector(domStrings.inputValue).value)
      };
    },
    displayBudget: function (obj) {
      document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(domStrings.expenseLabel).textContent = obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(domStrings.percentageLabel).textContent = obj.percentage;
      } else
        document.querySelector(domStrings.percentageLabel).textContent = '--';
    },
    addNewItemToTheDom: function (obj, type) {

      var html, newHtml, element;
      // get the html 
      if (type === 'inc') {
        // get the income html
        element = domStrings.incomeList;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      else if (type === 'exp') {
        // get the expense html
        element = domStrings.expenseList;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      // replace the static values with a placeholders
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // display 

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function () {
      // var des, val;
      // des = document.querySelector(domStrings.inputDescription);
      // val = document.querySelector(domStrings.inputValue);
      // des.value = '';
      // val.value = '';
      var elements;
      elements = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue);
      elementsArray = Array.prototype.slice.call(elements);
      elementsArray.forEach(function (current, index, array) {
        current.value = "";

      });
      elementsArray[0].focus();
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
  var updateBudget = function () {
    budgetCtr.updateData()
    var data = budgetCtr.getBudget();
    UICtr.displayBudget(data)
  }

  var addItem = function () {
    var inputs = UICtr.getInputValues();

    if (inputs.description !== '' && !isNaN(inputs.value)) {
      var item = budgetCtr.addNewItem(inputs.type, inputs.description, inputs.value);
      console.log(item);
      UICtr.addNewItemToTheDom(item, inputs.type);
      UICtr.clearFields()
      updateBudget();
    }

  };

  return {
    init: function () {
      setUpEventLestiners()
      UICtr.displayBudget({
        percentage: 0,
        budget: 0,
        totalInc: 0,
        totalExp: 0

      })
    }
  }

})(budgetController, uIController);

controller.init();