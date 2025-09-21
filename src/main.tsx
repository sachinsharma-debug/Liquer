import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Select2 CSS + JS
import "select2/dist/css/select2.min.css";
import "select2/dist/js/select2.full.min.js";
createRoot(document.getElementById("root")!).render(<App />);
