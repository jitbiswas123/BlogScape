
import { createRoot } from 'react-dom/client'
import {BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css'
import App from './App.jsx'
import ThemeProvider from './components/ThemeProvider.jsx';
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
createRoot(document.getElementById('root')).render(
  <PersistGate  persistor={persistor}>
    <Provider store={store}>
    <BrowserRouter>
    <ThemeProvider>
      <App />
      <ToastContainer autoClose={2000} />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
    </PersistGate>
)
