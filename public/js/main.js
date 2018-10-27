var app = new Vue({
  el: '#app',
  data: function () {
    return {
      values: [],
      operate: false,
      complete: false,
      history: []
    }
  },
  methods: {
    clear: function () {
      this.values = [];
      this.operate = false
      this.complete = false
    },
    backspace: function () {
      this.values.splice(-1,1);
    },
    handleKeyPress: function (key) {
      if (this.values.length == 0) {
        this.values.push(key);
        this.operate = false;
      } else {
        if (!this.complete) {
          if (key === '00') {
            this.values.push(0, 0);
          }else {
            this.values.push(key);
            this.operate = false;
          }
        } else {
          this.values= [key];
          this.operate = false;
          this.complete = false;
        }
      }
    },
    handleOperation: function (operateKey){
      if (this.values.length != 0 || !this.complete) {
        if (operateKey !== 'x2' && operateKey !== 'radic') {
          if (this.operate) {
            this.values.splice(-1,1);
            this.values.push(operateKey);
          } else {
            this.values.push(operateKey);
            this.operate = true;
          }
        } else if (operateKey === 'radic' && this.operate || this.values.length === 0) {
          this.values.push('&radic;');
        } else if (operateKey === 'x2') {
          var reverse = [];
          for(var i = 0; i < this.values.length; i++){
            var index = this.values.length - (i + 1);
            reverse[index] = this.values[i]
          }
          var powRevers = [];
          for (var j = 0; j < reverse.length; j++) {
            if (Number.isInteger(reverse[j])) {
              this.values.pop();
              powRevers.push(reverse[j]);
            } else {
              break;
            }
          }
          var pow = powRevers.reverse();
          this.values.push(pow.join('') + '2'.sup());
        }
      }
    },
    calc: function () {
      var task = this.values.join('');
      var radic = false;
      var sqrt = '';
      var removeIndex = [];
      for (var i = 0; i < this.values.length; i++) {
        if (/<sup>2<\/sup>/.test(this.values[i].toString())) {
          var pow = /([0-9]+)<sup>2<\/sup>/.exec(this.values[i])[1];
          this.values[i] = Math.pow(pow, 2);
        } else if (this.values[i] === '&radic;') {
          radic = true; // /&radical;([0-9]+)/.exec(str);
          removeIndex.push(i);
        }

        if (radic && Number.isInteger(this.values[i])) {
          sqrt += this.values[i].toString();
          if (typeof this.values[i + 1] === 'string' || this.values[i + 1] == null) {
            this.values[i] = Math.sqrt(sqrt);
            radic = false;
          } else {
            removeIndex.push(i);
          }
        }
      }

      for (var rmIndex = 0; rmIndex < removeIndex.length; rmIndex++) {
        delete this.values[removeIndex[rmIndex]];
      }

      var taskEval = this.values.join('');
      var result = eval(taskEval);
      this.history.push(task + ' = ' + result);
      this.values = [result];
      this.complete = true;

      this.$http.post('http://localhost:3000/history', {task, result})
        .then(function(response){ return response.json() });
    },
    clearHistory: function () {
      this.$http.delete('http://localhost:3000/history')
        .then(function (response){ return response.json() })
        .then(function (results) { if (results.ok) this.history = []; })
    }
  },
  beforeMount: function () {
    this.$http.get('http://localhost:3000/history')
        .then(function(response){ return response.json() })
        .then(function(histories){
          for (var i = 0; i < histories.length; i++) {
            this.history.push(histories[i].task + ' = ' + histories[i].result);
          }
        });
  },
  mounted: function() {
    var vm = this;
    window.addEventListener('keyup', function(event) {
      var key = event.keyCode;
      this.console.log(key);
      if (event.shiftKey && key === 56) {
        vm.handleOperation('*');
      } else if (key >= 48 && key <= 57) {
        vm.handleKeyPress(key - 48);
      } else if (key === 189) {
        vm.handleOperation('-');
      } else if (key === 187) {
        vm.handleOperation('+');
      } else if (key === 13) {
        vm.calc();
      } else if (key === 8) {
        vm.backspace();
      } else if (key === 191) {
        vm.handleOperation('/');
      } else if (key === 190) {
        vm.handleOperation('.');
      }
    });
  }
});