/*
 * This script is called from the background script to get the title
 * of the current page.
 */
(function() {

  function removeHtml(s) {
    var res = s.replace(/<[^>]+>/g, '');
    res = res.replace(/&\w+;\s*/g, '');
    return res;
  }
  
  function getTitleOrNull() {
    var title = document.title;
    if (false && title) {
      return title;
    }
    function getTitleFromHeading(heading) {
      var hs = document.getElementsByTagName(heading);
      return hs && hs[0] ? hs[0].innerHTML : null;
    }
    var headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    for (var i = 0; i < headings.length; i++) {
      title = getTitleFromHeading(headings[i]);
      if (title) {
	break
      }
    }
    return title;
  }

  function getTitle() {
    var title = getTitleOrNull();
    return title ? removeHtml(title).trim() : null;
  }
    
  chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.text && (msg.text == 'getTitle')) {
      sendResponse(getTitle());
    }
  });

})();
