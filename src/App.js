import {Component} from 'react'
import './App.css'

class App extends Component {
  state = {
    totalCartCount: 0,

    restaurantName: '',
    menuCategories: [],
    activeCategory: '',
    dishes: [],
    dishQuantities: {},
  }

  componentDidMount() {
    this.getFetchedData()
  }

  getFetchedData = async () => {
    const url = 'https://run.mocky.io/v3/77a7e71b-804a-4fbd-822c-3e365d3482cc'
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    const updatedData = {
      restName: data[0].restaurant_name,
      menuCart: data[0].table_menu_list,
    }
    this.updatingData(updatedData)
  }

  updatingData = ({restName, menuCart}) => {
    this.setState({
      restaurantName: restName,
      menuCategories: menuCart,
    })
  }

  handleCategoryChange = category => {
    const {menuCategories} = this.state
    const selectedCategory = menuCategories.find(c => c === category)
    this.setState({
      activeCategory: selectedCategory,
      dishes: selectedCategory.category_dishes || [],
    })
  }

  handleIncrement = dish => {
    this.setState(prevState => {
      const updatedDishQuantities = {
        ...prevState.dishQuantities,
        [dish.dish_name]: (prevState.dishQuantities[dish.dish_name] || 0) + 1,
      }

      const totalCount = Object.values(updatedDishQuantities).reduce(
        (total, quantity) => total + quantity,
        0,
      )

      return {
        dishQuantities: updatedDishQuantities,
        totalCartCount: totalCount,
      }
    })
  }

  handleDecrement = dish => {
    this.setState(prevState => {
      const currentQuantity = prevState.dishQuantities[dish.dish_name] || 0

      if (currentQuantity > 0) {
        const updatedDishQuantities = {
          ...prevState.dishQuantities,
          [dish.dish_name]: currentQuantity - 1,
        }

        const totalCount = Object.values(updatedDishQuantities).reduce(
          (total, quantity) => total + quantity,
          0,
        )

        return {
          dishQuantities: updatedDishQuantities,
          totalCartCount: totalCount,
        }
      }

      return null
    })
  }

  updateDishQuantity = (dish, quantity) => {
    this.setState(prevState => ({
      dishQuantities: {
        ...prevState.dishQuantities,
        [dish.dish_name]: quantity,
      },
    }))
  }

  render() {
    const {
      restaurantName,
      menuCategories,
      activeCategory,
      dishes,
      dishQuantities,
      totalCartCount,
    } = this.state

    return (
      <div>
        <header className="main-container">
          <div className="top-order">
            <h1>{restaurantName}</h1>
            <p>My Orders</p>
            <p>Cart Count {totalCartCount}</p>
          </div>
          <div>
            {menuCategories.map(category => (
              <button
                type="button"
                key={category.menu_category_id}
                onClick={() => this.handleCategoryChange(category)}
                className={activeCategory === category ? 'active' : ''}
              >
                {category.menu_category}
              </button>
            ))}
          </div>
        </header>
        <main className="dish-container">
          {dishes.map(dish => (
            <div className="dish-description-container" key={dish.dish_name}>
              <div className="dish-description">
                <h3>{dish.dish_name}</h3>
                <p>{`${dish.dish_currency} ${dish.dish_price}`}</p>
                <p>{dish.dish_description}</p>
                {dish.dish_Availability === false && <p>Not available</p>}

                {dish.dish_Availability !== false && (
                  <div>
                    <button
                      className="button"
                      type="button"
                      onClick={() => this.handleDecrement(dish)}
                    >
                      -
                    </button>
                    <span>{dishQuantities[dish.dish_name] || 0}</span>
                    <button
                      className="button"
                      type="button"
                      onClick={() => this.handleIncrement(dish)}
                    >
                      +
                    </button>
                    {dish.addonCat && <p>Customizations available</p>}
                  </div>
                )}

                <p>{`Calories: ${dish.dish_calories}`}</p>
                <img
                  className="image-edit"
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
