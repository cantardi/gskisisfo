import React, {Component} from 'react';

class ServantErrorBoundary extends Component {
	constructor() {
		super();
		this.state = {
			hasError: false
		}
	}

	componentDidCatch(error, info){
		this.setState({hasError: true});
	}

	render() {
		const {hasError} = this.state;
		if (hasError)
			return <h1>Oooooppppsss. That's not good</h1>;
		else
			return this.props.children;
	}
}

export default ServantErrorBoundary;