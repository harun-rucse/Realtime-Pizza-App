import axios from 'axios';
import moment from 'moment';
import toastr from 'toastr';
import { initAdmin } from './admin';

// Config totast
toastr.options.timeOut = 100;

let addToCart = document.querySelectorAll('.addToCart');
const cartCounter = document.querySelector('#cartCounter');
const alertMessage = document.querySelector('#success-alert');

async function update(pizza) {
  try {
    const { data } = await axios.post('/update-cart', pizza);
    cartCounter.innerText = data.totalQty;

    toastr.success('Item add to cart!');
  } catch (err) {
    toastr.error('Something went wrong!');
  }
}

addToCart.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const pizza = JSON.parse(btn.dataset.pizza);
    update(pizza);
  });
});

// Remove alert after 2s
if (alertMessage) {
  setTimeout(() => {
    alertMessage.remove();
  }, 2000);
}

// Admin sections
initAdmin();

// Single Order tracking steps
const statuses = document.querySelectorAll('.status_line');
const hiddleInput = document.querySelector('#hiddenInput');
const order = JSON.parse(hiddleInput ? hiddleInput.value : '');
let time = document.createElement('small');

function updateStatus(order) {
  let stepComplete = true;

  statuses.forEach((status) => {
    let statusProp = status.dataset.status;
    console.log(statusProp, order.status);

    if (stepComplete) {
      status.classList.add('step-completed');
    }

    if (statusProp === order.status) {
      stepComplete = false;
      time.innerText = moment(order.updatedAt).format('hh:mm A');
      status.appendChild(time);

      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add('current');
      }
    }
  });
}

updateStatus(order);
