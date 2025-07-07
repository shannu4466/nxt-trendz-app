import { Link } from 'react-router-dom'

import './index.css'

const ProductCard = props => {
  const { productData } = props
  const { title, brand, imageUrl, rating, price, id } = productData

  return (
    <Link to={`/products/${id}`} className="link-item">
      <li className="product-item">
        <img src={imageUrl} alt="product" className="thumbnail" />
        <h1 className="title">{title}</h1>
        <div className="product-details">
          <p className="price">Rs {Math.floor((price * 85) * 100) / 100}/-</p>
          <div className="rating-container">
            <p className="rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </li>
    </Link>
  )
}
export default ProductCard
