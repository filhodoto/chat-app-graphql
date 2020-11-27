import React from 'react';
import ReactDOM from 'react-dom';
import Chat from './components/Chat';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

const App = () => <Chat />;

ReactDOM.render(<App />, document.getElementById('app'));
