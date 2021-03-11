import axios from 'axios';
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
