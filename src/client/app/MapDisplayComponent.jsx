import React from 'react';
import MapConfigComponent from './MapConfigComponent.jsx';

//DISPLAYS MAP WITH DEFAULT LOCATION
class MapDisplayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 800,
      height: 500,
      location: {
        lat:37.7831708,
        lng: -122.4100967
      },
      show: false
    }
  }

  //RELATES TO THE BUTTONS ON THE OUTSIDE OF THE MAP TO MAKE MAP BIGGER OR SMALLER
  increaseSize() {
    this.setState({
      width: this.state.width + 50,
      height: this.state.height + 50
    });
  }

  decreaseSize() {
    this.setState({
      width: this.state.width - 50,
      height: this.state.height - 50
    });
  }
  showInfoWindow() {
     if (this.state.show === false){
       this.setState({
         show: true
       })
     }
     if (this.state.show === true){
       console.log(true)
       this.setState({
         show: false
       })
     }
  }
 //RECENTERS MAP
 render() {
   const markers = [
     {
       location: {
         lat: 37.7831708,
         lng: -122.4100967
       }
     }
   ];

   return (
     <div>
       <div id='map' style={{width: this.state.width, height: this.state.height, background: 'none'}}>
         <button id='zoomIn' onClick={this.increaseSize.bind(this)}> + </button>
         <button id='zoomOut' onClick={this.decreaseSize.bind(this)}> - </button>
         <button id='showInfoWindow' onClick={this.showInfoWindow.bind(this)}>Markers</button>
         <MapConfigComponent center={ this.props.center } markers={ this.props.markers } venues={this.props.venues} show={this.state.show}/>
       </div>
       <div id='d3'/>
     </div>
   );
 }
}

export default MapDisplayComponent;