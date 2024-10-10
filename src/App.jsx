import React, { useState, useEffect } from 'react';
// import './App.css'


const products = [
  {
      id: 1,
      name: 'water bottle',
      description: 'color: blue, size: large',
      price: 100,
      discounted_price: 99,
  },
  {
      id: 2,
      name: 'mouse',
      description: 'wired usb port',
      price: 250,
      discounted_price: 199,
  },
  {
      id: 3,
      name: 'watch',
      description: 'color: black, brand: apple',
      price: 5000,
      discounted_price: 4999,
  },
  {
      id: 4,
      name: 'infinix',
      description: 'color blue, storage: 120gb, ram: 2gb',
      price: 25000,
      discounted_price: 24999,
  },
  {
      id: 5,
      name: 'shoes',
      description: 'size: 8, color blue, type: sports wear',
      price: 3000,
      discounted_price: 3000,
  },
];

const PriceBox = ({price, discounted_price}) => {
  if (price > discounted_price){
      return(
          <div className='actual-price text-green'>
              <span className='discount-price line-through text-red'>{price}</span>
              {discounted_price}
          </div>
      )
  }
  return(
      <div className='actual-price text-green'>{price}</div>
  )
}

const ProductBox = ({name, product, checkoutForm, updateCart, ...rest}) => {
  

  function addToCart(productId) {
      
      var currentProduct = products.find((x) => { return x.id == productId });
      var currentQty = document.getElementById('qty' + productId).value == '' || document.getElementById('qty' + productId).value == null ? 1 : document.getElementById('qty' + productId).value;
      cartExistIndex = checkoutForm.cart_details.findIndex((x) => { return x.id == productId });

      var isDecimal = currentQty != Math.trunc(currentQty);

      if (currentQty < 1 || isDecimal) {
          alert('please enter valid quantity');
          document.getElementById(`qty` + productId).value = '';
          return false
      }

      if (cartExistIndex != -1) {
          checkoutForm.cart_details[cartExistIndex].quantity = parseInt(checkoutForm.cart_details[cartExistIndex].quantity) + parseInt(currentQty);
      } else {
          // debugger;
          var cartItem = {
              ...currentProduct,
              quantity: parseInt(currentQty),
              totalAmount: function(){
                  actualPrice = this.price > this.discounted_price ? this.discounted_price : this.price;
                  return actualPrice * this.quantity
              }
          }
          checkoutForm.cart_details.push(cartItem);
      }
      updateCart(checkoutForm.cart_details)
      document.getElementById(`qty` + productId).value = '';
  }
  
  return(
      <div className='grid-item bg-lightgrey-300 rounded-lg p-5'>
          <h1>{ name }</h1>
          <p>{product.description}</p>
          <PriceBox price={product.price} discounted_price={product.discounted_price} />
          <div className='addToCartBox'>
              <input className="h-6 rounded bg-lightgrey-100 pl-1 mb-1" type='number' id={"qty" + product.id}/>
              <button className=" border border-grey-900 px-1 rounded"  onClick={() => {addToCart(product.id)}}>Add to Cart</button>
          </div>
      </div>
  )
}

const ProductList = ({checkoutForm, updateCart}) => {
  
  return(
      <>
      {
          products.map((x, index) => {
              return(
                  <ProductBox name={x.name} product={x} key={index} checkoutForm={checkoutForm} updateCart={updateCart} />                       
              )
          })
      }
      </>
  )
}

const TotalAmountBox = ({cart}) => {
      
      var totalPrice = cart.reduce((accumulator, currentValue) => {
          var currentPrice = currentValue.discounted_price < currentValue.price ? currentValue.discounted_price : currentValue.price
          return accumulator + currentPrice * currentValue.quantity
      }, 0);

      if (totalPrice == 0) {return(<></>)}
      
      return(
          <div className="bg-white rounded" id="totalAmountBox">
              <p className="ml-2">Total: {totalPrice}</p> 
          </div>
      )

}

const CountAdd = () => {
  const [count, setCount] = React.useState(0);

  return(
      <div>
          You clicked {count} times <br/>
          <button onClick={()=>{setCount(count + 1)}}>Click</button>
      </div>
  )
}

const CartBox = ({x, cart, updateCart}) => {
      
  function editQty(productId, qty) {      

      const productIndex = cart.findIndex(x => x.id === productId);
      cart[productIndex].quantity = parseInt(cart[productIndex].quantity) + qty;

      if (cart[productIndex].quantity === 0) {
          cart.splice(productIndex, 1);
      }
      updateCart(cart)
  }

  function removeItemCart(id) {
  
      var proIndex = cart.findIndex((x) => { return x.id == id });
      cart.splice(proIndex, 1);
      updateCart(cart)

  }
  
  return(
      <div className="box bg-white rounded">
          <div className="pl-2.5 pr-2.5 flex justify-between items-center">
              <p>{ x.name }</p>
              <PriceBox price={x.price} discounted_price={x.discounted_price} />
              <div className="flex items-center">
                  <button className="h-8 mb-1.5 w-8 flex items-center justify-center" onClick={() => {editQty(x.id, 1)}}>
                      <span className="text-3xl leading-none">+</span>
                  </button>
                  <p className="inline mx-2 text-xl leading-none">{x.quantity}</p>
                  <button className="h-8 mb-1.5 w-8 flex items-center justify-center" onClick={() => {editQty(x.id, -1)}}>
                      <span className="text-3xl leading-none">-</span>
                  </button>
              </div>
              <div>
                  {x.totalAmount()}
              </div>
              <div>
                  <button className="h-8 mb-1.5 w-8 flex items-center justify-center" onClick={() => {removeItemCart(x.id)}}>
                      <span className="text-xl leading-none text-red">X</span>
                  </button>
              </div>
          </div>
      </div>
  )
}

const CartList= ({cart, updateCart}) => {
  
  return(
      <div id="boxList" className="grid-item slideDown flex flex-col gap-1 mt-1">        
          {
              cart.map((cartDetail) => {
                  
                  return(
                      <CartBox x={cartDetail} cart={cart} updateCart={updateCart} />
                  )
              })
          }
      </div>
  )
}

const App = () => {       
  
  const [message, setMessage] = React.useState('Hello React!');
  const initialCheckoutForm = {
    first_name: '',
    last_name: '',
    phone_number: 0,
    address: '',
    email: '',
    postal_code: '',
    city: '',
    country: '',
    payment_method: '',
    total_amount: '',
    cart_details: [],
  };
  const [checkoutForm, setCheckoutForm] = React.useState(initialCheckoutForm);
  const [cart, setCart] = React.useState([]);

  React.useEffect(() => {
    setCart(checkoutForm.cart_details)
  }, [checkoutForm.cart_details])

  const updateCart = (cart) => {
    setCheckoutForm((prev) => {
      const newObject = {...prev}
      newObject.cart_details = cart;

      return newObject;
    })
  }
  
  function validateFields() {
      var basicFields = [
          'first_name',
          'last_name',
          'address',
          'postal_code'
      ]

      const basicValidation = () => {
          var checkVaildation = true;
          basicFields.forEach((x) => {
              if (document.getElementById(x).value == '' || document.getElementById(x).value == null) {
                  checkVaildation = false;
                  document.getElementById('taskErrorField-' + x).hidden = false
              } else {

                  document.getElementById('taskErrorField-' + x).hidden = true
              }
          })
          return checkVaildation
      }

      var testBasicValidation = basicValidation();
      if (!testBasicValidation) {
          return false
      }

      const validatePhoneNumber = (phoneNumber) => {
          const regex = /^(\+92|92|033|03)[ -]*\d{3}[ -]*\d{7}$/;
          return regex.test(phoneNumber);
      }

      if (!validatePhoneNumber(document.getElementById('number').value)) {
          document.getElementById('taskErrorField-number').hidden = false
          return false
      } else {
          document.getElementById('taskErrorField-number').hidden = true
      }

      const validateEmail = (email) => {
          const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return regex.test(email);
      }

      if (!validateEmail(document.getElementById('email').value)) {
          document.getElementById('taskErrorField-email').hidden = false;
          return false;
      } else {
          document.getElementById('taskErrorField-email').hidden = true;
      }


      if (checkoutForm.cart_details.length == 0) {
          alert("Please add items in your cart first");
          return false
      }
      return true
  }

  function sumbitCheckout (){
  
      const checkForm = validateFields();
      if (checkForm) {
          
          //alert('Thank you for shopping with us. \nTotal Amount: '+ totalPrice);
          setCheckoutForm(initialCheckoutForm)
          document.getElementById('ecommerceForm').reset();
      }
  }

  return(

    <>
    <div id="header" className='slideDown bg-grey-100 text-grey-900 h-20 max-h-20 min-h-20 flex items-center pl-5'>
      <h1 className="text-5xl"> { message } </h1> <br/>
      <button onClick={() => {setMessage('changed')}}>Change Message</button>
    </div>
    <CountAdd/>
    <div id="container" className="flex flex-1">
      <div id="sidebar" className="bg-lightgrey-400 text-grey-900 w-60 p-5 box-border ">
        <h1>Testing</h1>
      </div>
      <div id='mainBox' className="flex w-full gap-2.5 m-4">
        <div className="grid-item slideDown p-5 bg-lightgrey-300" style={{width: "35%"}}>
          <form id="ecommerceForm"  className="flex flex-col gap-1">
            <label className="text-xl">Checkout Form</label>
            <input className="h-7 rounded bg-lightgrey-100 pl-2" type='text' name='first_name' required
              id='first_name' placeholder="Enter you first_name" />
            <span className="text-red" hidden id='taskErrorField-first_name'>This field is required</span>
            <input className="h-7 rounded bg-lightgrey-100 pl-2" type='text' name='last_name' required
              id='last_name' placeholder="Enter you last_name" />
            <span className="text-red" hidden id='taskErrorField-last_name'>This field is required</span>
            <input className="h-7 rounded bg-lightgrey-100 pl-2" type='tel' name='number' required id='number'
              placeholder="Enter you phone_number" />
            <span className="text-red" hidden id='taskErrorField-number'>This field is required</span>
            <textarea className="h-7 rounded bg-lightgrey-100 pl-2" id="address" name="address"
              placeholder="enter your full address"></textarea>
            <span className="text-red" hidden id='taskErrorField-address'>This field is required</span>
            <input className="h-7 rounded bg-lightgrey-100 pl-2" type='text' name='email' required id='email'
              placeholder="Enter you email" />
            <span className="text-red" hidden id='taskErrorField-email'>This field is required</span>
            <input className="h-7 rounded bg-lightgrey-100 pl-2" type='text' name='postal_code' required
              id='postal_code' placeholder="Enter you postal_code" />
            <span className="text-red" hidden id='taskErrorField-postal_code'>This field is required</span>
            <select className="h-7 rounded bg-lightgrey-100 pl-2" id="city" name="city" defaultValue="Karachi">
              <option>Karachi</option>
              <option>Lahore</option>
              <option>Islamabed</option>
              <option>Peshawar</option>
              <option>Queta</option>
            </select>
            <span className="text-red" hidden id='taskErrorField-city'>This field is required</span>
            <select className="h-7 rounded bg-lightgrey-100 pl-2" id="country" name="country" defaultValue="Pakistan">
              <option>Pakistan</option>
            </select>
            <span className="text-red" hidden id='taskErrorField-country'>This field is required</span>
            <div>
              <label className="paymentLabel text-base flex items-center">
                <input type='radio' name='task' required id='payment_method' defaultChecked={true}
                  placeholder="Enter you payment_method" />
                Cash on Delivery
              </label>
              <label className="paymentLabel text-base flex items-center">
                <input type='radio' name='task' required id='payment_method'
                  placeholder="Enter you payment_method" />
                Online Payment
              </label>
            </div>
            <button type='button' onClick={() => {sumbitCheckout()}} id='submitBtn'
              className='hover:bg-grey-300 submitBtn bg-blue text-white p-2.5 rounded'>Checkout</button>
          </form>
            <div>
                <CartList cart={cart} updateCart={updateCart} />
                <div id="totalAmountDiv" className="flex flex-col bg-lightgrey-500 rounded grid-item slideDown mt-2 justify-center">
                  <TotalAmountBox cart={cart} />
                </div>
            </div>
        </div>

        <div id='main' className="flex-1 box-border p-5 gap-5 grid grid-cols-2	">
          <ProductList checkoutForm={checkoutForm} updateCart={() => {updateCart(cart)}} />
        </div>
      </div>
    </div>
    </>
  )
}


export default App
