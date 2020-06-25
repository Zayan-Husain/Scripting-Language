var HTMLCommands = {
  "title1": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack. 'title1'";
    var h1 = terp.stack.pop();
    h1 = `<h1>${h1}</h1>`;
    terp.html_stack.push(h1);
  },
  "title2": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack. 'title2'";
    var h2 = terp.stack.pop();
    h2 = `<h2>${h2}</h2>`;
    terp.html_stack.push(h2);
  },
  "title3": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack. 'title3'";
    var h3 = terp.stack.pop();
    h3 = `<h3>${h3}</h3>`;
    terp.html_stack.push(h3);
  },
  "title4": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack. 'title4'";
    var h4 = terp.stack.pop();
    h4 = `<h4>${h4}</h4>`;
    terp.html_stack.push(h4);
  },
  "P": function (terp) {
    if (terp.stack.length < 1) throw "Not enough items on stack. 'P'";
    var p = terp.stack.pop();
    var _class;
    if (terp.stack.length < 1) { _class = ""; }
    else { _class = terp.stack.pop(); }
    p = `<p class="${_class}">${p}</p>`;
    terp.html_stack.push(p);
  },
  "COL": function (terp) {
    //size of col
    var coln, colns, _class;
    //stupid proof
    //first
    if (terp.stack.length < 1) { coln = 12; }
    else { coln = terp.stack.pop(); }
    //second
    if (terp.stack.length < 1) { colns = 12; }
    else { colns = terp.stack.pop(); }
    //third
    if (terp.stack.length < 1) { _class = "" }
    else { _class = terp.stack.pop(); }
    //auto close tag
    if (terp.did_col) { terp.html_stack.push("</div>"); }
    terp.html_stack.push(`<div class ='col s${colns} l${coln} ${_class}'>`);
    terp.did_col = true;
  },
  "ROW": function (terp) {
    var _class;
    if (terp.stack.length < 1) { _class = ""; }
    else { _class = terp.stack.pop(); }
    //auto close tag
    if (terp.did_row) { terp.html_stack.push("</div></div><!--end row-->"); }
    terp.html_stack.push(`<div class ='row ${_class}'>`);
    terp.did_col = false;
    terp.did_row = true;
  },
  "IMG": function (terp) {
    var src, _class;
    if (terp.stack.length < 1) { src = imgPlaceholderUrl; }
    else { src = terp.stack.pop(); }
    if (terp.stack.length < 1) { _class = ""; }
    else { _class = terp.stack.pop(); }
    terp.html_stack.push(`<img src='${src}' class='responsive-img ${_class}' />`);
  },
  "MENU": function (terp) {
    var imageURL = terp.stack.pop(), URLs, names; /////imageURL is the first argument from the right before "MENU"
    if (Array.isArray(imageURL)) { /////////////// if they didn't put an image string
      URLs = imageURL;
      imageURL = imgPlaceholderUrl;
      names = terp.stack.pop();
    } else {
      // imageURL = terp.stack.pop();
      URLs = terp.stack.pop();
      names = terp.stack.pop();
    }
    var html = `<div class="menu"><nav>`;
    html += `<div class="col l2 s7 logo"><img src="${imageURL}" class="responsive-img col l8 s12" /></div>`;
    html += `<div class="col l6 menuList">`;
    html += `<a href="#" data-target="mobile-menu" class="sidenav-trigger"><i class="material-icons">menu</i></a>`;
    html += `<ul class="hide-on-med-and-down">`;
    html += createMenuLIs(names, URLs);
    html += `</ul><ul id="mobile-menu" class="sidenav">`;
    html += createMenuLIs(names, URLs);
    html += "</ul></div></nav></div>";
    terp.html_stack.push(html);
  },
  "MENU2": function (terp) {
    var URLs, names;
    if (terp.stack.length < 1) URLs = ["#/", "#/", "#/"];
    else URLs = terp.stack.pop();
    if (terp.stack.length < 1) names = ["Link 1", "Link 2", "Link 3"];
    else names = terp.stack.pop();
    var html = `<div class="menu"><nav>`;
    html += `<div class="col l1"></div>`;
    html += `<div class="col l10 menuList">`;
    html += `<a href="#" data-target="mobile-menu" class="sidenav-trigger"><i class="material-icons">menu</i></a>`;
    html += `<ul class="hide-on-med-and-down">`;
    html += createMenuLIs(names, URLs);
    html += `</ul><ul id="mobile-menu" class="sidenav">`;
    html += createMenuLIs(names, URLs);
    html += "</ul></div></nav></div>";
    terp.html_stack.push(html);
  },
  "FOOTERITEM": function (terp) {
    var URLs, names;
    if (terp.stack.length < 1) { names = ["Link 1", "Link 2", "Link 3"]; }
    else { names = terp.stack.pop(); }
    if (terp.stack.length < 1) { URLs = ["#/", "#/", "#/"]; }
    else { URLs = terp.stack.pop(); }
    var html = `<div class="col l4 s12 center">`;
    html += `<ul>`;
    html += createMenuLIs(names, URLs);
    html += `</ul>`;
    html += `</div>`
    terp.html_stack.push(html);
  },
  "FOOTERSTART": function (terp) {
    var _class;
    if (terp.stack.length < 1) { _class = ""; }
    else { _class = terp.stack.pop(); }
    terp.html_stack.push(`<footer class="page-footer ${_class}"><div class="container"><div class="row">`);
  },
  "FOOTEREND": function (terp) {
    var companyName, companyYear;
    if (terp.stack.length < 1) companyName = `Company Name`;
    else companyName = terp.stack.pop();
    if (terp.stack.length < 1) companyYear = `2100`;
    else companyYear = terp.stack.pop();
    terp.html_stack.push(`</div></div><div class="footer-copyright">
    <div class="container center"><span>© ${companyYear} Copyright ${companyName}</span></div>
  </div></footer>`)
  },
  "HTML": function (terp) {
    var html;
    if (terp.stack.length < 1) html = "";
    else html = terp.stack.pop();
    terp.html_stack.push(html);
  },
  "LINK": function (terp) {
    var url, text, _class;
    if (terp.stack.length < 1) text = 'link';
    else text = terp.stack.pop();
    if (terp.stack.length < 1) url = "#/";
    else url = terp.stack.pop();
    if (terp.stack.length < 1) _class = "";
    else _class = terp.stack.pop();
    terp.html_stack.push(`<a href="${url}" class="${_class}" >${text}</a>`);
  },
  "LOREM": function (terp) { terp.stack.push(loremIpsum); }
}