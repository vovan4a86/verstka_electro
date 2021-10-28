//-IMPORTS FOR RANGE
import { } from "../vendor/wNumb";
import { } from "../vendor/nouislider";

//-IMPORTS FOR VALIDATION
import { } from '../vendor/inputmask';

// DON'T FORGET FORMS.SCSS!!!

//Tabs
function addTabs() {
  let tabs = document.querySelectorAll("._tabs");
  for (let index = 0; index < tabs.length; index++) {
    let tab = tabs[index];
    let tabs_items = tab.querySelectorAll("._tabs-item");
    let tabs_blocks = tab.querySelectorAll("._tabs-block");
    for (let index = 0; index < tabs_items.length; index++) {
      let tabs_item = tabs_items[index];
      tabs_item.addEventListener("click", function (e) {
        for (let index = 0; index < tabs_items.length; index++) {
          let tabs_item = tabs_items[index];
          tabs_item.classList.remove('_active');
          tabs_blocks[index].classList.remove('_active');
        }
        tabs_item.classList.add('_active');
        tabs_blocks[index].classList.add('_active');
        e.preventDefault();
      });
    }
  }
}

//Spollers
function addSpollers() {
  let spollers = document.querySelectorAll("._spoller");
  let spollersGo = true;
  if (spollers.length > 0) {
    for (let index = 0; index < spollers.length; index++) {
      const spoller = spollers[index];
      spoller.addEventListener("click", function (e) {
        if (spollersGo) {
          spollersGo = false;
          if (spoller.classList.contains('_spoller-992') && window.innerWidth > 992) {
            return false;
          }
          if (spoller.classList.contains('_spoller-768') && window.innerWidth > 768) {
            return false;
          }
          if (spoller.closest('._spollers').classList.contains('_one')) {
            let curent_spollers = spoller.closest('._spollers').querySelectorAll('._spoller');
            for (let i = 0; i < curent_spollers.length; i++) {
              let el = curent_spollers[i];
              if (el != spoller) {
                el.classList.remove('_active');
                _slideUp(el.nextElementSibling);
              }
            }
          }
          spoller.classList.toggle('_active');
          _slideToggle(spoller.nextElementSibling);

          setTimeout(function () {
            spollersGo = true;
          }, 500);
        }
      });
    }
  }

  //=================
  //SlideToggle
  let _slideUp = (target, duration = 500) => {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.style.display = 'none';
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
    }, duration);
  }
  let _slideDown = (target, duration = 500) => {
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;
    if (display === 'none')
      display = 'block';

    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
    }, duration);
  }
  let _slideToggle = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      if (window.getComputedStyle(target).display === 'none') {
        return _slideDown(target, duration);
      } else {
        return _slideUp(target, duration);
      }
    }
  }
}

// QUANTITY
function addQuantity() {
  let quantityButtons = document.querySelectorAll('.quantity__button');
  if (quantityButtons.length > 0) {
    for (let index = 0; index < quantityButtons.length; index++) {
      const quantityButton = quantityButtons[index];
      quantityButton.addEventListener("click", function (e) {
        let value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);
        if (quantityButton.classList.contains('quantity__button_plus')) {
          value++;
        } else {
          value = value - 1;
          if (value < 1) {
            value = 1
          }
        }
        quantityButton.closest('.quantity').querySelector('input').value = value;
      });
    }
  }
}

// RANGE (+import wNumb + nouislider)
function addRange() {
  const priceSlider = document.querySelector('.price__range');
  if (priceSlider) {
    noUiSlider.create(priceSlider, {
      start: [0, 2000],
      connect: true,
      tooltips: [wNumb({
        decimals: 1
      }), wNumb({
        decimals: 1
      })],
      range: {
        'min': [0],
        'max': [2000]
      }
    });

    const priceStart = document.getElementById('price-start');
    const priceEnd = document.getElementById('price-end');
    priceStart.addEventListener('change', setPriceValues);
    priceEnd.addEventListener('change', setPriceValues);
    const inputs = [priceStart, priceEnd];

    function setPriceValues() {
      let priceStartValue;
      let priceEndValue;
      if (priceStart.value != '') {
        priceStartValue = priceStart.value;
      }
      if (priceEnd.value != '') {
        priceEndValue = priceEnd.value;
      }
      priceSlider.noUiSlider.set([priceStartValue, priceEndValue]);
    }
    priceSlider.noUiSlider.on('update', function (values, handle) {
      inputs[handle].value = values[handle];
    })
  }
}

// VALIDATION (+ import inputmask.js + validation.scss) 
function addValidation() {
  const form = document.querySelector('form');
  form.addEventListener('submit', formSend);

  form.addEventListener('click', e => {
    let target = e.target;
    if (target.classList.contains('_error')) {
      target.nextElementSibling.innerHTML = '';
      target.nextElementSibling.style.visible = 'hidden';
      formRemoveError(target)
    }
  })

  let allInputs = document.querySelectorAll('._req')
  allInputs.forEach(inp => {
    if (inp.classList.contains('_phone')) {
      Inputmask("+7(999) 999 9999", {
        //"placeholder": '',
        clearIncomplete: false,
        clearMaskOnLostFocus: false,
        onincomplete: function () {
          formAddError(inp);
          inp.nextElementSibling.innerHTML = 'Введите все цифры'
        }
      }).mask(inp);
    }
    if (inp.classList.contains('_date')) {
      Inputmask("99.99.9999", {
        //"placeholder": '',
        clearIncomplete: false,
        clearMaskOnLostFocus: false,
        onincomplete: function () {
          formAddError(inp);
          inp.nextElementSibling.innerHTML = 'Введите все цифры'
        }
      }).mask(inp);
    }
  })

  async function formSend(e) {
    e.preventDefault();

    let error = formValidate(form);

    // let formData = new FormData(form);
    // formData.append('image', formImage.files[0]);

    if (error === 0) {
      alert('Форма отправлена')
      // form.classList.add('_sending');
      // let response = await fetch('sendmail.php', {
      // 	method: 'POST',
      // 	body: formData
      // });
      // if (response.ok) {
      // 	let result = await response.json();
      // 	alert(result.message);
      // 	formPreview.innerHTML = '';
      // 	form.reset();
      // 	form.classList.remove('_sending');
      // } else {
      // 	alert("Ошибка при отправке", result.message);
      // 	form.classList.remove('_sending');
      // }
    } else {
      // alert('Заполните обязательные поля');
    }
  }

  function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll('._req');

    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      formRemoveError(input);

      if (input.classList.contains('_email')) {
        if (emailTest(input)) {
          formAddError(input);
          input.nextElementSibling.innerHTML = 'Введите корректный email';
          error++;
        }
      }
      if (input.classList.contains('_name')) {
        if (input.value.length < 2) {
          formAddError(input);
          input.nextElementSibling.innerHTML = 'Имя не короче 2 символов';
          error++;
        }
      }
      if (input.getAttribute("type") === "checkbox" && input.checked === false) {
        formAddError(input);
        error++;
      } else {
        if (input.value === '') {
          formAddError(input);
          error++;
        }
      }
    }
    return error;
  }

  function formAddError(input) {
    input.parentElement.classList.add('_error');
    input.classList.add('_error');
  }

  function formRemoveError(input) {
    input.parentElement.classList.remove('_error');
    input.classList.remove('_error');
  }
  //Функция теста email
  function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  }

}

export {

  addTabs,
  addSpollers,
  addQuantity,
  addRange,
  addValidation,

}