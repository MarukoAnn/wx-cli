import CreateStore from './redux';
import reducer from './reducer';
import {state} from './state';

const store = new CreateStore(reducer, state);

module.exports = store;