/*
 * Copyright 2014 Jeffrey Palm.
 */

const CLASS = "_c";
const SPAM_EXCLUDES = [
    /footer/i,
    /logo/i,
    /\.gif$/
];

/**
 * String[tag] (Node) -> Node
 * Creates a new node.
 */
function $n(tag,on) {
  var e = document.createElement(tag);
  if (on) {
    on.appendChild(e);
  }
  return e;
}

/**
 * String[text] (Node) -> Node
 * Creates a new text node.
 */
function $t(text,on) {
  var e = document.createTextNode(text);
  if (on) {
    on.appendChild(e);
  }
  return e;
}

/**
 * Node Node -> Void
 * Inserts newNode before target.
 * http://lists.xml.org/archives/xml-dev/200201/msg00873.html
 */
function insertBefore(newNode,target) {
  var parent = target.parentNode;
  if (target) {
    parent.insertBefore(newNode, target);
  }
  else parent.appendChild(newNode);  
}

function xmlHttpRequest(url, fn) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      fn(xhr);
    }
  }
  xhr.send();
}


/**
 * @param {number} size
 * @param {boolean} keepAspectRatio
 * @param {boolean} keepOriginalImage
 * @param {number} maxResults
 */
function CraigslistInlineImage(
  size, keepAspectRatio, keepOriginalImage, maxResults) {
  this.size_ = size;
  this.keepAspectRatio_ = keepAspectRatio;
  this.keepOriginalImage_ = keepOriginalImage;
  this.maxResults_ = maxResults;
  this.cnt_ = 0;
  /**
   * Remember the images we've seen before.  When there are duplicates
   * it's almost definitely spam.
   */
  this.seenImages_ = {};
};


/*
 * @param {string} src
 * @return {string} Whether src is a spam image or not
 */
CraigslistInlineImage.prototype.isSpam_ = function(src) {
  var excludes = SPAM_EXCLUDES;
  for (var i in excludes) {
    if (src.match(excludes[i])) return true;
  }
  return false;
}

/**
 * @param {!Element} a
 * @param {XmlHttpResponse} details
 */
CraigslistInlineImage.prototype.showImagesForLink_ = function(a, details) {
  if (!details.responseText) {
    return;
  }
  var seen = this.seenImages_;
  var regex = 
    /a[^>]*href=\"(http\:\/\/images.craigslist.org\/[^\"]+\.jpg)\"/gi;
  var div = null;
  while (m = regex.exec(details.responseText)) {
    var s = m[1];
    if (!s) continue;
    if (this.keepOriginalImage_) {
      s = s.replace(/\/thumb\//, '/');
    }
    // Remove spam images
    if (this.isSpam_(s)) {
      continue;
    }
    // Exclude repeat images
    if (seen[s]) {
      continue;
    }
    seen[s] = true;
    // For the first time create the div to hold the links
    if (!div) {
      var d = $n("div",a.parentNode);
      var br = $t(" ",a.parentNode);
      div = $n("div",a.parentNode);
    }
    // Create the link and image and add them
    var newA = $n("a",div);
    var img = $n("img",newA);
    // Add an onerror listener to remove the image if it doesn't load
    img.addEventListener('error', (function() {
      var _div = div;
      var _newA = newA;
      return function(e) {
	_div.removeChild(_newA);
      };
    })(), true);
    
    img.className = CLASS;
    img.src = s;
    // Don't change the height if we're keeping the aspect ratio
    if (!this.keepOriginalImage_) {
      if (!this.keepAspectRatio_) {
        img.style.width = this.size_ + "px";
      }
      img.style.height = this.size_ + "px";
    }
    newA.href = s;
    if (++this.cnt_ > this.maxResults_-1) {
      var amt = m.length-maxResults;
      if (amt != 0) {
        $t(" ...",div);
        $t(amt + " more ",div);
      }
      break;
    }
    $t(" ",div);
  }
}

/** Main entry point. */
CraigslistInlineImage.prototype.showImages = function() {
  var links = document.getElementsByTagName("a");
  var thiz = this;
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (link.href && link.href.match(/.*craigslist.org.*\/\d+\.html$/)) {
      xmlHttpRequest(
	link,
	(function() {
	  var link_ = link;
	  return function(details) {
	    thiz.showImagesForLink_(link_, details);
	  }}
	)())
    }
  }
}

function isListPage() {
  var loc = String(document.location);
  return loc.match(/http:\/\/\w+\.craigslist.org\/\w+\/?/);
}

function main() {
  if (!isListPage()) return;
  chrome.storage.sync.get({
    size: 100,
    keepAspectRatio: true,
    keepOriginalImage: false,
    maxResults: 1000
  }, function(items) {
    new CraigslistInlineImage(
      parseInt(items.size), 
      items.keepAspectRatio, 
      items.keepOriginalImage, 
      parseInt(items.maxResults)).showImages();
  });
}

main();
