import { useState, useEffect, useCallback } from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: "men's clothing",
    categoryId: '1',
  },
  {
    name: "jewelery",
    categoryId: '2',
  },
  {
    name: "electronics",
    categoryId: '3',
  },
  {
    name: "women's clothing",
    categoryId: '4',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const AllProductsSection = () => {
  const [productsList, setProductsList] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [activeOptionId, setActiveOptionId] = useState(sortbyOptions[0].optionId)
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [activeRatingId, setActiveRatingId] = useState('')

  const getProducts = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const queryParams = new URLSearchParams({
        sort_by: activeOptionId,
        category: activeCategoryId,
        title_search: searchInput,
        rating: activeRatingId 
    }).toString();


    const apiUrl = `https://fakestoreapi.com/products`;

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()

      let updatedData = fetchedData.map(product => ({
        title: product.title,
        price: product.price,
        id: product.id,
        imageUrl: product.image,
        rating: product.rating.rate,
        category: product.category,
      }))

      if (activeCategoryId) {
        updatedData = updatedData.filter(
          product => product.category === categoryOptions.find(c => c.categoryId === activeCategoryId)?.name
        )
      }

      if (searchInput) {
        updatedData = updatedData.filter(product =>
          product.title.toLowerCase().includes(searchInput.toLowerCase())
        )
      }

      if (activeRatingId) {
        updatedData = updatedData.filter(
          product => Math.floor(product.rating) >= Number(activeRatingId)
        )
      }

      if (activeOptionId === 'PRICE_HIGH') {
        updatedData.sort((a, b) => b.price - a.price)
      } else if (activeOptionId === 'PRICE_LOW') {
        updatedData.sort((a, b) => a.price - b.price)
      }

      setProductsList(updatedData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }, [activeOptionId, activeCategoryId, searchInput, activeRatingId]) // Dependencies for useCallback

  useEffect(() => {
    getProducts()
  }, [getProducts]) 

  const changeSortby = useCallback(optionId => {
    setActiveOptionId(optionId)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchInput('')
    setActiveCategoryId('')
    setActiveRatingId('')
  }, [])

  const changeRating = useCallback(ratingId => {
    setActiveRatingId(ratingId)
  }, [])

  const changeCategory = useCallback(categoryId => {
    setActiveCategoryId(categoryId)
  }, [])

  const enterSearchInput = useCallback(() => {
    getProducts() 
  }, [getProducts])

  const changeSearchInput = useCallback(input => {
    setSearchInput(input)
  }, [])

  const renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="all-products-error"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  const renderProductsListView = () => {
    const shouldShowProductsList = productsList.length > 0

    return shouldShowProductsList ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          className="no-products-img"
          alt="no products"
        />
        <h1 className="no-products-heading">No Products Found</h1>
        <p className="no-products-description">
          We could not find any products. Try other filters.
        </p>
      </div>
    )
  }

  const renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const renderAllProducts = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderProductsListView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return (
    <div className="all-products-section">
      <FiltersGroup
        searchInput={searchInput}
        categoryOptions={categoryOptions}
        ratingsList={ratingsList}
        changeSearchInput={changeSearchInput}
        enterSearchInput={enterSearchInput}
        activeCategoryId={activeCategoryId}
        activeRatingId={activeRatingId}
        changeCategory={changeCategory}
        changeRating={changeRating}
        clearFilters={clearFilters}
      />
      {renderAllProducts()}
    </div>
  )
}

export default AllProductsSection