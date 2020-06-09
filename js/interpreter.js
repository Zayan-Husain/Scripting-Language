class interpreter {
  constructor() {
    this.dictionary = {};
    this.stack = [];
  }
  addWords(newDict) {
    var t = this;
    for (var word in newDict) {
      t.dictionary[word.toUpperCase()] = newDict[word];
    }
  }
  run(code) {
    var t = this;
    var l = new lexer(code);
    var numVal;
    var word;
    while (word = l.nextWord()) {
      word = word.toUpperCase();
      numVal = parseFloat(word);
      if (t.dictionary[word]) {
        t.dictionary[word](this);
      } else if (!isNaN(numVal)) {
        t.stack.push(numVal);
      } else {
        throw "Unknown Word.";
      }
    }
  }
}
var PrintingWords = {
  // Print and discard top of stack.
  "PRINT": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack";
    var tos = terp.stack.pop(); alert(tos); /// TOS: TOP OF STACK ///
  },
  // Print out the contents of the stack.
  "PSTACK": function (terp) {
    alert(terp.stack);
  },
  "PRINTC": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack";
    var tos = terp.stack.pop(); console.log(tos); /// TOS: TOP OF STACK ///
  },
  "": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack";
    var tos = terp.stack.pop(); alert(tos); /// TOS: TOP OF STACK ///
  },
};
var MathWords = {
  "+": function (terp) {
    if (terp.stack.length < 2) throw "Not enough items on stack";
    var tos = terp.stack.pop();
    var _2os = terp.stack.pop();
    terp.stack.push(_2os + tos);
  },
  "-": function (terp) {
    if (terp.stack.length < 2) throw "Not enough items on stack";
    var tos = terp.stack.pop();
    var _2os = terp.stack.pop();
    terp.stack.push(_2os - tos);
  },
  "*": function (terp) {
    if (terp.stack.length < 2) throw "Not enough items on stack";
    var tos = terp.stack.pop();
    var _2os = terp.stack.pop();
    terp.stack.push(_2os * tos);
  },
  "/": function (terp) {
    if (terp.stack.length < 2) throw "Not enough items on stack";
    var tos = terp.stack.pop();
    var _2os = terp.stack.pop();
    terp.stack.push(_2os / tos);
  },
  "SQRT": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack";
    var tos = terp.stack.pop();
    terp.stack.push(Math.sqrt(tos));
  }
};
var StackWords = {
  // Duplicate the top of stack (TOS).
  "DUP": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack";
    var tos = terp.stack.pop();
    terp.stack.push(tos);
    terp.stack.push(tos);
  },
  // Throw away the TOS -- the opposite of DUP.
  "DROP": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack";
    terp.stack.pop();
  },
  // Exchange positions of TOS and second item on stack (2OS).
  "SWAP": function (terp) {
    if (terp.stack.length < 2) throw "Not enough items on stack";
    var tos = terp.stack.pop();
    var _2os = terp.stack.pop();
    terp.stack.push(tos);
    terp.stack.push(_2os);
  },
  // Copy 2OS on top of stack.
  "OVER": function (terp) {
    if (terp.stack.length < 2) throw "Not enough items on stack";
    var tos = terp.stack.pop();
    var _2os = terp.stack.pop();
    terp.stack.push(_2os);
    terp.stack.push(tos);
    terp.stack.push(_2os);
  },
  // Bring the 3rd item on stack to the top.
  "ROT": function (terp) {
    if (terp.stack.length < 3) throw "Not enough items on stack";
    var tos = terp.stack.pop();
    var _2os = terp.stack.pop();
    var _3os = terp.stack.pop();
    terp.stack.push(_2os);
    terp.stack.push(tos);
    terp.stack.push(_3os);
  },
};