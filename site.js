(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* reveal on scroll */
  var els=document.querySelectorAll('.reveal');
  els.forEach(function(e){var sib=Array.prototype.filter.call(e.parentNode.children,function(c){return c.classList&&c.classList.contains('reveal')});var k=sib.indexOf(e);e.style.setProperty('--d',Math.min(k,5)*80+'ms');});
  if(reduce||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});}
  else{
    var io=new IntersectionObserver(function(ents){ents.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    els.forEach(function(e){io.observe(e)});
  }

  /* slideshow previews on project cards */
  document.querySelectorAll('.art[data-frames]').forEach(function(art){
    var frames=art.getAttribute('data-frames').split('|'); if(frames.length<2)return;
    var base=art.querySelector('img'); var i=0,timer=null,layer=null,dots;
    dots=document.createElement('div');dots.className='dots';
    frames.forEach(function(_,k){var d=document.createElement('i');if(k===0)d.className='on';dots.appendChild(d)});
    art.appendChild(dots);
    function setDot(n){dots.querySelectorAll('i').forEach(function(d,k){d.className=k===n?'on':''})}
    function preload(){frames.forEach(function(f){var im=new Image();im.src=f})}
    function next(){
      i=(i+1)%frames.length;
      if(!layer){layer=document.createElement('img');layer.className='f2';layer.alt='';art.appendChild(layer);}
      layer.src=frames[i];
      layer.onload=function(){layer.classList.add('show');setDot(i);setTimeout(function(){base.src=frames[i];layer.classList.remove('show');},520);};
    }
    function start(ms){if(timer||reduce)return;preload();timer=setInterval(next,ms||1100);}
    function stop(){clearInterval(timer);timer=null;if(layer)layer.classList.remove('show');i=0;base.src=frames[0];setDot(0);}
    var link=art.closest('a')||art;
    if(fine){link.addEventListener('mouseenter',function(){start(1100)});link.addEventListener('mouseleave',stop);link.addEventListener('focus',function(){start(1100)});link.addEventListener('blur',stop);}
    else if('IntersectionObserver' in window){
      var vo=new IntersectionObserver(function(ents){ents.forEach(function(en){if(en.isIntersecting){art.classList.add('auto');start(1800)}else{art.classList.remove('auto');stop()}})},{threshold:.6});
      vo.observe(art);
    }
  });

  /* magnetic buttons */
  if(fine&&!reduce){
    document.querySelectorAll('.btn,.socials a,.connect button').forEach(function(b){
      b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)/r.width;var y=(e.clientY-r.top-r.height/2)/r.height;b.style.transform='translate('+(x*8)+'px,'+(y*6-2)+'px)';});
      b.addEventListener('mouseleave',function(){b.style.transform=''});
    });
  }

  /* lightbox for case study images */
  var imgs=document.querySelectorAll('.case-img img, .phones img, .ig-grid img');
  if(imgs.length){
    var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');
    lb.innerHTML='<button type="button" aria-label="Close">&times;</button><img alt=""><p></p>';
    document.body.appendChild(lb);
    var lbi=lb.querySelector('img'),lbp=lb.querySelector('p'),last=null;
    function close(){lb.classList.remove('open');document.body.style.overflow='';if(last)last.focus();}
    imgs.forEach(function(im){
      im.setAttribute('tabindex','0');im.setAttribute('role','button');
      function open(){last=im;lbi.src=im.currentSrc||im.src;lbi.alt=im.alt;lbp.textContent=im.alt;lb.classList.add('open');document.body.style.overflow='hidden';lb.querySelector('button').focus();}
      im.addEventListener('click',open);im.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
    });
    lb.addEventListener('click',function(e){if(e.target!==lbi)close()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))close()});
  }
})();

/* editorial refresh: case-study section nav, gallery arrows, video */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var main=document.querySelector('main');

  /* section nav on case studies */
  var hero=document.querySelector('.case-hero');
  if(hero&&main){
    var h2s=main.querySelectorAll('h2.serif'), heads=h2s.length>=2?h2s:main.querySelectorAll('.cs-h');
    var items=[{el:hero,label:'Overview'}];
    heads.forEach(function(h){items.push({el:h,label:h.getAttribute('data-short')||h.textContent.trim()})});
    var docs=main.querySelector('.doc-links'); if(docs)items.push({el:docs,label:'Links'});
    if(items.length>=3){
      var nav=document.createElement('nav');nav.className='subnav';nav.setAttribute('aria-label','On this page');
      var ul=document.createElement('ul');nav.appendChild(ul);
      items.forEach(function(it,k){
        var id=it.el.id||('sec-'+k);it.el.id=id;it.el.setAttribute('data-sec','');
        var li=document.createElement('li'),a=document.createElement('a');a.href='#'+id;a.textContent=it.label;li.appendChild(a);ul.appendChild(li);it.a=a;
      });
      var after=document.querySelector('.project-info')||hero;
      after.parentNode.insertBefore(nav,after.nextSibling);
      function update(){
        var y=window.scrollY+160,cur=items[0];
        items.forEach(function(it){if(it.el.getBoundingClientRect().top+window.scrollY<=y)cur=it});
        items.forEach(function(it){it.a.classList.toggle('on',it===cur)});
        if(cur.a.offsetLeft<ul.scrollLeft||cur.a.offsetLeft+cur.a.offsetWidth>ul.scrollLeft+ul.clientWidth){ul.scrollLeft=cur.a.offsetLeft-24;}
      }
      window.addEventListener('scroll',update,{passive:true});update();
    }
  }

  /* arrows for scrolling galleries */
  document.querySelectorAll('.gallery').forEach(function(g){
    var n=document.createElement('div');n.className='gallery-nav wrap';
    n.innerHTML='<button type="button" aria-label="Previous images">&larr;</button><button type="button" aria-label="Next images">&rarr;</button>';
    g.parentNode.insertBefore(n,g.nextSibling);
    var b=n.querySelectorAll('button');
    function step(dir){g.scrollBy({left:dir*Math.max(g.clientWidth*0.6,300),behavior:reduce?'auto':'smooth'})}
    function sync(){b[0].disabled=g.scrollLeft<4;b[1].disabled=g.scrollLeft+g.clientWidth>=g.scrollWidth-4}
    b[0].addEventListener('click',function(){step(-1)});b[1].addEventListener('click',function(){step(1)});
    g.addEventListener('scroll',sync,{passive:true});window.addEventListener('resize',sync);setTimeout(sync,300);sync();
  });

  /* autoplay videos only in view, honour reduced motion, pause button */
  document.querySelectorAll('.video').forEach(function(box){
    var v=box.querySelector('video'),btn=box.querySelector('button');if(!v)return;
    var userPaused=reduce;
    function label(){if(btn)btn.textContent=v.paused?'Play':'Pause'}
    if(reduce){v.removeAttribute('autoplay');v.pause();}
    if(btn)btn.addEventListener('click',function(){if(v.paused){userPaused=false;v.play()}else{userPaused=true;v.pause()}label()});
    v.addEventListener('play',label);v.addEventListener('pause',label);
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(e){e.forEach(function(en){if(en.isIntersecting){if(!userPaused){var p=v.play();if(p&&p.catch)p.catch(function(){})}}else v.pause()})},{threshold:.35}).observe(v);
    }
    label();
  });
})();

/* mobile menu */
(function(){
  var top=document.querySelector('.top'),btn=top&&top.querySelector('.menu-btn');if(!btn)return;
  btn.addEventListener('click',function(){var o=top.classList.toggle('is-open');btn.setAttribute('aria-expanded',o?'true':'false');btn.innerHTML=o?'&times;':'&#9776;';});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&top.classList.contains('is-open')){btn.click();btn.focus();}});
})();

/* sketchbook: nav shadow, autoplay screen slideshows, polaroid captions */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var top=document.querySelector('.top');
  if(top){var f=function(){top.classList.toggle('scrolled',window.scrollY>8)};window.addEventListener('scroll',f,{passive:true});f();}
  document.querySelectorAll('.screen[data-frames]').forEach(function(sc){
    var frames=sc.getAttribute('data-frames').split('|');if(frames.length<2||reduce)return;
    var base=sc.querySelector('img'),layer=document.createElement('img');layer.className='f2';layer.alt='';sc.appendChild(layer);
    var i=0,t=null,delay=2400+Math.random()*900;
    function next(){i=(i+1)%frames.length;layer.src=frames[i];layer.onload=function(){layer.classList.add('show');setTimeout(function(){base.src=frames[i];layer.classList.remove('show')},950)}}
    if('IntersectionObserver' in window){new IntersectionObserver(function(e){e.forEach(function(en){if(en.isIntersecting){if(!t)t=setInterval(next,delay)}else{clearInterval(t);t=null}})},{threshold:.3}).observe(sc);}
  });
  document.querySelectorAll('.win-video video').forEach(function(v){
    if(reduce){v.removeAttribute('autoplay');v.pause();return;}
    if('IntersectionObserver' in window){new IntersectionObserver(function(e){e.forEach(function(en){if(en.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})},{threshold:.3}).observe(v);}
  });
})();

/* light and dark mode: follows the device until the visitor picks one */
(function(){
  var root=document.documentElement,mq=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
  var dials=document.querySelectorAll('.dial');if(!dials.length)return;
  function current(){var t=root.getAttribute('data-theme');return t||(mq&&mq.matches?'dark':'light')}
  function sync(){var d=current()==='dark';dials.forEach(function(b){b.setAttribute('aria-checked',d?'true':'false')})}
  dials.forEach(function(b){b.addEventListener('click',function(){
    var next=current()==='dark'?'light':'dark';root.setAttribute('data-theme',next);
    try{localStorage.setItem('theme',next)}catch(e){}
    sync();
  })});
  if(mq){var on=function(){sync()};if(mq.addEventListener)mq.addEventListener('change',on);else if(mq.addListener)mq.addListener(on);}
  sync();
})();

/* motion: screen recordings, counting numbers, moving sketchbook, headline draw-in */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO='IntersectionObserver' in window;

  /* screen recordings play only while on screen */
  document.querySelectorAll('video[data-auto]').forEach(function(v){
    if(reduce||!hasIO){v.removeAttribute('autoplay');v.setAttribute('controls','');v.preload='metadata';return;}
    new IntersectionObserver(function(e){e.forEach(function(en){
      if(en.isIntersecting){if(v.preload!=='auto')v.preload='auto';var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause();
    })},{threshold:.25}).observe(v);
  });

  /* headline draws in word by word */
  var h=document.querySelector('h1');
  if(h&&!reduce){
    var i=0;
    (function walk(n){
      Array.prototype.slice.call(n.childNodes).forEach(function(c){
        if(c.nodeType===3){
          if(!c.textContent.trim())return;
          var f=document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function(part){
            if(!part)return;
            if(/^\s+$/.test(part)){f.appendChild(document.createTextNode(part));return;}
            var s=document.createElement('span');s.className='w';s.style.setProperty('--i',i++);s.textContent=part;f.appendChild(s);
          });
          c.parentNode.replaceChild(f,c);
        }else if(c.nodeType===1&&c.namespaceURI!=='http://www.w3.org/2000/svg'){walk(c)}
      });
    })(h);
    h.setAttribute('aria-label',h.textContent.replace(/\s+/g,' ').trim());
  }
  if(h)h.classList.add('split');

  /* numbers count up when they come into view */
  var nums=document.querySelectorAll('.facts div b, .impact b, .key-stat b');
  if(!reduce&&hasIO&&nums.length){
    var io=new IntersectionObserver(function(e){e.forEach(function(en){
      if(!en.isIntersecting)return;io.unobserve(en.target);
      var b=en.target,m=b._m,t0=null,dur=1300;
      function step(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/dur),ease=1-Math.pow(1-k,3);
        b.textContent=m[1]+(m[2]*ease).toFixed(m[3])+m[4];if(k<1)requestAnimationFrame(step);else b.textContent=b._full;}
      requestAnimationFrame(step);
    })},{threshold:.6});
    nums.forEach(function(b){
      if(b.children.length)return;
      var full=b.textContent,m=full.match(/^(\D*?)(\d+(?:\.\d+)?)(.*)$/);if(!m)return;
      b._full=full;b._m=[0,m[1],parseFloat(m[2]),(m[2].split('.')[1]||'').length,m[3]];
      b.textContent=m[1]+(0).toFixed(b._m[3])+m[3];io.observe(b);
    });
  }

  /* sketchbook pieces drift at different speeds as you scroll */
  var bits=Array.prototype.slice.call(document.querySelectorAll('.collage > *, .stage > *'));
  if(!reduce&&bits.length&&('translate' in document.documentElement.style)){
    var depth=[.06,-.045,.085,-.07,.05,-.03];
    var counts=new Map();
    bits.forEach(function(el){var k=counts.get(el.parentNode)||0;counts.set(el.parentNode,k+1);el._d=parseFloat(el.getAttribute('data-depth'))||depth[k%depth.length];});
    var ticking=false;
    function drift(){ticking=false;var vh=window.innerHeight;if(window.innerWidth<760){bits.forEach(function(el){el.style.translate=''});return;}var small=1;
      bits.forEach(function(el){var r=el.parentNode.getBoundingClientRect();if(r.bottom<-300||r.top>vh+300)return;
        var y=-(r.top+r.height/2-vh/2)*el._d*small;y=Math.max(-48,Math.min(48,y));el.style.translate='0 '+y.toFixed(1)+'px';});}
    window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(drift)}},{passive:true});
    window.addEventListener('resize',drift);drift();
  }
})();
