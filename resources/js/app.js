import axios from 'axios';
import moment from 'moment';
import toastr from 'toastr';
import { initAdmin } from './admin';

// Socket connection
const socket = io();

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

// Single Order tracking steps
const statuses = document.querySelectorAll('.status_line');
const hiddleInput = document.querySelector('#hiddenInput');
const order = JSON.parse(hiddleInput ? hiddleInput.value : null);
let time = document.createElement('small');

function updateStatus(order) {
  let stepComplete = true;

  // Remove class name
  statuses.forEach((status) => {
    status.classList.remove('step-completed');
    status.classList.remove('current');
  });

  statuses.forEach((status) => {
    let statusProp = status.dataset.status;

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

// Join;
if (order) {
  socket.emit('join', `order_${order._id}`);
}

const adminAreaPath = window.location.pathname;
if (adminAreaPath.includes('admin')) {
  // Admin sections
  initAdmin(socket);

  socket.emit('join', 'adminRoom');
}

socket.on('orderUpdated', (data) => {
  const updatedOrder = { ...order };
  updatedOrder.status = data.status;
  updatedOrder.updatedAt = moment().format();

  toastr.success('Order status updated!');
  updateStatus(updatedOrder);
});
