import ReactDOM from 'react-dom/client'
import Core from './core';
import "handyscript";
// I18NEXT - Localization
import './locale/index'
// TAILWIND - CSS
import './styles/index.css'
import './styles/loader.css'
import './styles/ribbon.css'

const rootElement = document.getElementById("YogaMat");
// const reactRoot = ReactDOM.createRoot(rootElement);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, <Core />);
} else {
  ReactDOM.createRoot(rootElement).render(<Core />);
}