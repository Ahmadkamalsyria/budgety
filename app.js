// Budget controller
var budgetController = (function () {
  var Expenses = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }
  Expenses.prototype.calculatePercentages = function (totalIncome) {
    if (totalIncome > 0) {
      return this.percentage = Math.round((this.value / totalIncome) * 100);
    }
    else return -1;
  }
  Expenses.prototype.getPercentage = function () {
    return this.percentage;
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
    deleteItem: (type, id) => {
      console.log(type);
      var idArray, index;
      idArray = data.allItems[type].map(item => {
        return item.id
      })
      index = idArray.indexOf(id);
      data.allItems[type].splice(index, 1);
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
    },
    updatePercentage: function () {
      data.allItems.exp.map(cur => {
        cur.calculatePercentages(data.totals.inc);
      })

    },
    getPercentage: function () {
      return data.allItems.exp.map(cur => {
        return cur.getPercentage();
      })
    },
    test: function () {
      console.log(data)
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
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    itemPercentage: ".item__percentage",
    date: ".budget__title--month"

  };
  var formatNumber = function (number, type) {
    var numSplit, int, dec;
    number = Math.abs(number);
    number = number.toFixed(2);
    numSplit = number.split(".");
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, int.length)
    }
    dec = numSplit[1];
    return (type === 'inc' ? '+' : '-') + ' ' + int + '.' + dec
  };
  var loopOverNodes = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i)
    }
  }

  return {
    getInputValues: function () {
      return {
        type: document.querySelector(domStrings.inputType).value,
        description: document.querySelector(domStrings.inputDescription).value,
        value: parseFloat(document.querySelector(domStrings.inputValue).value)
      };
    },
    displayBudget: function (obj) {
      var type;
      obj.value > 0 ? type = "inc" : type = "exp";
      document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(domStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
      if (obj.percentage > 0) {
        document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + "%";
      } else
        document.querySelector(domStrings.percentageLabel).textContent = '--';
    },
    displayPercentage: function (percentage) {
      var fields = document.querySelectorAll(domStrings.itemPercentage);



      loopOverNodes(fields, function (current, index) {
        if (percentage[index] > 0) { current.textContent = percentage[index] + '%'; }
        else current.textContent = '---';

      })

    },
    displayDates: () => {
      var now, months, month, year;
      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'oct', 'Nov', 'Dec'];

      document.querySelector(domStrings.date).textContent = months[month] + ' ' + year;

    },
    addNewItemToTheDom: function (obj, type) {

      var html, newHtml, element;
      // get the html 
      if (type === 'inc') {
        // get the income html
        element = domStrings.incomeList;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      else if (type === 'exp') {
        // get the expense html
        element = domStrings.expenseList;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      // replace the static values with a placeholders
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // display 

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    deleteItem: id => {
      var element = document.getElementById(id);
      element.parentNode.removeChild(element);
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
    typeChanged: () => {
      var fields = document.querySelectorAll(
        domStrings.inputType + ',' +
        domStrings.inputDescription + ',' +
        domStrings.inputValue
      );
      loopOverNodes(fields, function (cur) {
        cur.classList.toggle('red-focus')
      })
      document.querySelector(domStrings.addBtn).classList.toggle('red')

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

    document.querySelector(DOM.container).addEventListener("click", handleDeleteElement);
    document.querySelector(DOM.inputType).addEventListener("change", UICtr.typeChanged)
  }
  var updateBudget = function () {
    budgetCtr.updateData()
    var data = budgetCtr.getBudget();
    UICtr.displayBudget(data)
  }
  var updatePercentage = () => {
    budgetCtr.updatePercentage();
    var percentage = budgetCtr.getPercentage();
    uIController.displayPercentage(percentage);

  }


  var addItem = function () {
    var inputs = UICtr.getInputValues();

    if (inputs.description !== '' && !isNaN(inputs.value)) {
      var item = budgetCtr.addNewItem(inputs.type, inputs.description, inputs.value);

      UICtr.addNewItemToTheDom(item, inputs.type);
      UICtr.clearFields()
      updateBudget();
      updatePercentage();
    }

  };
  var handleDeleteElement = event => {
    var element, splitID, type, id;
    element = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (element) {
      splitID = element.split("-");
      type = splitID[0];
      id = parseInt(splitID[1]);
      budgetCtr.deleteItem(type, id);
      uIController.deleteItem(element);
      updateBudget();
    }

  }
  return {
    init: function () {
      setUpEventLestiners();
      uIController.displayDates();
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