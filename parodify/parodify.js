/*
 * This script runs no parodify.com, grabs the URL parameters and
 * auto-fills the news form.
 */
(function() {

  function getUrlParams() {
    var parts = String(document.location).split(/\?/);
    if (!parts || parts.length < 1) {
      return {};
    }
    var query = parts[1];
    if (!query) {
      return {};
    }
    var pairs = query.split(/&/);
    var result = {};
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split(/=/);
      if (pair.length == 2) {
	result[pair[0]] = pair[1];
      } else {
	result[pair[0]] = true;
      }
    }
    return result;
  }

  function toggleNewsForm() {
    var sourceUrlEl = document.getElementById('sourceUrl');
    if (sourceUrlEl) {
      return;
    }
    var buttons = document.getElementsByClassName(
      'btn btn-primary rounded ng-binding');
    if (!buttons || buttons.length < 1) {
      return;
    }
    var button = buttons[0];
    if (button) {
      button.click();
    }
  }

  function main() {

    var params = getUrlParams();
    var sourceUrl = unescape(params['sourceUrl']);
    var newsHeadline = unescape(params['newsHeadline']);
    var source = unescape(params['source']);
    if (!sourceUrl && !newsHeadline && !source) {
      return;
    }

    try {
      toggleNewsForm();
    } catch (e) {
      return;
    }

    var sourceUrlEl = document.getElementById('sourceUrl');
    var newsHeadlineEl = document.getElementById('newsHeadline');
    var sourceEl = document.getElementById('source');
    if (!sourceUrlEl || !newsHeadlineEl || !sourceEl) {
      return;
    }

    function triggerChangeEvent(element) {
      var doc = window.document;
      var event = doc.createEvent("HTMLEvents");
      event.initEvent("change", true, true);
      element.dispatchEvent(event);
    }

    function setValue(el, value) {
      el.value = value.trim();
      triggerChangeEvent(el);
    }

    setValue(sourceUrlEl, sourceUrl);
    setValue(newsHeadlineEl, newsHeadline);
    setValue(sourceEl, source);
    
  }

  main();
  
})();
