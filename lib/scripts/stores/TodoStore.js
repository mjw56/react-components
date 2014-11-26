var Fluxxor = require('fluxxor'),
    constants = require('../constants/constants'),
    socket = require('socket.io-client')('http://localhost:8080');

var TodoStore = Fluxxor.createStore({
  initialize: function() {
    this.todos = [];

    this.bindActions(
      constants.ADD_TODO, this.onAddTodo,
      constants.TOGGLE_TODO, this.onToggleTodo,
      constants.CLEAR_TODOS, this.onClearTodos,
      constants.DELETE_TODO, this.onDeleteTodo,
      constants.LOAD_TODOS, this.onLoadTodos
    );
  },

  onAddTodo: function(payload) {
    this.todos.push({text: payload.text, complete: false});
    this.emit("change");
  },

  onToggleTodo: function(payload) {
    payload.todo.complete = !payload.todo.complete;
    this.emit("change");
  },

  onClearTodos: function() {
    this.todos = this.todos.filter(function(todo) {
      return !todo.complete;
    });
    this.emit("change");
  },

  onDeleteTodo: function(payload) {
    for(var i=0; i < this.todos.length; i++) {
      if(this.todos[i].text   === payload.todo.text) {
        break;
      }
    }

    this.todos.splice(i, 1);

    this.emit("change");
  },

  onLoadTodos: function() {
    //lol
    var _this = this;
    socket.on('init-data-payload', function(todos) {
      for(var i = 0; i < todos.length; i++) {
        _this.todos.push({text: todos[i].text, complete: false });
        _this.emit("change");
      }
    });

    socket.emit('get-init-data');
  },

  getState: function() {
    return {
      todos: this.todos
    };
  }
});

module.exports = TodoStore;
