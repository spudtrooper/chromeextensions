/* 
 * This script gets the title from the content script and opens a tab
 * with title, url, and source name encoded in the url.
 */
var parodify = {};

parodify.postNews = function() {
  chrome.tabs.query({active:true}, function(tabs) {
    var tab = tabs[0];
    chrome.tabs.sendMessage(
      tab.id, 
      {text: 'getTitle'},
      function(title) {
	parodify.openTab(tab, title);
      });
  });
};
  
parodify.openTab = function(tab, title) {

  title = title || tab.title;
  
  function hostName(url) {
    var host = url;
    host = host.replace(/.*:\/\//, '')
    host = host.replace(/\/.*/, '');
    return host;
  }
  
  var url = 'http://parodify.com/#/news/featured'
    + '?sourceUrl=' + tab.url
    + '&newsHeadline=' + title
    + '&source=' + hostName(tab.url);
  
  function open(url) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      chrome.tabs.update(tab.id, {url: url});
    });
  }
  
  open(url);
  
};

chrome.browserAction.onClicked.addListener(function(tab) {  
  parodify.postNews();
});
