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
import { TransactorProvider } from '@/contexts/transactor.context';
import { TransactionProvider } from '@/contexts/transaction.context';
import { LoaderProvider } from '@/contexts/loader.context';

let persistor = persistStore(store);
const App: React.FC = (): React.ReactElement => {
  const element = useRoutes(routes);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <ThemedGlobalStyle />
          <LoaderProvider>
            <InitialProvider>
              <AssetsProvider>
                <TransactionProvider>
                  <TransactorProvider>{element}</TransactorProvider>
                </TransactionProvider>
              </AssetsProvider>
            </InitialProvider>
          </LoaderProvider>
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              style: {
                lineBreak: 'anywhere',
                maxWidth: 400,
              },
            }}
          />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
