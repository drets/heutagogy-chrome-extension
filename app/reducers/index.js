import { combineReducers } from 'redux-immutablejs';
import Immutable from 'immutable';
import { reducer as formReducer } from 'redux-form/immutable';

import dataView from './dataView';
import options from './options';
import { reducer as tabs } from './../modules/tabsTracker';

import * as entityReducers from './entityReducers';

const entities = (state = Immutable.fromJS({}), action) => Object.keys(entityReducers).reduce(
  (prev, key) => entityReducers[key](prev, action), state);

export default combineReducers({
  entities,
  dataView,
  options,
  tabs,
  form: formReducer,
});
