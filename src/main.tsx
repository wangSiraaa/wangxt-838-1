import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { useSkateStore } from './stores/useSkateStore'
import { useRentalStore } from './stores/useRentalStore'

useSkateStore.getState().initData();
const skates = useSkateStore.getState().skates;
useRentalStore.getState().initData(skates);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
