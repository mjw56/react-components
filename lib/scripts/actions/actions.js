var constants = require('../constants/constants'),
    service = require('../services/todo-service');

var actions = {
  addTodo: function(text) {
    var _this = this;
    service.addTodo({text: text}).then(function(todo) {
      _this.dispatch(constants.ADD_TODO, todo);
    });
  },

  toggleTodo: function(todo) {
    this.dispatch(constants.TOGGLE_TODO, {todo: todo});
  },

  clearTodos: function() {
    this.dispatch(constants.CLEAR_TODOS);
  },

  deleteTodo: function(todo) {
    var _this = this;
    service.deleteTodo(todo).then(function() {
      _this.dispatch(constants.DELETE_TODO, {todo: todo});
    });
  },

  loadTodos: function() {
    var _this = this;
    service.loadTodos().then(function(todos){
      _this.dispatch(constants.LOAD_TODOS, todos);
    });
  },

  undoTodos: function(undoStates) {
    var _this = this;
    service.deleteTodo(JSON.parse(undoStates.get(undoStates.size-1).item)).then(function() {
      _this.dispatch(constants.UNDO_TODOS);
    });
  }

};

module.exports = actions;
