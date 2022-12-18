
import { ACTION_INCREMENT,  ACTION_DECREMENT } from "../constants"

const initialState = {
  counter: 0,
}

// reducer
const counter = (store = initialState, action) => {
  switch (action.type) {
    case ACTION_INCREMENT:
      return { ...store, counter: store.counter + 1}
    case ACTION_DECREMENT:
      return { ...store, counter: store.counter - 1 }
    default:
      return store;
  }
}

export default counter;