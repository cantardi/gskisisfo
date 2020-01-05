import React , { Component } from 'react';
import { Button, Container } from 'react-bootstrap'
import {history} from '../helpers/function'

class Administration extends Component {
	
	render() {
		return (
			<Container className='tc ma2'>

				<Button onClick={()=> history.push('/MasterFieldList')} 
								className='tc v-top dib br3 pa3 ma2 grow bw2 w5 h5 shadow-3'>
					<div>
						<h4>Master Field Management</h4>
						<p>Manage the master field in GSKI.</p>
					</div>
				</Button>

				<Button onClick={()=> history.push('/MasterDataLP')} 
								className='tc v-top dib br3 pa3 ma2 grow bw2 w5 h5 shadow-3'>
					<div>
						<h4>Master Data Management</h4>
						<p>Manage the master data in system.</p>
					</div>
				</Button>

				<Button onClick={()=> history.push('/PeriodLP')} 
								className='tc v-top dib br3 pa3 ma2 grow bw2 w5 h5 shadow-3'>
					<div>
						<h4>Period Management</h4>
						<p>Manage the period and session in GSKI.</p>
					</div>
				</Button>

				<Button onClick={()=> history.push('/SongLP')} 
								className='tc v-top dib br3 pa3 ma2 grow bw2 w5 h5 shadow-3'>
					<div>
						<h4>Song Management</h4>
						<p>Manage the songs in GSKI and schedule the songs monthly.</p>
					</div>
				</Button>
				
				<Button onClick={()=> history.push('/ServantLP')} 
								className='tc v-top dib br3 pa3 ma2 grow bw2 w5 h5 shadow-3'>
					<div>
						<h4>Servant Management</h4>
						<p>Manage the servants in GSKI and schedule the servants.</p>
					</div>
				</Button>
				
				<Button onClick={()=> history.push('/ScheduleLP')} 
								className='tc v-top dib br3 pa3 ma2 grow bw2 w5 h5 shadow-3'>
					<div>
						<h4>Schedule Management</h4>
						<p>Manage the schedule created from song and servant section.</p>
					</div>
				</Button>

				<Button onClick={()=> history.push('/ServiceLP')} 
								className='tc v-top dib br3 pa3 ma2 grow bw2 w5 h5 shadow-3'>
					<div>
						<h4>Service Management</h4>
						<p>Manage the service transaction generated from the scheduling.</p>
					</div>
				</Button>

			</Container>
		)
		
	}
	
}

export default Administration;