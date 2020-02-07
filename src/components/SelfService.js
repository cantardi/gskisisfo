import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap'
import {history} from '../helpers/function'

class SelfService extends Component {
	
	render() {
		return (
			<Container className='tc ma2'>

				<Button onClick={()=> history.push('/ViewSchedule')} 
								className='tc v-top pa3 ma2 w5 h5 shadow-3' bsPrefix='btn-custom' >
					<div>
						<h4>View Schedule</h4>
            <p className='normal f5 mt3'>Feature to view master schedule of song and servant for certain period.</p>
					</div>
				</Button>

				<Button onClick={()=> history.push('/SelectSong')} 
								className='tc v-top pa3 ma2 w5 h5 shadow-3' bsPrefix='btn-custom' >
					<div>
						<h4>Select Songs</h4>
            <p className='normal f5 mt3'>Feature to select songs from the list for the service related to the schedule.</p>
					</div>
				</Button>

				<Button onClick={()=> history.push('/ReqSubstitution')} 
								className='tc v-top pa3 ma2 w5 h5 shadow-3' bsPrefix='btn-custom' >
					<div>
						<h4>Request Substitution</h4>
            <p className='normal f5 mt3'>Feature to request for substitution in case of any urgency of the servant.</p>
					</div>
				</Button>

			</Container>
		)	
	}
	
}

export default SelfService;