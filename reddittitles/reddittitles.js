function RedditTitles(titleParam) {
  this.titleParam_ = titleParam;
}

RedditTitles.prototype.getTitleFromLocation_ = function() {
  var hash = document.location.hash || '';
  var parts = hash.replace(/#/,'').split(/&/);
  for (var i=0; i<parts.length; i++) {
    var param = parts[i].split(/=/);
    if (param.length == 2 && param[0] == this.titleParam_) {
      return unescape(param[1]);
    }
  }
  return null;
};

RedditTitles.prototype.addTitleToLink_ = function(a) {
  a.href += (a.href.indexOf('#') == -1 ? '#' : '&') + 
    this.titleParam_ + '=' + escape(a.innerHTML);
};

RedditTitles.prototype.changeLinks_ = function() {
  var as = document.getElementsByTagName('a');
  for (var i = 0; i < as.length; i++) {
    var a = as[i];
    if (a.className.match(/title/)) {
      this.addTitleToLink_(a);
    }
  }
};

RedditTitles.prototype.setDocumentTitle_ = function() {
  document.title = this.getTitleFromLocation_();
};

RedditTitles.prototype.main = function() {
  if (document.location.hostname.match(/reddit.com/)) {
    this.changeLinks_();
  } else {
    this.setDocumentTitle_();
  }
};

new RedditTitles('_rt').main();
