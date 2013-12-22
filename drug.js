 (function(window) {
  var DEBUG = false;
  var Drug = {
    _ratio: {},
    _vanilla: {},
    result: $('#result'),
    file: document.getElementById('file'),
    input: document.getElementById('drug'),
    parseButton: document.getElementById('parse'),
    tableBody: $('#tbody'),

    init: function dr_init() {
      this.input.addEventListener('change', this);
      var self = this;
      this.parseButton.addEventListener('click', this);
      this.tableBody.change(function onchange(evt) {
        var name = $(evt.target).parent().siblings('.name').text();
        self._dump(name, $(evt.target).val());

        self._ratio[name] = parseFloat($(evt.target).val());
        self.parse();
      });

      if (this.input.value !== '') {
        this.parse();
      }
    },

    handleEvent: function dr_handleEvent(evt) {
      switch (evt.target) {
        case this.parseButton:
          this.parse();
          break;
        case this.file:
          var self = this;
          var reader = new FileReader();
          reader.onload = function() {
            self._dump(this.result);
          };
          reader.readAsText(this.file);
          break;
        case this.input:
          this.parse();
          break;
      }
    },

    parse: function dr_parseAll() {
      this.clear();
      this.input.value.split('\n').forEach(function(line, index) {
        if (index > 2) {
          var result = this.parseLine(line);
          this.result.text(this.result.text() + result + '\r');
        } else {
          this.result.text(this.result.text() + line + '\r');
        }
      }, this);
    },

    clear: function dr_clear() {
      this.tableBody[0].innerHTML = '';
      this.result[0].innerHTML = '';
    },

    parseLine: function dr_parseLine(line) {
      var newArray = [];
      var a = line.split(',');
      if (a.length < 12 + 1) {
        // Do not parse anything is less than 12 columns.
        return line;
      }

      var name = a.shift();
      if (name === '') {
        return line;
      }

      var ratio = (name in this._ratio) ? this._ratio[name] : 1.0;
      this._dump('=====' + name + '=====');
      var total = 0.0;
      newArray.push(name);
      for (var i = 0; i < a.length; i++) {
        var amount = parseFloat(a[i]);
        amount = isNaN(amount) ? 0 : amount;
        this._dump(i+1, amount);
        if (i < 12) {
          total += amount;
          newArray.push(amount ? (amount * ratio).toFixed(1) : '');
        } else {
          newArray.push(a[i]);
        }        
      }
      this._vanilla[name] = total;
      
      var result = (ratio * total).toFixed(1);
      this.tableBody.append('<tr><td class="name">' + name + '</td>' +
        '<td><input value="' + ratio + '" /></td>' +
        '<td class="vanilla">' + total.toFixed(1) + '</td>' +
        '<td class="result">' + result + '</td></tr>');

      newArray.push(result);
      return newArray.concat(',');
    },

    _dump: function() {
      if (DEBUG) {
        console.log(Array.slice(arguments).concat());
      }
    }
  };

  Drug.init();
  window.Drug = Drug;
}(this));
