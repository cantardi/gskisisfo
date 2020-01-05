import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap'
import {history} from '../helpers/function'

class SelfService extends Component {
	
	render() {
		return (
			<Container className='tc ma2'>

				<Button onClick={()=> history.push('/ViewSchedule')} 
								className='tc v-top dib br3 pa3 ma2 grow bw2 w5 h5 shadow-3'>
					<div>
						<h4>View Schedule</h4>
            <p>Feature to view master schedule of song and servant for certain period.</p>
					</div>
				</Button>

				<Button onClick={()=> history.push('/SelectSong')} 
								className='tc v-top dib br3 pa3 ma2 grow bw2 w5 h5 shadow-3'>
					<div>
						<h4>Select Songs</h4>
            <p>Feature to select songs from the list for the service related to the schedule.</p>
					</div>
				</Button>

			</Container>
		)	
	}
	
}

export default SelfService;