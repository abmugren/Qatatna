import { combineReducers } from 'redux'

import LanguageReducer from './LanguageReducer'
import AuthReducer from './AuthReducer'


export default combineReducers({
   LanguageReducer: LanguageReducer,
   AuthReducer: AuthReducer,
})