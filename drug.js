var DEBUG = false;
var Drug = {
  _ratio: {},
  _vanilla: {},
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
      console.log(self._ratio, self._vanilla);
      $(evt.target).parent().siblings('.result').text((self._vanilla[name] * self._ratio[name]).toFixed(2));
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
        var reader = new FileReader();
        reader.onload = function() {
          console.log(this.result);
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
        this.parseLine(line);
      }
    }, this);
  },

  clear: function dr_clear() {
    this.tableBody[0].innerHTML = '';
  },

  parseLine: function dr_parseLine(line) {
    var a = line.split(',');
    if (a.length < 12 + 1) {
      // Do not parse anything is less than 12 columns.
      return;
    }

    var name = a.shift();
    if (name === '') {
      return
    }

    this._dump('=====' + name + '=====');
    var total = 0.0;
    for (var i = 0; i < a.length; i++) {
      var amount = parseFloat(a[i]);
      amount = isNaN(amount) ? 0 : amount;
      this._dump(i+1, amount);
      if (i < 12) {
        total += amount;
      }
    }
    this._vanilla[name] = total;
    var ratio = (name in this._ratio) ? this._ratio[name] : 1.0;
    this.tableBody.append('<tr><td class="name">' + name + '</td>' +
      '<td><input value="' + ratio + '" /></td>' +
      '<td class="vanilla">' + total.toFixed(2) + '</td>' +
      '<td class="result">' + (ratio * total).toFixed(2) + '</td></tr>');
  },

  _dump: function() {
    if (DEBUG) {
      console.log(Array.slice(arguments).concat());
    }
  }
};

Drug.init();