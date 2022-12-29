/* Load Templates */
$(function () {
  $('header').load('templates/header.html', window.location.href.includes('index') ? updateHeader : undefined);
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
setTimeout(() => goto(localStorage.getItem('scrollTo')));

function changeBckg() {
  let bckgs = ['focaccia', 'spices', 'risotto', 'herbs'];
  let i = Math.floor(Math.random() * bckgs.length);
  let img = $('#main-img');
  while (img.prop('src').includes(bckgs[i])) {
    i = Math.floor(Math.random() * bckgs.length);
  }
  img.animate({ opacity: 0 }, {
    done: () => {
      img.prop('src', `images/backgrounds/${bckgs[i]}.jpg`);
      img.animate({ opacity: 1 });
    }
  })
}

if (window.location.href.includes('index')) setInterval(changeBckg, 7500); //change every ten seconds

/* Header Transparency */
function updateHeader() {
  let b = $('#bckg-nav');
  let o = Math.ceil(b.css('opacity') * 100)/100;
  if (!window.scrollY && o) b.animate({opacity: 0}, {duration: 200});
  else if (o === 0) b.animate({opacity: 1}, {duration: 200});
}

if (window.location.href.includes('index')) $(window).scroll(updateHeader);
