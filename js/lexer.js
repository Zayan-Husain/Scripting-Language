class lexer {
  constructor(code) {
    this.words = code; // Split by space
    this.position = 0;
  }
  nextWord() {
    var t = this;
    if (t.position >= t.words.length) {
      return null;
    }
    while (this.isWhiteSpace(t.words.charAt(t.position))) { ///////////////SEARCHES FOR WHITE SPACES
      this.position++;
      if (t.position >= t.words.length) {
        return null;
      }
    }
    var endWord = t.position;
    //////////SEARCH FOR NOT WHITESPACE/////
    while (!this.isWhiteSpace(this.words.charAt(endWord))) {
      endWord++;
      if (endWord >= t.words.length) {
        break;
      }
    }
    var collector = t.words.substring(t.position, endWord);
    endWord++;
    this.position = endWord;
    return collector;
  }
  isWhiteSpace(c) { return c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\v"; }
  nextCharsUpTo(c) {
    if (this.position >= this.words.length) {
      return null;
    }
    var newPos = this.position;
    while (this.words.charAt(newPos) != c) {
      newPos++;
      if (newPos >= this.words.length) {
        throw "Unexpected end of input";
      }
    }
    var collector = this.words.substring(this.position, newPos);
    newPos++;
    this.position = newPos;
    return collector;
  }
}