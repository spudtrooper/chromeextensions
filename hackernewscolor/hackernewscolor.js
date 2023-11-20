function colorScores() {
  var spans = document.getElementsByTagName("SPAN");
  var scores = [];
  var min;
  var max;
  for (var i = 0; i < spans.length; i++) {
    var d = spans[i];
    if (d.id && d.id.match(/score_\d+/)) {
      var s = d.innerHTML;
      var res;
      if (res = s.match(/(\d+)/)) {
        var n = res[0];
        var score = parseInt(n);
        scores.push(d);
        if (!min || score < min) min = score;
        if (!max || score > max) max = score;
      }
    }
  }
  for (var i = 0; i < scores.length; i++) {
    var d = scores[i];
    var v = parseInt(d.innerHTML);
    var cval = Math.floor(0xff - 0xee * (max - v) / (max - min));
    var color = cval.toString(16) + "0000";
    d.style.color = "#" + color;
  }
}

function sortRows() {
  let tab = document.querySelector('table[class="itemlist"]');
  if (!tab) {
    tab = Array.from(document.getElementsByTagName('table')).find(tab =>
      tab.id !== 'hnmain' &&
      !!Array.from(tab.getElementsByTagName('tr')).find(tr => tr.className === 'athing'));
  }
  if (!tab) {
    console.log('could not find table, give up on life');
    return;
  }
  console.log('found table', tab);
  let tbody = tab.getElementsByTagName('tbody')[0];
  let athings = Array.from(tbody.getElementsByClassName('athing'));
  let findScore = tr => {
    var spans = tr.getElementsByTagName("SPAN");
    for (var i = 0; i < spans.length; i++) {
      var d = spans[i];
      if (d.id && d.id.match(/score_\d+/)) {
        var s = d.innerHTML;
        var res;
        if (res = s.match(/(\d+)/)) {
          var n = res[0];
          var score = parseInt(n);
          return score;
        }
      }
    }
  };
  var athingsAndScores = [];
  athings.forEach(tr => {
    let score = findScore(tr.nextSibling);
    console.log('score: ' + score);
    athingsAndScores.push({
      tr: tr,
      next: tr.nextSibling,
      score: score,
    });
  });
  athingsAndScores.sort((a, b) => {
    return b.score - a.score;
  });
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  athingsAndScores.forEach(o => {
    tbody.appendChild(o.tr);
    tbody.appendChild(o.next);
  });
}

function hnMain() {
  colorScores();
  sortRows();
}

hnMain();
