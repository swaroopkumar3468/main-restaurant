import {Component} from 'react'
import './App.css'

class App extends Component {
  state = {
    restaurantName: '',
    menuCategories: [],
    activeCategory: '',
    dishes: [],
    cartCount: {},
  }

  componentDidMount() {
    this.getResults()
  }

  handleCategoryClick(category) {
    this.setState({
      activeCategory: category.menu_category,
      dishes: category.category_dishes,
    })
  }

  handleAddToCart(dishId) {
    this.setState(prevState => ({
      cartCount: {
        ...prevState.cartCount,
        [dishId]: prevState.cartCount[dishId] + 1,
      },
    }))
  }

  handleRemoveFromCart(dishId) {
    const {cartCount} = this.state
    if (cartCount[dishId] > 0) {
      this.setState(prevState => ({
        cartCount: {
          ...prevState.cartCount,
          [dishId]: prevState.cartCount[dishId] - 1,
        },
      }))
    }
  }

  getResults = async () => {
    const url = 'https://run.mocky.io/v3/77a7e71b-804a-4fbd-822c-3e365d3482cc'
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()

    this.setState({
      restaurantName: data[0].restaurant_name,
      menuCategories: data[0].table_menu_list,
      activeCategory: data[0].table_menu_list[0].menu_category,
      dishes: data[0].table_menu_list[0].category_dishes,
    })
    this.initializeCart(data[0].table_menu_list)
  }

  initializeCart(categories) {
    const initialCart = {}
    categories.forEach(category => {
      category.category_dishes.forEach(dish => {
        initialCart[dish.dish_id] = 0
      })
    })
    this.setState({cartCount: {...initialCart}})
  }

  render() {
    const {
      restaurantName,
      menuCategories,
      activeCategory,
      dishes,
      cartCount,
    } = this.state

    return (
      <div className="restaurant-app">
        <header className="header">
          <h1 className="header-h1">{restaurantName}</h1>
          <div className="cart-container">
            <p className="header-p">My Orders</p>
            <div className="cart-icon">
              🛒 {Object.values(cartCount).reduce((a, b) => a + b, 0)}
            </div>
          </div>
        </header>
        <div>
          {menuCategories.map(category => (
            <button
              type="button"
              key={category.menu_category}
              className={
                category.menu_category === activeCategory ? 'active' : ''
              }
              onClick={() => this.handleCategoryClick(category)}
            >
              {category.menu_category}
            </button>
          ))}
        </div>

        <main className="main">
          {dishes.map(dish => (
            <div key={dish.dish_id} className="dish-container">
              <div className="dish-item">
                <h2>{dish.dish_name}</h2>
                <p>
                  {dish.dish_currency} {dish.dish_price}
                </p>
                <p>{dish.dish_description}</p>
                {dish.dish_available === false && (
                  <p className="not-available">Not available</p>
                )}
                {dish.dish_available !== false && (
                  <div>
                    <button
                      type="button"
                      className="button"
                      onClick={() => this.handleAddToCart(dish.dish_id)}
                    >
                      +
                    </button>
                    <span>{cartCount[dish.dish_id]}</span>
                    <button
                      type="button"
                      className="button"
                      onClick={() => this.handleRemoveFromCart(dish.dish_id)}
                    >
                      -
                    </button>
                  </div>
                )}
                {activeCategory === 'Fast Food' && dish.addonCat && (
                  <p className="customizations">Customizations available</p>
                )}
                {activeCategory === 'Biryani' && !dish.dish_Availability && (
                  <p className="not-available">Not available</p>
                )}
              </div>
              <div>
                <p>{dish.dish_calories} Calories</p>
              </div>
              <div>
                <img
                  className="image"
                  src={dish.dish_image}
                  alt={dish.dish_name}
                />
              </div>
            </div>
          ))}
        </main>
      </div>
    )
  }
}

export default App
