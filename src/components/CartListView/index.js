import {Link} from 'react-router-dom'
import CartItem from '../CartItem'
import CartContext from '../../context/CartContext'

import './index.css'

const CartListView = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList, id} = value
      let total = 0
      cartList.forEach(eachCartItem => {
        total += eachCartItem.price * eachCartItem.quantity
      })
      return (
        <ul className="cart-list">
          {cartList.map(eachCartItem => (
            <CartItem key={eachCartItem.id} cartItemDetails={eachCartItem} />
          ))}
          <div className="totalcost">
            <div className="total-cost">
              <h2>Total Price :Rs {total}/-</h2>
              <p className="no-of-items">Items in cart :{cartList.length}</p>
              <Link to="/OYMSWdJh1S5dzmpLNcsG/payments">
                <button className="checkout-btn" type="button">
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </ul>
      )
    }}
  </CartContext.Consumer>
)

export default CartListView
