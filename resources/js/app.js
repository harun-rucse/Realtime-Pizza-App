import axios from 'axios';
import toastr from 'toastr';

// Config totast
toastr.options.timeOut = 100;

let addToCart = document.querySelectorAll('.addToCart');
const cartCounter = document.querySelector('#cartCounter');

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
