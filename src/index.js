import React from 'react';
import ReactDOM from 'react-dom/client';
import Books from './components/Book';
import 'primereact/resources/themes/saga-blue/theme.css';   /* theme */
import 'primereact/resources/primereact.min.css';           /* core css */
import 'primeicons/primeicons.css';                         /* icons */
import { Analytics } from "@vercel/analytics/react"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Books />
    <Analytics />
  </React.StrictMode>
);

