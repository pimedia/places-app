import React from 'react';
import PlacesNavigator from './navigation/PlacesNavigator';
import { createStore, combineReducers , applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import placesReducer from './store/places-reducer';
import {init} from './helpers/db';

init().then( ()=> {
  console.log('initialized db');
}).catch(err=>{
console.log('initializing db failed: '+err);
});

export default function App() {

  const rootRedcuer = combineReducers({
  places: placesReducer
  });

  const store = createStore(rootRedcuer, applyMiddleware(ReduxThunk));
  return (
      <Provider store={store}>
      <PlacesNavigator />
      </Provider>
 
  );
}

