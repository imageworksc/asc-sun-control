/* Atlantic Sun Control — Mega menu (standalone): builds the navbar, mega panel and mobile drawer */
(function(){
  'use strict';
  var CATS=[
    {head:"Safety & Security Films",items:["Anti-Intrusion","Blast Mitigation","Radio Frequency Shielding","Anti-Graffiti Films","Casper Cloaking Film"]},
    {head:"Sun Control",items:["Anti-Glare Window Film","Heat Control Window Films","UV Window Film","Low-E Films","Blinds & Shades"]},
    {head:"Decorative Films & Graphics",items:["Custom Window Films & Graphics","Signs, Graphics & Logos","Wall Murals","Frosted & Etch Look Films"]},
    {head:"Privacy Films",items:["Frosted / Etch Look Films","Smart Films","Blinds & Shades","One-Way Mirror Films","Casper Cloaking Film"]},
    {head:"Specialty Films",items:["Casper Cloaking Film","Smart Films","Architectural Finishes","Blackout Films"]}
  ];
  var TOP=[
    {label:"About Us",href:"#"},
    {label:"Products & Services",mega:true},
    {label:"Who We Serve",href:"#serve"},
    {label:"Resources",href:"#faq"}
  ];
  var nav=document.getElementById('ascNav');
  var panel=document.getElementById('ascPanel');
  var mnav=document.getElementById('ascMnav');
  var burger=document.getElementById('ascBurger');
  var bar=document.getElementById('ascBar');
  var open=false, activeCat=0;
  var PHONE_SVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.2 2.2z"/></svg>';

  function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;}

  /* ---- top nav ---- */
  TOP.forEach(function(item){
    var li=el('li');
    if(item.mega){
      var b=el('button','asc-navbtn');b.type='button';b.dataset.mega='1';b.setAttribute('aria-expanded','false');
      b.appendChild(el('span',null,item.label));b.appendChild(el('span','asc-caret'));
      li.appendChild(b);
    }else{
      var a=el('a','asc-navbtn',item.label);a.href=item.href;li.appendChild(a);
    }
    nav.appendChild(li);
  });
  var megaBtn=nav.querySelector('.asc-navbtn[data-mega]');

  /* ---- mega panel: category tabs row + per-tab flyout ---- */
  function renderFlyout(fly,i){
    fly.innerHTML='';
    var ul=el('ul','asc-mm-list');
    CATS[i].items.forEach(function(label){
      var li=el('li'),a=el('a');a.href='#';a.appendChild(el('span',null,label));li.appendChild(a);ul.appendChild(li);
    });
    var fw=el('div','asc-mm-foot-wrap');
    var foot=el('a','asc-mm-foot','View '+CATS[i].head+' →');foot.href='#';
    fw.appendChild(foot);
    fly.append(ul,fw);
    fly.dataset.cols=CATS[i].items.length>4?'2':'1';
  }
  function buildPanel(){
    panel.innerHTML='';
    var wrap=el('div','asc-mm-wrap');
    var tabs=el('div','asc-mm-tabs');
    var fly=el('div','asc-mm-flyout');
    var closeTimer=null;
    function openFor(t,i){
      clearTimeout(closeTimer);
      tabs.querySelectorAll('.asc-mm-tab').forEach(function(x){x.classList.remove('is-active');});
      t.classList.add('is-active');
      renderFlyout(fly,i);
      fly.classList.add('is-open');
      var tr=t.getBoundingClientRect(), wr=wrap.getBoundingClientRect();
      var left=tr.left-wr.left;
      var maxLeft=wrap.clientWidth-fly.offsetWidth;
      if(maxLeft>0&&left>maxLeft)left=maxLeft;
      if(left<0)left=0;
      fly.style.left=left+'px';
    }
    function scheduleClose(){
      closeTimer=setTimeout(function(){
        fly.classList.remove('is-open');
        tabs.querySelectorAll('.asc-mm-tab').forEach(function(x){x.classList.remove('is-active');});
      },140);
    }
    CATS.forEach(function(c,i){
      var t=el('a','asc-mm-tab',c.head);t.href='#';t.dataset.cat=i;
      t.addEventListener('mouseenter',function(){openFor(t,i);});
      t.addEventListener('focus',function(){openFor(t,i);});
      t.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();openFor(t,i);});
      tabs.appendChild(t);
    });
    tabs.addEventListener('mouseleave',scheduleClose);
    fly.addEventListener('mouseenter',function(){clearTimeout(closeTimer);});
    fly.addEventListener('mouseleave',scheduleClose);
    wrap.append(tabs,fly);
    panel.appendChild(wrap);
  }
  function setOpen(v){
    open=v;
    if(megaBtn)megaBtn.setAttribute('aria-expanded',String(v));
    if(v){buildPanel();panel.classList.add('is-open');}
    else{panel.classList.remove('is-open');}
  }
  if(megaBtn){
    megaBtn.addEventListener('click',function(e){e.preventDefault();setOpen(!open);});
    if(window.matchMedia('(hover:hover)').matches){
      megaBtn.addEventListener('mouseenter',function(){setOpen(true);});
      nav.addEventListener('mouseover',function(e){
        var b=e.target.closest('.asc-navbtn');if(b&&!b.dataset.mega)setOpen(false);
      });
    }
  }
  bar.addEventListener('mouseleave',function(){setOpen(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open){setOpen(false);if(megaBtn)megaBtn.focus();}});
  panel.addEventListener('click',function(e){
    var a=e.target.closest('a');if(!a)return;
    if(a.classList.contains('asc-mm-tab'))return;
    if(a.getAttribute('href')==='#')e.preventDefault();
    setOpen(false);
  });

  /* ---- mobile drawer ---- */
  (function buildMobile(){
    mnav.appendChild(el('div','asc-mnav__group','Products & Services'));
    CATS.forEach(function(c){
      var sec=el('div','asc-msec');
      var b=el('button','asc-mbtn');b.type='button';b.setAttribute('aria-expanded','false');
      b.appendChild(el('span',null,c.head));b.appendChild(el('span','asc-caret'));
      var body=el('div','asc-mbody');body.hidden=true;
      var ul=el('ul');
      c.items.forEach(function(label){var li=el('li'),a=el('a',null,label);a.href='#';li.appendChild(a);ul.appendChild(li);});
      body.appendChild(ul);
      b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!o));body.hidden=o;});
      sec.append(b,body);mnav.appendChild(sec);
    });
    TOP.forEach(function(item){
      if(item.mega)return;
      var sec=el('div','asc-msec');
      var a=el('a','asc-mbtn',item.label);a.href=item.href;sec.appendChild(a);mnav.appendChild(sec);
    });
    var acts=el('div','asc-mactions');
    var cta=el('a','asc-cta','Request a Free Estimate');cta.href='#estimate';
    var tel=el('a','asc-tel');tel.href='tel:5718328571';
    tel.innerHTML=PHONE_SVG+'<span>(571) 832-8571</span>';
    acts.append(cta,tel);mnav.appendChild(acts);
  })();
  function closeMobile(){burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Open menu');mnav.hidden=true;}
  burger.addEventListener('click',function(){
    var o=burger.getAttribute('aria-expanded')==='true';
    burger.setAttribute('aria-expanded',String(!o));
    burger.setAttribute('aria-label',o?'Open menu':'Close menu');
    mnav.hidden=o;
  });
  mnav.addEventListener('click',function(e){
    var a=e.target.closest('a');if(!a)return;
    if(a.getAttribute('href')==='#')e.preventDefault();
    closeMobile();
  });
})();
