import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import ProductCard from '../ProductCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const PrimeDealsSection = () => {
  const [primeDeals, setPrimeDeals] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  useEffect(() => {
    const getPrimeDeals = async () => {
      setApiStatus(apiStatusConstants.inProgress)

      const jwtToken = Cookies.get('jwt_token')

      const apiUrl = 'https://fakestoreapi.com/products?limit=5'
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)

      if (response.ok === true) {
        const fetchedData = await response.json()

        const primeDealsData = Array.isArray(fetchedData) ? fetchedData.slice(0, 5) : [];

        const updatedData = primeDealsData.map(product => ({
          title: product.title,
          brand: product.category,
          price: product.price,
          id: product.id,
          imageUrl: product.image,
          rating: product.rating.rate,
        }))
        setPrimeDeals(updatedData)
        setApiStatus(apiStatusConstants.success)
      } else if (response.status === 401) {
        setApiStatus(apiStatusConstants.failure)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    }

    getPrimeDeals()
  }, [])

  const renderPrimeDealsListView = () => {
    return (
      <div>
        <h1 className="primedeals-list-heading">Exclusive Prime Deals</h1>
        <ul className="products-list">
          {primeDeals.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  const renderPrimeDealsFailureView = () => (
    <img
      src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
      alt="Register Prime"
      className="register-prime-image"
    />
  )

  const renderLoadingView = () => (
    <div className="primedeals-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const renderContent = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderPrimeDealsListView()
      case apiStatusConstants.failure:
        return renderPrimeDealsFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return <>{renderContent()}</>
}

export default PrimeDealsSection