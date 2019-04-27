import React from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import ServantsLP from './ServantsLP';

const Administration = () => {
	return (
		<div>
			<BrowserRouter>
			<div>
				<Link className='' to='/Songs'>
				<div className='tc bg-light-green br3 pa3 ma2 grow bw2 shadow-3'>
					<div>
						<h4>Song Management</h4>
						<p>Manage the songs in GSKI and schedule the songs monthly.</p>
					</div>
				</div>
				</Link>

				<Link className='' to="/ServantsLP">
				<div className='tc bg-light-green br3 pa3 ma2 grow bw2 shadow-3'>
					<div>
						<h4>Servant Management</h4>
						<p>Manage the servants in GSKI and schedule the servants.</p>
					</div>
				</div>
				</Link>
			</div>
			
			<div className='content'>
        <Route path="/ServantsLP" component={ServantsLP}/>
      </div>

			</BrowserRouter>
		</div>
	);
}

export default Administration;