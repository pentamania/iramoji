(function(window){
  var xhrGet = function(url, success, failure){
    var xhr = new XMLHttpRequest();

    xhr.open("get", url, true);

    // Disable cache
    xhr.setRequestHeader('Pragma', 'no-cache');
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');

    xhr.onreadystatechange = function(){
      if ((xhr.readyState === 4) && (xhr.status === 200)) {
        if (typeof success === 'function') return success(xhr.responseText);
      }
    };
    xhr.onerror = function(e){
      if (typeof failure === 'function') return failure(e);
    }

    xhr.send(null);
  };

  window.xhrGet = xhrGet;
})(window);
