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
  var imgs=document.querySelectorAll('.case-img img');
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
