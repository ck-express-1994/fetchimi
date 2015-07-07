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

  var _ios = function() {
    var t = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
    return (_ios = function() {return t;})();
  };

  var _sound = function() {
    var t = Components.classes["@mozilla.org/sound;1"].createInstance(Components.interfaces.nsISound);
    return (_sound = function() {return t;})();
  };
  
  var _searchingString = function() {
    var t = "<span class=\"searching\" >" + document.getElementById("fetchimi_stringbundle").getString("popup.searching") + "</span>";
    return (_searchingString = function() {return t;})();
  };

  /*
   * 0 - request, 1 - rangeNode, 2- rangeoffset, 3- target, 4- selectview, 5-start, 6- end, 7- timer,8- state, 9-URI
   */
  var _attr = [null, null, 0, null, null, 0, 0, null, 0,null];
  var _reBasic = [
    /[\w\'\-]/,
    /\s/, 
    /[^\w\s\'\-]/g,
    /[^\w\'\-]/,
    /\/lunaWAV\/[A-Z]\d{2}\/[A-Z]\d{7}/g
  ];

  var _reALC = [
      /<span class=\"midashi\"><font class=\'searchwordfont\' color=\'#BF0000\'>(\w[\w'-]+)<\/font><\/span>\W+(.+?)\W<\/li>\W+<li><span class="midashi">/g,
      /*
      /<span class=\"midashi\"><span class=\"wordlink\"><strong><font class=\'searchwordfont\' color=\'#BF0000\'>(\w[\w'-]+)<\/font><\/strong><\/span> <\/span>\W+(.+?)\W<\/li>\W+<li><span class="midashi">/g,
      */
      /<strong><span class=\"hklabel\">\u5909\u5316\u5F62<\/span> : (?:<span class=\'singular\'>\u300A\u5358\u300B<\/span>)?<a href=\'javascript:goGradable\(\"(\w+)\"\)\'>\1<\/a>/gi,
      /(?:\u25C6|(?:<br \/>\u30FB)).+?[?:(\u3002|\uff1f|\uff01|(?:\u25C6.+?))]*<\/(li|ol|div)>/g,
      /<span class=\"label\">\u3010(\u30EC\u30D9\u30EB|\uFF20)\u3011<\/span>[^<]+/g,
      /<span class="midashi">(?:<font class='searchwordfont' color='#BF0000'>(?:\w+|\w*)<\/font>(?:[dry\'s ])?){2}<\/span>\W+.+\W/gi,
      /*
      /<span class="midashi">(?:<span class="wordlink"><strong><font class='searchwordfont' color='#BF0000'>(?:\w+|\w*)<\/font><\/strong>(?:[dry\'s])?<\/span> ){2}<\/span>\W+.+\W/gi,
      */
      /<br \/>(?:\uFF1D|\u2192)<span class="refvocab">([\w\'\-]+)<\/span>/g
    ];

  // 0=M, 1=R, 2=L
  var _wordGroup = [[0, 0, ""], [0, 0, ""], [0, 0, ""]];

  var _puStr = ["fetchimi-css",
    "fetchimi-window",
    'visibility:hidden;top:0px;left:0px;',
    'width:auto;height:auto;visibility:visible;top:',
    'px;left:',
    'px;',
    '<audio autobuffer="true"></audio>'
  ];
  
  var _sourceURL;
  
  function _enable() {

    _attr[0] = new XMLHttpRequest();
    gBrowser.addEventListener("mousemove", _onMouseMove, false);
    gBrowser.addEventListener("keydown", _onKeyDown, false);

    // hack to fix initial location problem
    _showPopup("", 0, 0);
    _clearPopup();
  }

  function _disable() {
    var bro;

    var e;
    var str;
    // alert("start clear");
    _clearPopup();
    // alert("end clear");
    _attr[0] = null;

    if ((e = (bro = gBrowser).contentDocument.getElementById((str = _puStr)[0])))
      e.parentNode.removeChild(e);
    if ((e = bro.contentDocument.getElementById(str[1])))
      e.parentNode.removeChild(e);
    bro.removeEventListener("mousemove", _onMouseMove, false);
    bro.removeEventListener("keydown", _onKeyDown, false);
    // alert("done inlineDisable");
  }

  function _setElement(status){
    var tt, toogle, tbb;
    if(status){
      tt = document.getElementById("fetchimi_stringbundle").getString("tooltip.disabled");
      toogle = "fetchimi_off";
    }
    else{
      tt = document.getElementById("fetchimi_stringbundle").getString("tooltip.enabled");
      toogle = "fetchimi_on"
    }
    
    if((tbb = document.getElementById("fetchimi_tbb"))){
      tbb.setAttribute("class", toogle);
      tbb.setAttribute("tooltiptext", tt);
    }
    
    document.getElementById("fetchimi_cm").setAttribute("class", "menuitem-iconic " + toogle);
    document.getElementById("fetchimi_tm").setAttribute("class", "menuitem-iconic " + toogle);
    document.getElementById("fetchimi_sbp").setAttribute("class", "statusbarpanel-iconic " + toogle);
    document.getElementById("fetchimi_sbp").setAttribute("tooltiptext", tt);
    
  }
  
  this.toogle = function() {

    if (_attr[0]) {

      _disable();
      _setElement(1);
    } else {

      _enable();
      _setElement(0);
    }
  }

  function _fetchVariation(aWord) {

    var s1;
    if ((s1 = aWord.length) > 2) {
      var set = "dry's";
      switch (aWord[(s1 = s1 - 1)]) {
        case set[0] :
        case set[1] :
        case set[2] :
        case set[3] :
          return aWord.substr(0, s1);

        case set[4] :
          var s2;
          return aWord.substr(0, ((aWord[(s2 = s1 - 1)] == set[3]) ? s2 : s1));
        default :
          return "";
      }
    }
    return "";
  }

  function _setWord(index, start, end, str) {
    var a;
    (a = _wordGroup[index])[0] = start;
    a[1] = end;
    a[2] = str;
  }

  function _getRight(str, start) {

    for (var reBasic = _reBasic, reWS = reBasic[1], len = str.length; start < len && reWS.test(str[start++]););

    if (reBasic[2].test(str[start -= 1])) {
      _setWord(1, 0, 0, "");
      return;
    }

    for (var end = start, reWS = reBasic[0]; end < len && reWS.test(str[end]); end++);

    if (end >= len)
      end = len;

    _setWord(1, start, end, str.slice(start, end));
  }

  function _getMiddle(str, start) {

    for (var reWord = _reBasic[0]; start && reWord.test(str[start - 1]); --start);
    if (str[start] == '-')
      ++start;
    for (var end = start, size = str.length; end < size && reWord.test(str[end]); end++);
    if (end >= size)
      end = size;
    _setWord(0, start, end, str.slice(start, end));
  }

  var _makeKeyword = function() {

    var m = _wordGroup[0][2];
    var keyword = m;
    var t, r;

    if ((r = _wordGroup[1][2])) {

      keyword = keyword + " ";
      if ((t = _fetchVariation(r))) {

        keyword = keyword + "(" + t + "|" + r + ")";
      } else {
        keyword = keyword + r;
      }
      keyword = keyword + "%22|%22" + m;
    } else {
      return m;
    }

    if ((t = _fetchVariation(m))) {
      keyword = keyword + "%22|%22" + t;
    }
    // alert("%22" +keyword + "%22");
    return "%22" + keyword + "%22";
  }

  function _show(x, y) {

    var attr;
    (attr = _attr)[0].abort();
    var str;
    var start;

    if (!attr[1] || _reBasic[3].test((str = attr[1].data)[(start = attr[2])])) {
      return;
    }

    _getMiddle(str, start);
    var m;

    ((start = (m = _wordGroup[0])[1]) >= str.length) ? _setWord(1, 0, 0, "") : _getRight(str, start);

    attr[8] = 0x1;
    attr[5] = m[0];
    attr[6] = m[1];

    _showPopup(_searchingString(), x, y);

    //alert(_makeKeyword());
    _search(_makeKeyword(), x, y);
  }

  function _addHighlight() {
    var highlight = true;
    var attr;
    if (highlight && (attr = _attr)[6] >= 0 && attr[5] >= 0 ) {
      var rp;
      var doc;
      if ((doc = (rp = attr[1]).ownerDocument)) {
        var r;
        (r = doc.createRange()).setStart(rp, attr[5]);
        r.setEnd(rp, attr[6]);
        var sel;
        (sel = doc.defaultView.getSelection()).removeAllRanges();
        sel.addRange(r);
        attr[4] = doc.defaultView;
      }
    }
  }

  function _search(aWord, x, y) {
    var attr;
    (attr = _attr)[0].abort();
    var URL;
    // alert("http://eow.alc.co.jp/" + aWord + "/UTF-8/");
    attr[0].open("GET", (URL = "http://eow.alc.co.jp/" + aWord + "/UTF-8/"), true);
    attr[0].send(null);

    attr[0].onreadystatechange = function() {
    //try{
      if (attr[0] && attr[0].readyState == 4 && attr[0].status == 200) {
        // alert(aWord);
        var temp;
        //_showPopup(attr[0].responseText, x, y);
        
        if ((temp = _parseALC(attr[0].responseText, x, y))) {

          // var t0 = new Date().getTime();
          // alert(temp);
          // keyword = aWord;
          //alert(_wordGroup[0][2] + "%20" + _wordGroup[1][2]);
          attr[0].abort();
          _addHighlight();
          _getPronunciation(_wordGroup[0][2]+ "%20" + _wordGroup[1][2]);
          _showPopup(temp, x, y);
          _sourceURL = URL;
          // alert(new Date().getTime() - t0);
        }
        
      } else if (attr[0].status > 200) {
        //alert(attr[0].status);
        _showPopup(document.getElementById("fetchimi_stringbundle").getString("error"), x, y);
      }
    //}catch(e){}
    }
  }
  
  function _stripALC(temp, i){
  /*
  * remove the tags at the end of the matching text.
  * <\/li><li><span class="midashi">  
  */
    var reALC = _reALC;
    var len = temp.length;    
    if(temp[len - 21] == 's' && temp[len - 16] == 'c' && temp[len - 9] == 'm')temp = temp.slice(0, len - 26);
    temp = temp.replace(reALC[2], "</$1>");
    temp = temp.replace(reALC[3], "");
    
    if(!i)_wordGroup[1][2] = "";
    
    _attr[6] = _wordGroup[i][1];
    return temp;
  }
  
  function _parseALC(text, x, y) {

    var attr = _attr;
    var reALC = _reALC;

attr[0].abort();
    
    if (attr[8]&0x1 && reALC[4].test(text)) {
      /*
      *Found exact match.
      */
      return _stripALC(text.match(reALC[4])[0], 1);
    } else if (reALC[5].test(text)) {
      /* is this neccessary??? */
       //alert("found redirect");
      // alert(((text.match(reALC[5]))[0]).replace(reALC[5], "$1"));
      _search(((text.match(reALC[5]))[0]).replace(reALC[5], "$1"), x, y);
      return null;
    } else if (reALC[0].test(text)) {
      //alert("found 1 : " + reALC[0].test(text));
      return _stripALC(text.match(reALC[0])[0], 0);
      
    }else if (!(attr[8] & 0x2) && reALC[1].test(text)) {
      // alert("found variant : " + reALC[1].test(text));
      // still searching, variation
      //alert("variant")
      _search(((text.match(reALC[1]))[0]).replace(reALC[1], "$1"), x, y);
      attr[8] = 0x2;
      return null;
    } else if (!(attr[8] & 0x4) && _wordGroup[1][2]) {
      //alert("find first");
      attr[8] = 0x4;
      // r = "";
      _search(_wordGroup[0][2], x, y);
      return null;
    } else if (!(attr[8] & 0x4) && !(attr[8] & 0x2)) {
      //alert("first vaiation");
      _search(_fetchVariation(_wordGroup[0][2]), x, y);
      attr[8] = 0x6;
      return null;
    } else {
      // alert("nothing");
      return document.getElementById("fetchimi_stringbundle").getString("no.defintion.found");
    }
  }

  function _onMouseMove(ev) {

    var ro = ev.rangeOffset;
    var target = ev.target;
    var attr;

    if (((attr = _attr)[8] && (target == attr[3]) && ro >= attr[5] && ro <= attr[6])) {
      return;
    }
    attr[0].abort();
    var rp = ev.rangeParent;
    if ((ev.explicitOriginalTarget.nodeType != 3) && !("form" in target)) {
      rp = null;
      ro = -1;
    }

    if (rp && (rp.data) && (ro < rp.data.length)) {

      if (attr[7]) {
        clearTimeout(attr[7]);
        attr[7] = 0;
      }
      attr[3] = target;
      attr[1] = rp;
      attr[2] = ro;

      // var delayTime = 250;

      attr[7] = setTimeout(function() {_show(ev.pageX, ev.pageY);}, 400);
    }

    if (attr[8]) {
      _clearPopup();
    }

  }

  function _showPopup(text, x, y) {

    var str;
    var docbody;
    var popup;
    if (!(popup = (docbody = content.document).getElementById((str = _puStr)[1]))) {
      var n;
      var _cssUrl = "chrome://fetchimi/skin/ALC.css";
      try{
      (n = docbody.getElementsByTagName('head')[0]).innerHTML = n.innerHTML + '<link id="fetchimi-css" href="' + _cssUrl + '" type="text/css" rel="stylesheet">';
      }catch(e){}
      
      popup = docbody.createElementNS('http://www.w3.org/1999/xhtml','XHTML');
      popup.setAttribute('id', str[1]);

    }
    
    //popup.innerHTML = text;
    popup.innerHTML = str[6] + text;
    //alert(popup.innerHTML);

    var puW, puH, scrX, scrY, maxPosX, maxPosY, newx, newy;
    var _offsetX = 8;

    if ((newx = x + _offsetX) > (maxPosX = content.innerWidth + (scrX = content.scrollX) - (puW = popup.offsetWidth) - _offsetX))
      newx = maxPosX;
    if (newx < scrX)
      newx = scrX;

    var _offsetY = 14;
    if ((newy = y + _offsetY) > (maxPosY = content.innerHeight + (scrY = content.scrollY) - (puH = popup.offsetHeight) - _offsetY)) {
      newy -= (puH + _offsetY);
      if (newy < 0)
        newy = 1;
    }
    if (newy < scrY)
      newy = scrY;

    popup.style.cssText = str[3] + newy + str[4] + newx + str[5];
    docbody.documentElement.appendChild(popup);   
  }

  function _clearPopup() {

    var str;
    var n;
    if ((n = window.content.document.getElementById((str = _puStr)[1]))) {
      n.style.cssText = str[2];
      //n.innerHTML = "";
      //alert(n.innerHTML);
    }

    var attr;
    (attr = _attr)[0].abort();
    if (attr[7]) {
      clearTimeout(attr[7]);
      attr[7] = 0;
    }
    
    if (attr[4] && !attr[4].closed) {
      attr[4].getSelection().removeAllRanges();
      attr[4] = null;
    }
    
    // alert("call clear hi");
    
    attr[5] = -1;
    attr[6] = -1;
    //attr[9] = null;
    attr[8] = 0;
    _sourceURL = "";
  }
  
  function _onKeyDown(ev) {
    //alert('keycode:' + ev.keyCode);
    switch(ev.keyCode){
      case 65:
        if(_sourceURL){
          var s = _sourceURL;
          _clearPopup();
          gBrowser.selectedTab = gBrowser.addTab(s);
        }
      case 70:
        if(_attr[8] && _attr[9]){
          _sound().play(_attr[9]);
        }
    }
  }
  
  function _getPronunciation(aWord) {

    var attr;
    (attr = _attr)[0].abort();
    attr[0].open("GET", "http://dictionary.reference.com/browse/" + aWord, true);
    attr[0].send(null);

    attr[0].onreadystatechange = function() {

      if (attr[0] && attr[0].readyState == 4 && attr[0].status == 200) {

        var str;
        var re;
        //alert("before if");
        if ((re = _reBasic[4]).test((str = attr[0].responseText))) {
           //alert("getting pro");
/*
          function makeURL(string, p1, offset, s) {
                
            // return "http://cougar.eb.com/soundc11/" + p1[0] + "/" + p1;
            //popWin('/cgi-bin/audio.pl?' + escape(file) + '=' + escape(word));
            var c;
            //alert("http://media.merriam-webster.com/soundc11/" + (((c = p1[0].toLowerCase()) == p1[1])? (c + c): c) + "/" + p1);
            return "http://media.merriam-webster.com/soundc11/" + (((c = p1[0].toLowerCase()) == p1[1]) ? (c + c) : c) + "/" + p1;
            
          }
*/          
          //alert("http://cache.lexico.com/dictionary/audio" + str.match(re)[0]+".wav");
          //attr[9] = _ios().newURI((str.match(re)[0]).replace(re, makeURL), "", null);
          attr[9] = _ios().newURI("http://cache.lexico.com/dictionary/audio" + str.match(re)[0]+".wav", "", null);
          
          window.content.document.getElementById(_puStr[1]).getElementsByTagName('span')[0].style.background = "url(chrome://fetchimi/skin/speakeron.png) no-repeat right";
          
        } else {
          attr[9] = null;
        }
      }
    }
  }
}