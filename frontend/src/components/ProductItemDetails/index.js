import { useState, useEffect, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import { BsPlusSquare, BsDashSquare } from 'react-icons/bs'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import CartContext from '../../context/CartContext'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const ProductItemDetails = (props) => {
  const [productData, setProductData] = useState({})
  const [similarProductsData, setSimilarProductsData] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [quantity, setQuantity] = useState(1)

  const { addCartItem } = useContext(CartContext)

  const getFormattedData = data => ({
    description: data.description,
    id: data.id,
    imageUrl: data.image,
    price: data.price,
    rating: data.rating.rate,
    title: data.title,
    totalReviews: data.rating.count,
    category: data.category, // Added category to fetch similar products
  })

  useEffect(() => {
    const getProductData = async () => {
      const { match } = props
      const { params } = match
      const { id } = params

      setApiStatus(apiStatusConstants.inProgress)
      const jwtToken = Cookies.get('jwt_token')
      const apiUrl = `https://fakestoreapi.com/products/${id}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)

      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = getFormattedData(fetchedData)

        // Fetching similar products based on category
        const similarProductsApiUrl = `https://fakestoreapi.com/products/category/${updatedData.category}?limit=4`; // Fetch 4 similar items from the same category
        const similarProductsResponse = await fetch(similarProductsApiUrl, options);

        let updatedSimilarProductsData = [];
        if (similarProductsResponse.ok) {
          const fetchedSimilarData = await similarProductsResponse.json();
          // Filter out the current product from similar products
          updatedSimilarProductsData = fetchedSimilarData.filter(
            item => item.id !== updatedData.id
          ).map(eachSimilarProduct => getFormattedData(eachSimilarProduct));
        }

        setProductData(updatedData)
        setSimilarProductsData(updatedSimilarProductsData)
        setApiStatus(apiStatusConstants.success)
      } else if (response.status === 404) {
        setApiStatus(apiStatusConstants.failure)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    }

    getProductData()
    window.scrollTo(0, 0) // Scroll to top on component mount/id change
  }, [props.match.params.id]) // Dependency array: re-run effect when product ID changes

  const renderLoadingView = () => (
    <div className="products-details-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  const onDecrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1)
    }
  }

  const onIncrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1)
  }

  const renderProductDetailsView = () => {
    const {
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData

    const onClickAddToCart = () => {
      addCartItem({ ...productData, quantity })
      toast.success('Item added to cart', {
        autoClose: 2000,
      })
    }
    let priceUptoTwoDecimals = Math.floor((price * 85) * 100) / 100;

    return (
      <div className="product-details-success-view">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product">
            <h1 className="product-name">{title}</h1>
            <p className="price-details">Rs {priceUptoTwoDecimals}/-</p>
            <div className="rating-and-reviews-count">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <hr className="horizontal-line" />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-controller-button"
                onClick={onDecrementQuantity}
              >
                <BsDashSquare className="quantity-controller-icon" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                className="quantity-controller-button"
                onClick={onIncrementQuantity}
              >
                <BsPlusSquare className="quantity-controller-icon" />
              </button>
            </div>
            <button
              type="button"
              className="button add-to-cart-btn"
              onClick={onClickAddToCart}
            >
              ADD TO CART
            </button>
            <ToastContainer pauseOnHover={false} />
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProductsData.map(eachSimilarProduct => (
            <SimilarProductItem
              productDetails={eachSimilarProduct}
              key={eachSimilarProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  const renderProductDetails = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderProductDetailsView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <div className="product-item-details-container">
        {renderProductDetails()}
      </div>
    </>
  )
}

export default withRouter(ProductItemDetails)