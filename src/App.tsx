import React from 'react';
import routes from '@/routes/index';
import { useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/state';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeProvider, { ThemedGlobalStyle } from '@/theme/theme';
import { Toaster } from 'react-hot-toast';
import './reset.scss';
import '@/styles/index.scss';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { AssetsProvider } from '@/contexts/assets.context';
import { InitialProvider } from '@/contexts/initial.context';

let persistor = persistStore(store);
const App: React.FC = (): React.ReactElement => {
  const element = useRoutes(routes);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <ThemedGlobalStyle />
          <InitialProvider>
            <AssetsProvider>{element}</AssetsProvider>
          </InitialProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <Toaster position="top-center" reverseOrder={false} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
