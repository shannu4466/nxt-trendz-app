import CartItem from '../CartItem'
import CartContext from '../../context/CartContext'

import './index.css'

const CartListView = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList} = value
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
              <button className="checkout-btn" type="button">
                Checkout
              </button>
            </div>
          </div>
        </ul>
      )
    }}
  </CartContext.Consumer>
)

export default CartListView
