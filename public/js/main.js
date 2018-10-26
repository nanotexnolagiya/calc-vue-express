var app = new Vue({
  el: '#app',
  data () {
    return {
      values: [],
      operate: false,
      complete: false,
      history: []
    }
  },
  methods: {
    clear () {
      this.values = [];
    },
    handleKeyPress (key) {
      if (this.values.length == 0) {
        this.values.push(key);
        this.operate = false;
      } else {
        if (!this.complete) {
          this.values.push(key);
          this.operate = false;
        } else {
          this.values= [key];
          this.operate = false;
          this.complete = false;
        }
      }
      console.log(this.values);
    },
    handleOperation (operateKey){
      if (this.values.length != 0 || !this.complete) {
        if (this.operate) {
          this.values.splice(-1,1);
          this.values.push(operateKey);
        } else {
          this.values.push(operateKey);
          this.operate = true;
        }
      }
    },
    calc() {
      var task = this.values.join('');
      var result = eval(task);
      this.history.push(task + ' = ' + result);
      this.values = [result];
      this.complete = true;

      this.$http.post('http://localhost:3000/history', {task, result})
        .then(function(response){response.json()})
        .then(function(res){
          console.log(res);
        });
    }
  },
  beforeMount () {
    this.$http.get('http://localhost:3000/history')
        .then(function(response){ return response.json() })
        .then(function(histories){
          for (var i = 0; i < histories.length; i++) {
            this.history.push(histories[i].task + ' = ' + histories[i].result);
          }
        });
  }
});