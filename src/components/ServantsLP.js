import React, { Component } from "react";
import ServantSearchBox from './ServantSearchBox';
import ServantScroll from './ServantScroll';
import ServantErrorBoundary from './ServantErrorBoundary';
import ServantList from './ServantList';

class ServantsLP extends Component {

  constructor() {
    super();
    this.state = {
      servants: [],
      searchField: ''
    }
  }

  componentDidMount() {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(users => this.setState({servants: users}));
  }

  onSearchChange = (e) => {
    this.setState({searchField: e.target.value});
  }

  render() {
    const {servants, searchField} = this.state;
    const filteredServants = servants.filter(servant => {
      return servant.name.toLowerCase().includes(searchField.toLowerCase())
    });

    return (!servants.length) ?
    <h1 className='f1 tc'>Loading</h1> :
    (
      <div className='tc'>
        <h1 className='f1'>RoboFriends</h1>
        <ServantSearchBox searchChange={this.onSearchChange} />
        <ServantScroll>
          <ServantErrorBoundary>
            <ServantList servants= { filteredServants } />
          </ServantErrorBoundary>
        </ServantScroll>
      </div>
    );
  }
}
 
export default ServantsLP;