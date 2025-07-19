import { useState, useCallback } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'
import Payments from './components/Payments'

import './App.css'

const App = () => {
  const [cartList, setCartList] = useState([])
  const [selectedOption, setSelectedOption] = useState('')

  const addCartItem = useCallback(product => {
    setCartList(prevCartList => {
      const productObject = prevCartList.find(
        eachCartItem => eachCartItem.id === product.id,
      )

      if (productObject) {
        return prevCartList.map(eachCartItem => {
          if (productObject.id === eachCartItem.id) {
            const updatedQuantity = eachCartItem.quantity + product.quantity
            return { ...eachCartItem, quantity: updatedQuantity }
          }
          return eachCartItem
        })
      } else {
        return [...prevCartList, product]
      }
    })
  }, [])

  const deleteCartItem = useCallback(id => {
    setCartList(prevCartList =>
      prevCartList.filter(eachCartItem => eachCartItem.id !== id),
    )
  }, [])

  const removeAllCartItems = useCallback(() => {
    setCartList([])
    setSelectedOption(''); // Clear selected payment option when cart is cleared
  }, [])

  const incrementCartItemQuantity = useCallback(id => {
    setCartList(prevCartList =>
      prevCartList.map(eachCartItem => {
        if (eachCartItem.id === id) {
          const updatedQuantity = eachCartItem.quantity + 1
          return { ...eachCartItem, quantity: updatedQuantity }
        }
        return eachCartItem
      }),
    )
  }, [])

  const decrementCartItemQuantity = useCallback(id => {
    setCartList(prevCartList => {
      const productObject = prevCartList.find(
        eachCartItem => eachCartItem.id === id,
      )

      if (productObject && productObject.quantity > 1) {
        return prevCartList.map(eachCartItem => {
          if (eachCartItem.id === id) {
            const updatedQuantity = eachCartItem.quantity - 1
            return { ...eachCartItem, quantity: updatedQuantity }
          }
          return eachCartItem
        })
      } else {
        return prevCartList.filter(eachCartItem => eachCartItem.id !== id)
      }
    })
  }, [])

  const onChangePaymentOption = useCallback(option => {
    setSelectedOption(option)
  }, [])

  return (
    <BrowserRouter>
      <CartContext.Provider
        value={{
          cartList,
          selectedOption,
          addCartItem: addCartItem,
          deleteCartItem: deleteCartItem,
          incrementCartItemQuantity: incrementCartItemQuantity,
          decrementCartItemQuantity: decrementCartItemQuantity,
          removeAllCartItems: removeAllCartItems,
          onChangePaymentOption: onChangePaymentOption,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <ProtectedRoute
            exact
            path="/OYMSWdJh1S5dzmpLNcsG/payments"
            component={Payments}
          />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </CartContext.Provider>
    </BrowserRouter>
  )
}

export default App