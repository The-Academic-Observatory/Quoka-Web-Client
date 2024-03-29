import { createStore, applyMiddleware, compose } from 'redux';  
import { persistStore, persistReducer } from 'redux-persist';
import { createLogger } from 'redux-logger'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import storage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';  
import initState from './init';

export const history = createBrowserHistory();

export default function configureStore() {  
    let store;

    const logger = createLogger({});

    let middlewares = [thunk, routerMiddleware(history)];

    if (process.env.NODE_ENV !== 'production') {
        middlewares.push(logger); // DEV middlewares
    }

    const composeEnhancers =
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose;

    const enhancer = composeEnhancers(
        applyMiddleware(...middlewares),
    );

    const persistorConfig = {
        key: 'root',
        storage,
        blacklist: [ 'auth', 'connection', 'initialization', 'queryResults', 'map', 'searchField', 'timeline', 'yearSlider' ]
    }

    const reducer = persistReducer(persistorConfig, rootReducer(history))

    store = createStore(reducer, initState, enhancer)

    //try {
    //    persistStore(store)
    //} catch (e) { }

    return store;
}
