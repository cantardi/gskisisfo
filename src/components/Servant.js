import React from 'react';

const Servant = ({name, email, id}) => {
	return (
		<div className='tc bg-light-green dib br3 pa3 ma2 grow bw2 shadow-3'>
			<img alt='robots' src={`https://robohash.org/${id}?size=200x200&set=set2`} />
			<div>
				<h2>{name}</h2>
				<p>{email}</p>
			</div>
		</div>
	);
}

export default Servant;