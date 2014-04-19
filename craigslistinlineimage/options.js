function saveOptions() {
  var size = document.getElementById('size').value;
  var keepAspectRatio = document.getElementById('keep_aspect_ratio').checked;
  var keepOriginalImage = 
    document.getElementById('keep_original_image').checked
  var maxResults = document.getElementById('max_results').value;
  chrome.storage.sync.set({
    size: size,
    keepAspectRatio: keepAspectRatio,
    keepOriginalImage: keepOriginalImage,
    maxResults: maxResults
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    size: 100,
    keepAspectRatio: true,
    keepOriginalImage: false,
    maxResults: 1000
  }, function(items) {
    document.getElementById('size').value = items.size;
    document.getElementById('keep_aspect_ratio').checked = 
      items.keepAspectRatio;
    document.getElementById('keep_original_image').checked = 
      items.keepOriginalImage;
    document.getElementById('max_results').value = items.maxResults;
  });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click',
    saveOptions);
