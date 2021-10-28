//<ПРОВЕРКА НА WEBP>
function testWebP(callback) {
  let webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
// запуск ф-ии проверки
// testWebP(function (support) {
//   if (support == true) {
//     document.querySelector('body').classList.add('_webp');
//   } else {
//     document.querySelector('body').classList.add('_no-webp');
//   }
// });
//</ПРОВЕРКА НА WEBP>

//<БЛОКИРОВКА ЭКРАНА БЕЗ СДВИГА>============
const disableScroll = () => {
  const widthScroll = window.innerWidth - document.body.offsetWidth;
  document.body.dbScrollY = window.scrollY; // запоминаем позицию скролла

  document.body.style.cssText = `
    position: fixed;
    top: ${-window.scrollY}px;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    padding-right: ${widthScroll}px;
  `;
}
const enableScroll = () => {
  document.body.style.cssText = '';
  window.scroll({
    top: document.body.dbScrollY
  })
}
//</БЛОКИРОВКА ЭКРАНА БЕЗ СДВИГА>===========

//<ОБРЕЗКА БОЛЬШОГО ТЕКСТА ДО limit СИМВОЛОВ
function cutText(text, limit) {
  let textTail = '';
  text = text.trim();
  if (text.length <= limit) return text;
  textTail = text.slice(limit);
  text = text.slice(0, limit); // тупо отрезать по лимиту

  /* если нужно обрезать не по символьно, а по словам
  let lastSpace = text.lastIndexOf(" "); //искать последний пробел для обрезки по нему
  if( lastSpace > 0) { // нашлась граница слов, ещё укорачиваем
  text = text.substr(0, lastSpace);
  }
  */
  return text + `...<span class="hidden-text">${textTail}</span> <span class="read-more">Read more</span>`;
}
//</ОБРЕЗКА БОЛЬШОГО ТЕКСТА ДО limit СИМВОЛОВ

//const icon = qs('.icon-menu');
//const menu = qs('.header__main-nav-list');
//
//icon.addEventListener('click', () => {
//    icon.classList.toggle('active')
//    menu.classList.toggle('show')
//    qs('body').classList.toggle('fixed')  //стабилизация моб.меню
//})

//события для гамбургера ******************
// const icon = document.querySelector('.header__icon');
// const headerMenu = document.querySelector('.header__menu-list');

// const toggleMenu = function() {
//    icon.classList.toggle('active');
//    headerMenu.classList.toggle('show');
// }

// icon.addEventListener('click', e => {
//    e.stopPropagation();
//    toggleMenu();
// })

// //закрываем меню если кликнули не по нему
// document.addEventListener('click', e => {
//    const target = e.target;
//    const its_menu = target == headerMenu || headerMenu.contains(target);
//    const its_icon = target == icon;
//    const menu_is_active = headerMenu.classList.contains('show');

//    if (!its_menu && !its_icon && menu_is_active) toggleMenu();
// })
//end ******************

export { testWebP }