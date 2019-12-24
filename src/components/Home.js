import React, { Component } from "react";
import { Carousel } from "react-bootstrap";

class Home extends Component {

  render() {
    
    return (
      <div>
        <Carousel>
          <Carousel.Item>
            <img alt="foto1" className="d-block w-100" src="http://www.f-covers.com/cover/c-s-lewis-2-facebook-cover-timeline-banner-for-fb.jpg" />
          </Carousel.Item>
          <Carousel.Item>
            <img alt="foto2" className="d-block w-100" src="http://www.f-covers.com/cover/cs-lewis-made-for-another-world-facebook-cover-timeline-banner-for-fb.jpg" />
          </Carousel.Item>
        </Carousel>
      </div>
      
    );
  }
  
}
 
export default Home;