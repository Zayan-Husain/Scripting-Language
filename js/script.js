var i;
$(document).ready(function () {
  var script = "";
  i = new interpreter();
  i.addWords(PrintingWords);
  i.addWords(MathWords);
  i.addWords(StackWords);
  i.addWords(CommentWords);
  i.addWords(variable_words);
  i.addWords(compiling_words);
  i.addWords(ListWords);
  i.addWords(ControlWords);
  i.addWords(HTMLCommands);
  compiling_words["DEF"].immediate = true;
  ListWords["["].immediate = true;
  compiling_words["END"].immediate = true;
  variable_words["VAR"].immediate = true;
  variable_words["\""].immediate = true;
  CommentWords["/*"].immediate = true;
  // i.run(script);
  runCode();
});
var runCode = () => {
  $(".container").on("click", ".btn", function () {
    var code = $("._code").val();
    i.run(code);
  })
}