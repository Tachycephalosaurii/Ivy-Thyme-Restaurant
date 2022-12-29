/* Load Templates */
$(function () {
  $('header').load('templates/header.html');
  $('footer').load('templates/footer.html');
});

/* Scroll and Change Pages */
function goto() {
  let args = Array.from(arguments), url = args.shift();
  if (!url) return;
  if (url.includes('.html') && !window.location.href.includes(url))
    window.location.href = url;
  else if (url.includes('#')) {
    localStorage.setItem('scrollTo', url);
    let el = $(url)[0];
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: "smooth" });
    setTimeout(() => localStorage.removeItem('scrollTo'), 1000);
  }
  goto.apply(this, args);
}


function changeBckg() {
  let bckgs = ['focaccia', 'spices', 'risotto'];
  let i = Math.floor(Math.random() * bckgs.length);
  let img = $('#main-img');
  while (img.prop('src').includes(bckgs[i])) {
    i = Math.floor(Math.random() * bckgs.length);
  }
  img.animate({ opacity: 0, duration: 100 }, {
    done: () => {
      img.prop('src', `images/backgrounds/${bckgs[i]}.jpg`);
      img.animate({ opacity: 1, duration: 100 });
    }
  })
}

setInterval(changeBckg, 7500); //change every ten seconds

/* Header Transparency */
setTimeout(() => goto(localStorage.getItem('scrollTo')));
if (window.location.href.includes('index'))
  $(window).scroll(function () {
    let h = $('#bckg-nav');
    if (window.scrollY === 0)
      h.animate({ opacity: 0 });
    else if (Math.ceil(h.css('opacity') * 100) === 0)
      h.animate({ opacity: 1 });
  });
else $('#bckg-nav').css('opacity', 1);
