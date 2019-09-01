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
      data.allItems[type].push(newItem);
      return newItem;
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
    incomeList: ".income__list"
  };
  return {
    getInputValues: function () {
      return {
        type: document.querySelector(domStrings.inputType).value,
        description: document.querySelector(domStrings.inputDescription).value,
        value: document.querySelector(domStrings.inputValue).value
      };
    },
    addNewItemToTheDom: function (obj, type) {
      console.log(obj);
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
      console.log(element);
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
    var item = budgetCtr.addNewItem(inputs.type, inputs.description, inputs.value);
    console.log(item);
    UICtr.addNewItemToTheDom(item, inputs.type);
  };

  return {
    init: function () {
      setUpEventLestiners()
    }
  }

})(budgetController, uIController);

controller.init();