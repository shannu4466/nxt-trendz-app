import Cookies from 'js-cookie'
import { Redirect, Link } from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">Clothes That Get YOU Noticed</h1>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-img.png"
            alt="clothes that get you noticed"
            className="home-mobile-img"
          />
          <p className="home-description">
            Fashion is the whisper of your soul, a dynamic canvas painted anew with each changing season.
            In every stitch and silhouette, it tells the story of an era, a quiet revolution of self-expression.
            Embrace the captivating dance of trends, for it is through your unique style that you truly become seen, 
            profoundly heard, and beautifully, undeniably you.
          </p>
          <Link to="/products">
            <button type="button" className="shop-now-button">
              Shop Now
            </button>
          </Link>
        </div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-img.png"
          alt="clothes that get you noticed"
          className="home-desktop-img"
        />
      </div>
    </>
  )
}

export default Home
