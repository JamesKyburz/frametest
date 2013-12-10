module.exports = function() {
  var iframe, logArea, context;
  return function(opt) {
    opt = opt || {};
    var HEIGHT_MARGIN = 40;

    context = context || {
      logArea: logArea,
      iframe: iframe,
      attach: attach,
      detach: detach,
      logSuccess: log('success'),
      logFailure: log('failure'),
      logInfo: log('info'),
    };

    var body, logArea;

    if (iframe) {
      capture();
    } else {
      attach(window, 'load', function load() {
        var fs = require('fs');
        var insertCss = require('insert-css');
        var css = fs.readFileSync(__dirname + '/index.css');
        insertCss(css);
        body = document.getElementsByTagName('body')[0];
        body.innerHTML = '';
        context.logArea = logArea = logArea || createLogArea();
        context.iframe = iframe = iframe || createIframe();
        attach(window, 'resize', resizeWindow);
        resizeWindow();
        capture();
      });
    }

    function capture() {
      iframe.src = opt.testUrl;
    }

    function load() {
      context.loaded = true;
      attach(iframe.contentWindow, 'unload', unload);
      opt.harness.call(context);
    }

    function unload() {
      context.loaded = false;
      detach(iframe.contentWindow, 'unload', unload);
    }

    function attachIframeEvents(iframe) {
      attach(iframe, 'load', load);
    }

    function attach(o, name, cb) {
      o.addEventListener ?
        o.addEventListener(name, cb, false)
        :
        o.attachEvent && o.attachEvent('on' + name, cb)
      ;
    }

    function detach(o, name, cb) {
      o.removeEventListener ?
        o.removeEventListener(name, cb)
        :
        o.detachEvent && o.detachEvent('on' + name, cb)
      ;
    }

    function createLogArea() {
      var area = body.appendChild(document.createElement('div'));
      area.setAttribute('class', 'log-area box');
      return body.appendChild(area);
    }

    function createIframe() {
      var f = body.appendChild(document.createElement('iframe'));
      f.setAttribute('class', 'frame box');
      f.setAttribute('frameborder', '0');
      f.setAttribute('marginwidth', '');
      f.setAttribute('marginheight', '');
      attachIframeEvents(f);
      return f;
    }

    function log(css) {
      return function(text) {
        var p = document.createElement('p');
        p.setAttribute('class', 'log-line ' + css);
        p[('textContent' in p ? 'textContent' : 'innerText')] = text;
        logArea.appendChild(p);
      };
    }

    function pageY(elem) {
      return elem.offsetParent ? (elem.offsetTop + pageY(elem.offsetParent)) : elem.offsetTop;
    }

    function resizeWindow() {
      var height = document.documentElement.clientHeight;
      height -= pageY(iframe);
      height = (height < 0) ? 0 : height;
      height -= HEIGHT_MARGIN;
      iframe.style.height = height + 'px';
      logArea.style.height = height + 'px';
    }
  };
};
