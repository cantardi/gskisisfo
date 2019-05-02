import React , { Component } from 'react';
import { Button, Container } from 'react-bootstrap'

class SelfService extends Component {
	render() {
		return (
			<Container className='tc ma2'>

				<Button onClick={()=> this.props.history.push('/PeriodLP')} 
								className='tc v-top dib br3 pa3 ma2 grow bw2 w5 h5 shadow-3'>
					<div>
						<h4>View Schedule</h4>
            <p>Feature to view master schedule of song and servant for certain period.</p>
					</div>
				</Button>

				<Button onClick={()=> this.props.history.push('/SongLP')} 
								className='tc v-top dib br3 pa3 ma2 grow bw2 w5 h5 shadow-3'>
					<div>
						<h4>Request for Substitution</h4>
            <p>Feature to request for substitution for certain session after schedule is published.</p>
					</div>
				</Button>
				
				<Button onClick={()=> this.props.history.push('/ServantLP')} 
								className='tc v-top dib br3 pa3 ma2 grow bw2 w5 h5 shadow-3'>
					<div>
						<h4>Submit Unavailability</h4>
						<p>Feature to lock the unavailable session of servant for scheduling purpose.</p>
					</div>
				</Button>

			</Container>
		)
		
	}
}

export default SelfService;