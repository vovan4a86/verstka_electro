//<ИМПОРТЫ ФУНКЦИЙ>=================================
import "@babel/polyfill"; // нужен для async/await
import {
  testWebP
} from './vendor/common';
// import { } from './vendor/dynamic_adapt';
// import { addMinPicToUpload } from './vendor/forms';

// import {
//   addTabs,
//   addSpollers,
//   addQuantity,
//   addRange,
//   addValidation,
// } from './vendor/functions';


import { } from './vendor/animation';
// import { } from './vendor/forms';
// import { } from './vendor/inputmask'; // if need in validation
// import { } from './vendor/validation'; // +forms.scss
// import { } from './vendor/quantity'; //+forms.scss
// import { } from './vendor/tabs'; //+forms.scss
// import { } from './vendor/spollers'; //+forms.scss
// import { } from './vendor/popup'; //
// import HystModal from './vendor/hystmodal'; // +hystmodal.scss

// import { } from './vendor/range'; //+forms.scss
import {} from './vendor/select'; // +select.scss
// import { } from './vendor/form-email-submit'; // пример отправки емейла на почту через phpmailer
import Swiper from 'swiper'; // ядро swiper без модулей
import SwiperCore, {
  Pagination,
  Navigation
} from 'swiper/core'; // подключаем модули
SwiperCore.use([Pagination, Navigation]);
// import 'swiper/swiper-bundle.css'; // NEED LOADER IN  webpack config
// import $ from 'jquery';
// import datepicker from 'jquery-ui/ui/widgets/datepicker'
//</ИМПОРТЫ ФУНКЦИЙ>================================

//<ЗАПУСК ФУНКЦИЙ>================================
// addTabs();
// addSpollers();
// addQuantity();
// addRange();
// addValidation();
// addAnimation();

/* ПРОВЕРКА НА ПОДДЕРЖКУ WEBP ======================*/
testWebP(function (support) {
  if (support == true) {
    document.querySelector('body').classList.add('_webp');
  } else {
    document.querySelector('body').classList.add('_no-webp');
  }
});
/*</ПРОВЕРКА НА ПОДДЕРЖКУ WEBP>======================*/
//<СОБЫТИЯ ДЛЯ ГАМБУРГЕРА> ******************
const icon = document.querySelector('.icon-menu');
const headerMenu = document.querySelector('.header__menu-list');

const toggleMenu = function () {
  icon.classList.toggle('active');
  headerMenu.classList.toggle('show');
}

icon.addEventListener('click', e => {
  e.stopPropagation();
  toggleMenu();
})

//закрываем меню если кликнули не по нему
document.addEventListener('click', e => {
  const target = e.target;
  const its_menu = target == headerMenu || headerMenu.contains(target);
  const its_icon = target == icon;
  const menu_is_active = headerMenu.classList.contains('show');

  if (!its_menu && !its_icon && menu_is_active) toggleMenu();
})
//</СОБЫТИЯ ДЛЯ ГАМБУРГЕРА> ******************

// HYSTMODAL
// const myModal = new HystModal({
//   linkAttributeName: "data-hystmodal",
//   // настройки (не обязательно), см. API
// });

/* ЛЕНИВАЯ ПОДГРУЗКА КАРТИНОК ===================================
  1. Меняем <img src="pic.jpg"... на <img data-src"pic.jpg"...
  2. Добавляем <img src="1x1.png"... заглушку размером 1х1 px, чтобы не было ошибки загрузки картинки
  3. Для родителя изображения добавляем картнку loadingа
      background: url('../img/icons/loading.gif') center / 50px no-repeat
  4. Тоже самое для source srcset => data-srcset
*/
/*
const lazyImages = document.querySelectorAll('img[data-src], source[data-srcset]')
const loadMapBlock = document.querySelector('._load-map')
const windowHeight = document.documentElement.clientHeight

// положение эл-ов относительно верха страницы
let lazyImagesPositions = []
if (lazyImages.length > 0) {
  lazyImages.forEach(img => {
    if (img.dataset.src || img.dataset.srcset) {
      // положение картинки сверху + количество проскролленных пикселей = точное положение изображения на странице
      lazyImagesPositions.push(img.getBoundingClientRect().top + pageYOffset)
      lazyScrollCheck() // запускаем ф-ю на случай, если вдруг страницу обновили и не скроллили
    }
  })
}

window.addEventListener('scroll', lazyScroll)

function lazyScroll() {
  // если все эл-ты загружены, то больше не отрабатываем (у отработанных удаляются data аттрибуты)
  if (document.querySelectorAll('img[data-src], source[data-srcset]').length > 0) {
    lazyScrollCheck() // картинки
  }
  if (!loadMapBlock.classList.contains('_loaded')) {
    getMap()  // карта
  }
}

function lazyScrollCheck() {
  let imgIndex = lazyImagesPositions.findIndex(
    item => pageYOffset > item - windowHeight
    // появление эл-та на странице
  )
  if (imgIndex >= 0) {
    if (lazyImages[imgIndex].dataset.src) {
      lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src // замена бутафорной картинки
      lazyImages[imgIndex].removeAttribute('data-src')
    } else if (lazyImages[imgIndex].dataset.srcset) {
      lazyImages[imgIndex].srcset = lazyImages[imgIndex].dataset.srcset
      lazyImages[imgIndex].removeAttribute('data-srcset')
    }
    delete lazyImagesPositions[imgIndex] // удаляем из массива обработанный эл-т
  }
}

/* ЛЕНИВАЯ ПОДГРУЗКА GOOGLE КАРТЫ ====================================
1. Удаляем iframe 
2. Оболочке добавляем класс _load-map
3. В оболочку карты вставляем data-map="https://www.google.com..." ссылку src без style-ов(их настраиваем в js файле width/height) 
4. Добавляем картнку loadingа в оболочку
    background: url('../img/icons/loading.gif') center / 50px no-repeat
*/
/*
function getMap() {
  const loadMapBlockPos = loadMapBlock.getBoundingClientRect().top + pageYOffset
  if (pageYOffset > loadMapBlockPos - windowHeight) {
    const loadMapUrl = loadMapBlock.dataset.map
    if (loadMapUrl) {
      loadMapBlock.insertAdjacentHTML(
        'beforeend',
        `<iframe src="${loadMapUrl}" width="100%" height="476" style="border:0" allowfullscreen="" loading="lazy"></iframe>`
      )
      loadMapBlock.classList.add('_loaded')
    }
  }
}
/*</ЛЕНИВАЯ ПОДГРУЗКА END> =============================== */

//< SWIPER SLIDER >=======================================
// const slider = new Swiper('.block-05__slider-wrapper.swiper-container', {
//   // Default parameters
//   slidesPerView: 1,
//   spaceBetween: 10,
//   navigation: {
//     nextEl: '.block-05__slider-next',
//     prevEl: '.block-05__slider-prev',
//   },
//   pagination: {
//     el: '.swiper-pagination',
//     // type: 'fraction',
//     type: 'custom',
//     clickable: false,
//     dynamicBullets: false,
//     renderCustom: function (slider, current, total) {
//       return ('0' + current).slice(-2) + ' / ' + ('0' + total).slice(-2);
//     }
//   },
// })
//</ SWIPER SLIDER >=======================================

//<MEDIA QUERYS>
const mediaQueryMd = window.matchMedia('(max-width: 768px)')

function mediaChangeMd(e) {
  // если меньше max-width
  if (e.matches) {

  }
  // если больше 
  else {

  }
}
mediaQueryMd.addListener(mediaChangeMd)
mediaChangeMd(mediaQueryMd)
//</MEDIA QUERYS>