import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SongLP from './components/Songs/SongLP';
import ServantDtl from './components/ServantDtl';
import ScheduleServantMstr from './components/ScheduleServantMstr';
import * as serviceWorker from './serviceWorker';
import 'tachyons';

ReactDOM.render(<SongLP />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
