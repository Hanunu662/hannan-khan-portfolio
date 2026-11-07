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
