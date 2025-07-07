import Header from '../Header'
import CartListView from '../CartListView'
import CartContext from '../../context/CartContext'
import EmptyCartView from '../EmptyCartView'
import './index.css'

const Cart = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList, removeAllCartItems} = value
      const showEmptyview = cartList.length === 0
      const onClickRemoveAllBtn = () => {
        removeAllCartItems()
      }
      return (
        <>
          <Header />
          {showEmptyview ? (
            <EmptyCartView />
          ) : (
            <div className="cart-container">
              <div className="cart-content-container">
                <div className="cart-data">
                  <h1 className="cart-heading">My Cart</h1>
                  <button
                    onClick={onClickRemoveAllBtn}
                    type="button"
                    className="remove-all-btn"
                  >
                    Remove All
                  </button>
                </div>
                <CartListView />
              </div>
            </div>
          )}
        </>
      )
    }}
  </CartContext.Consumer>
)
export default Cart
