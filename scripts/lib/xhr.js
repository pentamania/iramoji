(function(window){
  var xhrGet = function(url, cb){
    var xhr = new XMLHttpRequest();

    // Disable cache
    xhr.open("get", url, true);
    xhr.setRequestHeader('Pragma', 'no-cache');
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
    xhr.onreadystatechange = function(){
      if ((xhr.readyState === 4) && (xhr.status === 200)) {
        return cb(xhr.responseText);
      }
    };
    xhr.onerror = function(e){
        console.log(e);
        alert('xmlエラー');
    }
    xhr.send(null);
  };

  window.xhrGet = xhrGet;
})(window);
