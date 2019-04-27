import React from 'react';

const ServantSearchBox = ( {searchField, searchChange} ) => {
	return (
		<div className='pa2'>
			<input 
				className='pa3 ba b--green bg-lightest-blue'
				type='search' 
				placeholder='Search servants' 
				onChange={searchChange}
			/>
		</div>
	);
}

export default ServantSearchBox;