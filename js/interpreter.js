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
    this.l = new lexer(code);
    var numVal;
    var word;
    while (word = this.l.nextWord()) {
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
  define(word, code) { this.dictionary[word.toUpperCase()] = code; }
}
function makeVar(terp) {
  var variable = {
    value: 0,
  }
  return function () {
    terp.stack.push(variable);
  }
}
var CommentWords = {
  "/*": function (terp) {
    var nextWord = terp.l.nextWord();
    if (nextWord === null) throw "Unexpected end of input.";
    while (nextWord.substr(-2, 2) !== "*/") {
      nextWord = terp.l.nextWord();
      if (nextWord === null) throw "Unexpected end of input.";
    }
  }
}
var variable_words = {
  "VAR": function (terp) {
    var var_name = terp.l.nextWord();
    if (var_name == null) throw "Unexpected end of input.";
    terp.define(var_name, makeVar(terp))
  },
  "STORE": function (terp) {
    if (terp.stack.length < 2) throw "Not enough items on stack";
    var reference = terp.stack.pop();
    var newValue = terp.stack.pop();
    reference.value = newValue;
  },
  "FETCH": function (terp) {
    if (terp.stack.length < 1) {
      throw "Not enough items on stack.";
    }
    var r = terp.stack.pop();
    terp.stack.push(r.value);
  },
  // "\"": function (terp) {
  //   var collecter = "";
  //   var done = false;
  //   while (!done) {
  //     var nextWord = terp.l.nextWord();
  //     if (nextWord === null) {
  //       throw "Unexpected end of input";
  //     }
  //     if (nextWord.substr(-1, 1) === "\"") {
  //       nextWord = nextWord.slice(0, -1);
  //       collecter += nextWord;
  //       done = true;
  //     } else {
  //       collecter += nextWord + " ";
  //     }
  //   }
  //   terp.stack.push(collecter);
  // }
  "\"": function (terp) {
    terp.stack.push(terp.l.nextCharsUpTo("\""));
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
  "PRINTD": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack";
    var tos = terp.stack.pop(); /// TOS: TOP OF STACK ///
    $(".output").append("<br> > " + tos + ";");
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