import React, { Component } from "react";
import { Carousel } from "react-bootstrap";
import {userContext} from '../helpers/userContext';

class Home extends Component {
  render() {
    return (
      <div>
        <Carousel>
          <div>
            <img alt="foto1" src="https://i.gocollette.com/tour-media-manager/tours/europe/france/638/packages/master-package/top-carousel/labelleseine-hero1-v2.jpg" />
          </div>
          <div>
            <img alt="foto2" src="http://www.magnum.com.my/assets/images/main_Carousel_01.jpg" />
          </div>
          <div>
            <img alt="foto3" src="https://i.gocollette.com/tour-media-manager/tours/europe/norway/102/packages/master-package/top-carousel/spectacularscandinavia_hero1_norway.jpg" />
          </div>
          <div>
            
          </div>
        </Carousel>
        <div>
          My user name is:
          <userContext.Consumer>
            { user => user.username }
          </userContext.Consumer>
        </div>
      </div>
      
    );
  }
}
 
export default Home;