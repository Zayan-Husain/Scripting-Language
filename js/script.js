var i;
$(document).ready(function () {
  var script = "";
  i = new interpreter();
  i.addWords(PrintingWords);
  i.addWords(MathWords);
  i.addWords(StackWords);
  i.addWords(variable_words);
  // i.run(script);
  runCode();
});
var runCode = () => {
  $(".container").on("click", ".btn", function () {
    var code = $("._code").val();
    i.run(code);
  })
}