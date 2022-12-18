
import { ADD_PROFILE } from "../constants";

const initialState = {
  profile: []
}

// reducer
const profile = (store = initialState, action) => {
  switch (action.type) {
    case ADD_PROFILE:
      return { 
        ...store, 
        profile: store.profile.concat([{ name: 'Ankita' }, { name: 'Ariel' }])
      }
    default:
      return store;
  }
}

export default profile;