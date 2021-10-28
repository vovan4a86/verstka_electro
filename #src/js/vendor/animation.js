/*  анимируемому классу добавляем класс _anim-item
 *  у анимированного элемента появляется доп.класс _animate
    если не нужно, чтобы анимируемый класс исчезал и появлялся повторно, добавляем ему _animate-no-hide

    css можно вынести в отдельный класс:
    ._anim-show {
      transform: translate(0px, 120%);
      opacity: 0;
      transition: all 0.5s ease 0s;
    }
    ._anim-show._animate,
    ._animate ._anim-show {
      opacity: 1;
      transform: translate(0px, 0px);
    }

 */
const animItems = document.querySelectorAll('._anim-item');

if (animItems.length > 0) {

  window.addEventListener('scroll', animOnScroll);

  function animOnScroll() {
    for (let i = 0; i < animItems.length; i++) {
      const item = animItems[i];
      const animItemHeight = item.offsetHeight;
      const animItemOffset = offset(item).top;
      const animStart = 4; // коэффициент момента старта анимации (появление элемента на 1/4 своего размера снизу экрана)
      
      let animItemPoint = window.innerHeight - animItemHeight / animStart;

      if (animItemHeight > window.innerHeight) {
        animItemPoint = window.innerHeight - window.innerHeight / animStart;
      }

      if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
        item.classList.add('_animate');
      } else {
        if (!item.classList.contains('_animate-no-hide')) {
          item.classList.remove('_animate');
        }
      }
    };
  }
  animOnScroll();
}

function offset(el) {
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  }
}