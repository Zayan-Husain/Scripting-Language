class interpreter {
  constructor() {
    this.dictionary = {};
    this.data_stack = [];
    this.compile_buffer = [];
    this.stack = this.data_stack;
    this.immediate = false;
  }
  addWords(newDict) {
    var t = this;
    for (var word in newDict) {
      t.dictionary[word.toUpperCase()] = newDict[word];
    }
  }
  run(code) {
    var t = this;
    t.l = new lexer(code);
    var numVal, word;
    while (word = t.l.nextWord()) {
      word = t.compile(word);
      if (t.immediate) {
        t.interpret(word);
        t.immediate = false;
      } else if (t.isCompiling(word)) {
        t.stack.push(word);
      } else {
        t.interpret(word);
      }
    }
  }
  lookUp(w) { return this.dictionary[w]; }
  define(word, code) { this.dictionary[word.toUpperCase()] = code; }
  startCompiling() { this.stack = this.compile_buffer; }
  isCompiling() { return this.stack === this.compile_buffer; }
  stopCompiling() { this.stack = this.data_stack; }
  compile(w) {
    var t = this;
    w = w.toUpperCase();
    var numVal = parseFloat(w);
    if (t.dictionary[w]) {
      t.immediate = t.dictionary[w].immediate;
      return t.dictionary[w];
    } else if (!isNaN(numVal)) {
      return numVal;
    } else {
      console.log(w)
      throw "Unknown word";
    }
  }
  interpret(w) {
    if (typeof w === "function") {
      w(this);
    } else {
      this.stack.push(w);
    }
  }
}
function makeVar(terp) {
  var variable = {
    value: 0,
  }
  return function () {
    terp.stack.push(variable);
  }
}
function makeWord(code) {
  return function (terp) {
    var oldPointer = terp.codePointer;
    terp.codePointer = 0;
    while (terp.codePointer < code.length) {
      terp.interpret(code[terp.codePointer]);
      terp.codePointer++;
    }
    terp.codePointer = oldPointer;
  }
}
var HTMLCommands = {
  "title1": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack. 'CONTINUE'";
    var h1 = terp.stack.pop();
    h1 = "<h1 class='noBreak'>" + h1 + "</h1>";
    terp.stack.push(h1);
  },
  "title2": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack. 'CONTINUE'";
    var h2 = terp.stack.pop();
    h2 = "<h2 class='noBreak'>" + h2 + "</h2>";
    terp.stack.push(h2);
  },
  "P": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack. 'CONTINUE'";
    var p = terp.stack.pop();
    p = "<p class='noBreak'>" + p + "</p>";
    terp.stack.push(p);
  },
  "COL": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack. 'CONTINUE'";
  }
}
var ControlWords = {
  "?CONTINUE": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack. 'CONTINUE'";
    var cond = terp.stack.pop();
    if (cond) {
      terp.codePointer = Infinity;
    }
  },
  "?LOOP": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack. 'LOOP'";
    var code = terp.stack.pop();
    if (!Array.isArray(code)) throw "List expected. 'LOOP'";
    var codeWord = makeWord(code);
    var oldBreakState = terp.breakState;
    terp.breakState = false;
    while (!terp.breakState) codeWord(terp);
    terp.breakState = oldBreakState;
  },
  "?BREAK": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack. 'BREAK'";
    var cond = terp.stack.pop();
    if (cond) {
      terp.codePointer = Infinity;
      terp.breakState = true;
    }
  },
  ">": function (terp) {
    if (terp.stack.length < 2) throw "Not enough items on stack. '>'";
    var term2 = terp.stack.pop();
    var term1 = terp.stack.pop();
    terp.stack.push(term1 > term2);
  },
}
var ListWords = {
  "[": function (terp) {
    var list = [];
    var oldStack = terp.stack;
    terp.stack = list;
    while (true) {
      var nextWord = terp.l.nextWord();
      if (nextWord === null) {
        throw "Unexpected end of input.";
      }
      if (nextWord === "]") {
        break;
      }
      nextWord = terp.compile(nextWord);
      if (nextWord.immediate) {
        terp.interpret(nextWord);
      } else {
        terp.stack.push(nextWord)
      }
    } //end while loop
    terp.stack = oldStack;
    terp.stack.push(list);
  },
  "LENGTH": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack.";
    var obj = terp.stack.pop();
    terp.stack.push(obj.length)
  },
  "ITEM": function (terp) {
    if (terp.stack.length < 2) throw "Not enough items on stack.";
    var key = terp.stack.pop(),
      obj = terp.stack.pop();
    if (typeof obj === "object") terp.stack.push(obj[key]);
    else throw "Object expected.";
  },
  "RUN": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack.";
    var arr = terp.stack.pop();
    if (!Array.isArray(arr)) throw "List expected";
    terp.interpret(makeWord(arr))
  }
}
var compiling_words = {
  "DEF": function (terp) {
    var newWord = terp.l.nextWord(); //
    if (newWord === null) throw "Unexpected end of input. 'DEF'"; //
    terp.latest = newWord; //
    terp.startCompiling(); //
  },
  "END": function (terp) {
    var newCode = terp.stack.slice(0); //get new stack
    terp.stack.length = 0; //clear compile buffer
    console.log(terp.latest);
    terp.define(terp.latest, makeWord(newCode)); //define the function
    terp.stopCompiling();
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