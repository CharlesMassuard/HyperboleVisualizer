import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

// BOOTSTRAP
import 'bootstrap/dist/css/bootstrap.min.css';



import Donnees from './Components/donnees';
import Header from './Components/Header';
import Footer from './Components/Footer';

const links = [
  { label: 'Home', url: '#' },
  { label: 'About', url: '#' },
  { label: 'Gallery', url: '#' },
  { label: 'Portfolio', url: '#' },
  { label: 'Contact', url: '#' },
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header title="Hyperbole Visualiser" links={links} />
    <Donnees />
    <Footer />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
