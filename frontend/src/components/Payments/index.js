import {Link} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import {ToastContainer, toast} from 'react-toastify'
import {IoIosArrowBack} from 'react-icons/io'
import './index.css'
import CartContext from '../../context/CartContext'

const paymentOptions = [
  {
    id: uuidv4(),
    name: 'PhonePe',
  },
  {
    id: uuidv4(),
    name: 'GooglePe',
  },
  {
    id: uuidv4(),
    name: 'Paytm',
  },
  {
    id: uuidv4(),
    name: 'AmazonPay',
  },
  {
    id: uuidv4(),
    name: 'Credit Card',
  },
  {
    id: uuidv4(),
    name: 'Cash on Delivery',
  },
]

const Payments = ({history}) => (
  <CartContext.Consumer>
    {value => {
      const {selectdOption, onChangePaymentOption, cartList} = value
      let total = 0
      cartList.forEach(eachCartItem => {
        total += eachCartItem.price * eachCartItem.quantity
      })
      const onChangeOption = event => {
        onChangePaymentOption(event.target.value)
      }
      const onPlaceOrder = () => {
        toast.success(
          'Your order has been placed successfully. Navigating to home page!',
          {
            autoClose: 2000,
          },
        )
        setTimeout(() => {
          history.replace('/')
          window.location.reload()
        }, 3000)
      }
      return (
        <div>
          <Link to="/cart">
            <button type="button" className="pay">
              <IoIosArrowBack className="back-btn-icon" />
            </button>
          </Link>
          <div className="payment-container">
            <div className="payments-page">
              <h1 className="main-heading">Choose your payement Option</h1>
              <ul className="payments">
                <div className="payements-methods">
                  {paymentOptions.map(eachPayment => (
                    <li key={eachPayment.id} className="li-item">
                      <input
                        type="radio"
                        value={eachPayment.name}
                        checked={selectdOption === eachPayment.name}
                        onChange={onChangeOption}
                      />
                      <label>{eachPayment.name}</label>
                    </li>
                  ))}
                </div>
                <div className="payment-mobile-img">
                  <img
                    src="https://res.cloudinary.com/drjvxkwkq/image/upload/v1724859995/online-payment-companies-1024x683_to61n9.jpg"
                    alt="payment-img"
                  />
                </div>
              </ul>
              <p className="message">
                You are selected the payment mode as :
                <span className="selected-mode"> {selectdOption}</span>
              </p>
              <p className="cart-length">
                Number of Items in Cart : {cartList.length}
              </p>
              <p className="total">
                Total Cost: <span className="selected-mode">₹{total}</span>
              </p>
              {selectdOption && (
                <button
                  className="place-order-btn"
                  type="button"
                  onClick={onPlaceOrder}
                  disabled={!selectdOption}
                >
                  Place Order
                </button>
              )}
              <ToastContainer pauseOnHover={false} position="top-center" />
            </div>
            <div>
              <img
                src="https://res.cloudinary.com/drjvxkwkq/image/upload/v1724859995/online-payment-companies-1024x683_to61n9.jpg"
                alt="payment-img"
                className="payment-img"
              />
            </div>
          </div>
        </div>
      )
    }}
  </CartContext.Consumer>
)

export default Payments
