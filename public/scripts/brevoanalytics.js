(function() {
  window.sib = {
      equeue: [],
      client_key: "mu7r9q6u63ypoacon2yp17fs"
  };
  /* OPTIONAL: email for identify request*/
  // window.sib.email_id = 'example@domain.com';
  window.sendinblue = {};
  for (var j = ['track', 'identify', 'trackLink', 'page'], i = 0; i < j.length; i++) {
  (function(k) {
      window.sendinblue[k] = function() {
          var arg = Array.prototype.slice.call(arguments);
          (window.sib[k] || function() {
                  var t = {};
                  t[k] = arg;
                  window.sib.equeue.push(t);
              })(arg[0], arg[1], arg[2], arg[3]);
          };
      })(j[i]);
  }
  let createdScript = document.createElement("script");
  let script = document.getElementsByTagName("script")[0];
  createdScript.type = "text/javascript";
  createdScript.id = "sendinblue-js";
  createdScript.async = !0;
  createdScript.src = "https://sibautomation.com/sa.js?key=" + window.sib.client_key;
  script.parentNode.insertBefore(createdScript, script);
  window.sendinblue.page();
})();