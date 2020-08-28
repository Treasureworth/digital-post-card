import {combineReducers} from 'redux';
import postCardReducer from './post-card-reducer'


const rootReducer = combineReducers({
  postCardReducer: postCardReducer
})

export default rootReducer;
  
  