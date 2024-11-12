import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routes.tsx';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';
import { StyleProvider } from '@ant-design/cssinjs';
import GlobalLoadData from './GlobalLoadData.tsx';
import StyledComponentsRegistry from '@utils/lib/AntdRegistry.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledComponentsRegistry>
      <StyleProvider hashPriority="high">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <RouterProvider router={router} />
          </PersistGate>
          <Toaster />
          <GlobalLoadData />
        </Provider>
      </StyleProvider>
    </StyledComponentsRegistry>
  </React.StrictMode>
);
