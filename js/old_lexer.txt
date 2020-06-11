class lexer {
  constructor(code) {
    this.words = code.split(/\s+/); // Split by space
    this.next = 0;
  }
  nextWord() {
    var t = this;
    if (t.next >= t.words.length) {
      return null;
    }
    return t.words[t.next++];
  }
}