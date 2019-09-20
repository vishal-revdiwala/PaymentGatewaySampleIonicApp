import { Component } from '@angular/core';
declare var RazorpayCheckout: any;
declare var paypal: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  constructor() {

  }
  items: number = 0;
  renderPaypalButton: boolean = true;
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
        name: 'Name'
      },
      theme: {
        color: '#F37254'
      }
    };

    const successCallback = function(success) {
      alert('payment_id: ' + success.razorpay_payment_id);
    };

    const cancelCallback = function (error) {
      alert(error.description);
    };

    RazorpayCheckout.on('payment.success', successCallback);
    RazorpayCheckout.on('payment.cancel', cancelCallback);
    RazorpayCheckout.open(options);
  } else {
    alert('please select a product before checkout ');
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

  intiatePaypal(){
    if(this.renderPaypalButton && this.items > 0){
    console.log(paypal);
    const payPalConfig = {
      env: 'sandbox',
      client: {
        sandbox: 'Paypal_ID',
      },
      commit: false,
      payment: (data, actions) => {
        console.log('data is', data, actions);
        return actions.payment.create({
          payment: {
            transactions: [
              { amount: { total: this.items * 500, currency: 'INR' } }
            ]
          }
        });
      }
    };

    paypal.Buttons({
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.items * 500
            }
          }]
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          alert('Transaction completed by ' + details.payer.name.given_name);
          // Call your server to save the transaction
          return fetch('/paypal-transaction-complete', {
            method: 'post',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              orderID: data.orderID
            })
          });
        });
      }
    }).render('#paypal-button');
    this.renderPaypalButton = false;
  } else if(this.items == 0){
    alert('please select a product before checkout ');
  }
}
}
