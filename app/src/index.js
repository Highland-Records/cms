import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
const supportsHistory = 'pushState' in window.history
ReactDOM.render((
	<BrowserRouter
		basename="/"
		forceRefresh={!supportsHistory}
	>
		<App />
	</BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
