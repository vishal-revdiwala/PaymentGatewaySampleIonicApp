import { Component } from '@angular/core';
declare var RazorpayCheckout: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  constructor() {

  }
  items: number = 0;
  pay() {
    if(this.items > 0){
    const options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'YOUR_RAZORPAY_KEY',
      amount: 50000 * this.items,
      name: 'T-shirt',
      prefill: {
        email: 'vishal.r@comakeit.com',
        contact: '9738086629',
        name: 'Vishal Revdiwala'
      },
      theme: {
        color: '#F37254'
      }
    };

    const successCallback = function(success) {
      alert('payment_id: ' + success.razorpay_payment_id);
      const orderId = success.razorpay_order_id;
      const signature = success.razorpay_signature;
    };

    const cancelCallback = function (error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.on('payment.success', successCallback);
    RazorpayCheckout.on('payment.cancel', cancelCallback);
    RazorpayCheckout.open(options);
  }
  }
  increment() {
    this.items = this.items + 1;
  }
  decrement() {
    if (this.items > 0) {
      this.items = this.items - 1;
    }
  }
}
