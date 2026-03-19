import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_51T8FW246rJOrpjUSugeqeHpLeiAuwFxgz2RFLmoACfJMuVyu6Rpn3s1G0593196t8IWcMrE3Lu7cif5YXFVCK7Nh008MXrETVc");

createRoot(document.getElementById('root')).render(


 <Elements stripe={stripePromise}>
   <BrowserRouter>
       <App />
   </BrowserRouter>
</Elements>
  
)
