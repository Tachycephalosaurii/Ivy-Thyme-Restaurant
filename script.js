function onload() {
  let url = window.location.href;
  if (url.includes('index')) updateHeader();

  if (url.includes('menu')) {
    let group_template = $('#group');
    let item_template = $('#item');
    $.getJSON('menu.json', function (data) {
      let list = $('#menu-list');
      let groups = Object.keys(data);
      for (let i = 0; i < groups.length; i++) {
        let clone = $(group_template[0].content).clone();
        clone.find('.menu-header-title').text(groups[i][0].toUpperCase() + groups[i].slice(1));
        let array = clone.find('.menu-array');
        let group = data[groups[i]];
        for (var j = 0; j < group.length; j++) {
          let clone = $(item_template[0].content).clone();
          let item = group[j];
          clone.find('.menu-item-name').text(item.name);
          clone.find('.menu-item-description').text(item.description);
          clone.find('.menu-item-price').text('$' + item.price);
          array.append(clone);
        }
        list.append(clone);
      }
      $('.menu-header').each(updateMenu).click(updateMenu);

      $('.menu-item-button').mousedown(function () {
        let button = $(this);
        let fn = addItem.bind(this, +button.attr('add'));
        fn();
        let add = setInterval(fn, 200);
        button.attr('int', add);
      }).on('mouseup mouseout', function () { clearInterval(+$(this).attr('int')); });

      updateMenuCounts();
    });
  }
  
  if (url.includes('order')) updateReceipt();
}

/* Load Templates */
$(function () {
  $('header').load('templates/header.html', onload);
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
  let o = Math.ceil(b.css('opacity') * 100) / 100;
  if (!window.scrollY && o) b.animate({ opacity: 0 }, { duration: 600 });
  else if (!o) b.animate({ opacity: 1 }, { duration: 600 });
}

if (window.location.href.includes('index')) $(window).scroll(updateHeader);


/* Menu Group Accordion */
function collapse(el) {
  let array = el.parent().children('.menu-array');
  array.attr('initial-height', getComputedStyle(array[0]).height);
  array.animate({ height: 0 }, { duration: 200 });
  el.find('svg').html('<path d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z" fill="currentColor"></path>');
}
function open(el) {
  let array = el.parent().children('.menu-array');
  array.animate({ height: array.attr('initial-height') }, { duration: 200 });
  el.find('svg').html('<path d="M17.6569 16.2427L19.0711 14.8285L12.0001 7.75739L4.92896 14.8285L6.34317 16.2427L12.0001 10.5858L17.6569 16.2427Z" fill="currentColor"/>');
}

function updateMenu() {
  let $header = $(this);
  let c = +$header.attr('collapsed');
  $header.attr('collapsed', c === 1 ? 0 : 1);
  if (c === 1) collapse($header);
  else open($header);
}

/* Ordering */
function addItem(amt) {
  let parent = $(this).parent();
  let count = parent.children('.menu-item-count');
  let c = +count.attr('value') + amt;
  count.attr('value', c < 0 ? 0 : c);
  if (+count.attr('value') === 1 && amt === 1) parent.children('.menu-item-button:disabled')[0].disabled = false;
  else if (!+count.attr('value')) {
    parent.children('.menu-item-button')[0].disabled = true;
    clearInterval(+$(this).attr('int'));
    parent.parent().removeClass('isOrdered');
  }
  if (+count.attr('value')) parent.parent().addClass('isOrdered');

  updateOrder();
}

function updateOrder() {
  let order = {
    total: 0,
    items: []
  }
  $('.menu-item').each(function () {
    let item = $(this);
    let amt = +item.find('.menu-item-count').attr('value');
    if (amt) {
      let cost = +item.find('.menu-item-price').text().slice(1);
      order.total += cost * amt;
      order.items.push({
        name: item.find('.menu-item-name').text(),
        price: (cost * amt).toFixed(2),
        count: amt
      });
    }
  });
  order.total = order.total.toFixed(2);
  localStorage.setItem('order', JSON.stringify(order));
  $('#total-value').text(order.total);
}

function updateReceipt() {
  let order = JSON.parse(localStorage.getItem('order'));
  console.log(order);
  order.items.forEach(function(e) {
    let li = $(`<li>${e.name} x${e.count} <strong>[$${e.price}]</strong></li>`);
    $('#order-items').append(li);
  })
  $('#total-value').text(order.total);
}

function updateMenuCounts() {
  let order = JSON.parse(localStorage.getItem('order'));
  order.items.forEach(function(e) {
    $(`.menu-item-name:contains('${e.name}')`).parent().find('.menu-item-count').attr('value', e.count);
  });
}
