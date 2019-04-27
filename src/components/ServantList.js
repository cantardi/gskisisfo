import React from 'react';
import Servant from './Servant';

const ServantList = ({ servants }) => {
	return (
		<div>
		{
			servants.map((user, i) => {
				return (
					<Servant 
						key={servants[i].id} 
						id={servants[i].id} 
						name={servants[i].name} 
						email={servants[i].email} 
					/>
				);
			})
		}
		</div>
	);
}

export default ServantList;