/*
 * 
 * FetchImi Copyright (C) 2007 Ryan Dang fetchimi@gmail.com
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * 
 */
var _fi = new fetchimi();

function fetchimi() {
  var n = function () {
    var B = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
    return (n = function () {
      return B
    })()
  },
    e = function () {
    var B = Components.classes["@mozilla.org/sound;1"].createInstance(Components.interfaces.nsISound);
    return (e = function () {
      return B
    })()
  },
    l = function () {
    var B = '<span class="searching" >' + document.getElementById("fetchimi_stringbundle").getString("popup.searching") + "</span>";
    return (l = function () {
      return B
    })()
  },
    g = [null, null, 0, null, null, 0, 0, null, 0, null],
    h = [/[\w\'\-]/, /\s/, /[^\w\s\'\-]/g, /[^\w\'\-]/, /\/lunaWAV\/[A-Z]\d{2}\/[A-Z]\d{7}/g],
    i = [/<span class=\"midashi\"><font class=\'searchwordfont\' color=\'#BF0000\'>(\w[\w'-]+)<\/font><\/span>\W+(.+?)\W<\/li>\W+<li><span class="midashi">/g, /<strong><span class=\"hklabel\">\u5909\u5316\u5F62<\/span> : (?:<span class=\'singular\'>\u300A\u5358\u300B<\/span>)?<a href=\'javascript:goGradable\(\"(\w+)\"\)\'>\1<\/a>/gi, /(?:\u25C6|(?:<br \/>\u30FB)).+?[?:(\u3002|\uff1f|\uff01|(?:\u25C6.+?))]*<\/(li|ol|div)>/g, /<span class=\"label\">\u3010(\u30EC\u30D9\u30EB|\uFF20)\u3011<\/span>[^<]+/g, /<span class="midashi">(?:<font class='searchwordfont' color='#BF0000'>(?:\w+|\w*)<\/font>(?:[dry\'s ])?){2}<\/span>\W+.+\W/gi, /<br \/>(?:\uFF1D|\u2192)<span class="refvocab">([\w\'\-]+)<\/span>/g],
    b = [
    [0, 0, ""],
    [0, 0, ""],
    [0, 0, ""]],
    c = ["fetchimi-css", "fetchimi-window", "visibility:hidden;top:0px;left:0px;", "width:auto;height:auto;visibility:visible;top:", "px;left:", "px;", '<audio autobuffer="true"></audio>'],
    A, w = function () {
    var B = b[0][2],
      C = B,
      D, E;
    if ((E = b[1][2])) {
      C = C + " ";
      if ((D = q(E))) {
        C = C + "(" + D + "|" + E + ")"
      } else {
        C = C + E
      }
      C = C + "%22|%22" + B
    } else {
      return B
    }
    if ((D = q(B))) {
      C = C + "%22|%22" + D
    }
    return "%22" + C + "%22"
  };

  function v() {
    g[0] = new XMLHttpRequest();
    gBrowser.addEventListener("mousemove", y, false);
    gBrowser.addEventListener("keydown", m, false);
    u("", 0, 0);
    r()
  }

  function p() {
    var D, B, C;
    r();
    g[0] = null;
    if ((B = (D = gBrowser).contentDocument.getElementById((C = c)[0]))) {
      B.parentNode.removeChild(B)
    }
    if ((B = D.contentDocument.getElementById(C[1]))) {
      B.parentNode.removeChild(B)
    }
    D.removeEventListener("mousemove", y, false);
    D.removeEventListener("keydown", m, false)
  }

  function d(B) {
    var C, E, D;
    if (B) {
      C = document.getElementById("fetchimi_stringbundle").getString("tooltip.disabled");
      E = "fetchimi_off"
    } else {
      C = document.getElementById("fetchimi_stringbundle").getString("tooltip.enabled");
      E = "fetchimi_on"
    }
    if ((D = document.getElementById("fetchimi_tbb"))) {
      D.setAttribute("class", E);
      D.setAttribute("tooltiptext", C)
    }
    document.getElementById("fetchimi_cm").setAttribute("class", "menuitem-iconic " + E);
    document.getElementById("fetchimi_tm").setAttribute("class", "menuitem-iconic " + E);
    document.getElementById("fetchimi_sbp").setAttribute("class", "statusbarpanel-iconic " + E);
    document.getElementById("fetchimi_sbp").setAttribute("tooltiptext", C)
  }
  this.toogle = function () {
    if (g[0]) {
      p();
      d(1)
    } else {
      v();
      d(0)
    }
  };

  function q(D) {
    var C;
    if ((C = D.length) > 2) {
      var E = "dry's";
      switch (D[(C = C - 1)]) {
      case E[0]:
      case E[1]:
      case E[2]:
      case E[3]:
        return D.substr(0, C);
      case E[4]:
        var B;
        return D.substr(0, ((D[(B = C - 1)] == E[3]) ? B : C));
      default:
        return ""
      }
    }
    return ""
  }

  function z(D, F, C, E) {
    var B;
    (B = b[D])[0] = F;
    B[1] = C;
    B[2] = E
  }

  function k(F, G) {
    var C, D, E, B;
    for (C = h, E = C[1], B = F.length; G < B && E.test(F[G++]);) {}
    if (C[2].test(F[G -= 1])) {
      z(1, 0, 0, "");
      return
    }
    for (D = G, E = C[0]; D < B && E.test(F[D]); D++) {}
    if (D >= B) {
      D = B
    }
    z(1, G, D, F.slice(G, D))
  }

  function f(E, F) {
    var D, B, C;
    for (D = h[0]; F && D.test(E[F - 1]); --F) {}
    if (E[F] == "-") {
      ++F
    }
    for (B = F, C = E.length; B < C && D.test(E[B]); B++) {}
    if (B >= C) {
      B = C
    }
    z(0, F, B, E.slice(F, B))
  }

  function j(D, G) {
    var E, F, C, B;
    (B = g)[0].abort();
    if (!B[1] || h[3].test((E = B[1].data)[(F = B[2])])) {
      return
    }
    f(E, F);
    ((F = (C = b[0])[1]) >= E.length) ? z(1, 0, 0, "") : k(E, F);
    B[8] = 1;
    B[5] = C[0];
    B[6] = C[1];
    u(l(), D, G);
    t(w(), D, G)
  }

  function o() {
    var C = true,
      B;
    if (C && (B = g)[6] >= 0 && B[5] >= 0) {
      var D, G;
      if ((G = (D = B[1]).ownerDocument)) {
        var E, F;
        (E = G.createRange()).setStart(D, B[5]);
        E.setEnd(D, B[6]);
        (F = G.defaultView.getSelection()).removeAllRanges();
        F.addRange(E);
        B[4] = G.defaultView
      }
    }
  }

  function t(E, D, F) {
    var C, B;
    (B = g)[0].abort();
    B[0].open("GET", (C = "http://eow.alc.co.jp/" + E + "/UTF-8/"), true);
    B[0].send(null);
    B[0].onreadystatechange = function () {
      if (B[0] && B[0].readyState == 4 && B[0].status == 200) {
        var G;
        if ((G = s(B[0].responseText, D, F))) {
          B[0].abort();
          o();
          x(b[0][2] + "%20" + b[1][2]);
          u(G, D, F);
          A = C
        }
      } else {
        if (B[0].status > 200) {
          u(document.getElementById("fetchimi_stringbundle").getString("error"), D, F)
        }
      }
    }
  }

  function a(C, D) {
    var E = i,
      B = C.length;
    if (C[B - 21] == "s" && C[B - 16] == "c" && C[B - 9] == "m") {
      C = C.slice(0, B - 26)
    }
    C = C.replace(E[2], "</$1>");
    C = C.replace(E[3], "");
    if (!D) {
      b[1][2] = ""
    }
    g[6] = b[D][1];
    return C
  }

  function s(E, C, F) {
    var B = g,
      D = i;
    B[0].abort();
    if (B[8] & 1 && D[4].test(E)) {
      return a(E.match(D[4])[0], 1)
    } else {
      if (D[5].test(E)) {
        t(((E.match(D[5]))[0]).replace(D[5], "$1"), C, F);
        return null
      } else {
        if (D[0].test(E)) {
          return a(E.match(D[0])[0], 0)
        } else {
          if (! (B[8] & 2) && D[1].test(E)) {
            t(((E.match(D[1]))[0]).replace(D[1], "$1"), C, F);
            B[8] = 2;
            return null
          } else {
            if (! (B[8] & 4) && b[1][2]) {
              B[8] = 4;
              t(b[0][2], C, F);
              return null
            } else {
              if (! (B[8] & 4) && !(B[8] & 2)) {
                t(q(b[0][2]), C, F);
                B[8] = 6;
                return null
              } else {
                return document.getElementById("fetchimi_stringbundle").getString("no.defintion.found")
              }
            }
          }
        }
      }
    }
  }

  function y(E) {
    var D = E.rangeOffset,
      F = E.target,
      B, C;
    if (((B = g)[8] && (F == B[3]) && D >= B[5] && D <= B[6])) {
      return
    }
    B[0].abort();
    C = E.rangeParent;
    if ((E.explicitOriginalTarget.nodeType != 3) && !("form" in F)) {
      C = null;
      D = -1
    }
    if (C && (C.data) && (D < C.data.length)) {
      if (B[7]) {
        window.clearTimeout(B[7]);
        B[7] = 0
      }
      B[3] = F;
      B[1] = C;
      B[2] = D;
      B[7] = window.setTimeout(j, 400, E.pageX, E.pageY)
    }
    if (B[8]) {
      r()
    }
  }

  function u(L, K, J) {
    var N, F, B, T, G, P, O, S, R, E, D, I = 8,
      H = 14;
    if (! (B = (F = content.document).getElementById((N = c)[1]))) {
      try {
        var M, C = "chrome://fetchimi/skin/ALC.css";
        (M = F.getElementsByTagName("head")[0]).innerHTML = M.innerHTML + '<link id="fetchimi-css" href="' + C + '" type="text/css" rel="stylesheet">'
      } catch(Q) {}
      B = F.createElementNS("http://www.w3.org/1999/xhtml", "XHTML");
      B.setAttribute("id", N[1])
    }
    B.innerHTML = N[6] + L;
    if ((E = K + I) > (S = content.innerWidth + (P = content.scrollX) - (T = B.offsetWidth) - I)) {
      E = S
    }
    if (E < P) {
      E = P
    }
    if ((D = J + H) > (R = content.innerHeight + (O = content.scrollY) - (G = B.offsetHeight) - H)) {
      D -= (G + H);
      if (D < 0) {
        D = 1
      }
    }
    if (D < O) {
      D = O
    }
    B.style.cssText = N[3] + D + N[4] + E + N[5];
    F.documentElement.appendChild(B)
  }

  function r() {
    var C, D, B;
    if ((D = window.content.document.getElementById((C = c)[1]))) {
      D.style.cssText = C[2]
    } (B = g)[0].abort();
    if (B[7]) {
      window.clearTimeout(B[7]);
      B[7] = 0
    }
    if (B[4] && !B[4].closed) {
      B[4].getSelection().removeAllRanges();
      B[4] = null
    }
    B[5] = -1;
    B[6] = -1;
    B[8] = 0;
    A = ""
  }

  function m(C) {
    switch (C.keyCode) {
    case 65:
      if (A) {
        var B = A;
        r();
        gBrowser.selectedTab = gBrowser.addTab(B)
      }
    case 70:
      if (g[8] && g[9]) {
        e().play(g[9])
      }
    }
  }

  function x(C) {
    var B;
    (B = g)[0].abort();
    B[0].open("GET", "http://dictionary.reference.com/browse/" + C, true);
    B[0].send(null);
    B[0].onreadystatechange = function () {
      if (B[0] && B[0].readyState == 4 && B[0].status == 200) {
        var E, D;
        if ((D = h[4]).test((E = B[0].responseText))) {
          B[9] = n().newURI("http://cache.lexico.com/dictionary/audio" + E.match(D)[0] + ".wav", "", null);
          window.content.document.getElementById(c[1]).getElementsByTagName("span")[0].style.background = "url(chrome://fetchimi/skin/speakeron.png) no-repeat right"
        } else {
          B[9] = null
        }
      }
    }
  }
};