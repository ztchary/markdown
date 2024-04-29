function renderMd(mdfile) {
  let f = fetch("https://static.ztchary.com/md/"+mdfile);
  f.then(r=>r.text().then(parseMd));
}

function parseLine(line, elem) {
  for (let i = 0; i < line.length; i++) {
    switch (line[i]) {
      case '[':
        endalt = i + line.slice(i).indexOf("](");
        endurl = endalt + line.slice(endalt).indexOf(")");
        alt = line.slice(i+1, endalt);
        url = line.slice(endalt+2, endurl);
        i = endurl;
        let ae = document.createElement("a");
        ae.href = url;
        ae.innerHTML = alt;
        elem.appendChild(ae);
        break;
      case '`':
        endcode = i + 1 + line.slice(i + 1).indexOf("`");
        code = line.slice(i+1, endcode);
        i = endcode;
        let ce = document.createElement("code");
        ce.innerHTML = code;
        elem.appendChild(ce);
        break;
      case '*':
        if (line[i+1] == '*') {
          endbold = i + 2 + line.slice(i + 2).indexOf("**");
          if (line.length > endbold && line[endbold + 2] == '*') {
            endbold++;
          }
          bold = line.slice(i+2, endbold);
          i = endbold + 1;
          let se = document.createElement("strong");
          parseLine(bold, se);
          elem.appendChild(se);
        } else {
          endital = i + 1 + line.slice(i + 1).indexOf("*");
          ital = line.slice(i+1, endital);
          i = endital;
          let ee = document.createElement("em");
          parseLine(ital, ee);
          elem.appendChild(ee);
        }
        break;
      default:
        elem.innerHTML += line[i];
        break;
    }
  }
}

function parseMd(data) {
  let content = document.querySelectorAll(".content")[0];
  content.innerHTML = "";
  out = []
  ul = []
  ol = []
  for (line of data.split("\n")) {
    if (line.startsWith("- ")) {
      ul.push(line.slice(2));
      continue;
    } else if (ul.length != 0) {
      let ule = document.createElement("ul");
      for (l of ul) {
        let lie = document.createElement("li");
        parseLine(l, lie);
        ule.appendChild(lie);
      }
      content.appendChild(ule);
      ul = [];
    }
    dotspace = line.indexOf(". ");
    if (dotspace > 0 && dotspace < 5 && "0123456789".includes(line[0])) {
      ol.push(line.slice(dotspace+2));
      continue;
    } else if (ol.length != 0) {
      let ole = document.createElement("ol");
      for (l of ol) {
        let lie = document.createElement("li");
        parseLine(l, lie);
        ole.appendChild(lie);
      }
      content.appendChild(ole);
      ol = [];
    }
    if (!line) {
      continue
    }
    if (line == "---") {
      content.appendChild(document.createElement("hr"));
    } else if (line[0] == '>') {
      let bq = document.createElement("blockquote");
      parseLine(line.slice(1), bq);
      content.appendChild(bq);
    } else if (line[0] == '#') {
      l = 1
      while (line[l] == '#') {
        l += 1
      }
      let he = document.createElement("h"+l);
      he.innerHTML = line.slice(l+1);
      content.appendChild(he);
    } else if (line.startsWith("![")) {
      let endalt = i + line.slice(i).indexOf("](");
      let endurl = endalt + line.slice(endalt).indexOf(")");
      let alt = line.slice(i+1, endalt);
      let url = line.slice(endalt+2, endurl);
      i = endurl;
      let ie = document.createElement("img");
      ie.href = url;
      ie.alt = alt;
      content.appendChild(ie);
      break;
    } else {
      let pe = document.createElement("p");
      parseLine(line, pe);
      content.appendChild(pe);
    }
  }
}
