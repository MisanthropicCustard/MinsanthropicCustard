import React from 'react';
import reactDOM from 'react-dom';
import SearchComponent from './SearchComponent.jsx';
import MapDisplayComponent from './MapDisplayComponent.jsx';
import ListComponent from './ListComponent.jsx';
import AddressComponent from './AddressComponent.jsx';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        lat:37.7831708,
        lng: -122.4100967
      },
      login: {
        user: '',
        password: ''
      },
      displayAddress: 'San Francisco, CA, USA',
      listOfVenues: [],
      markers: []
    }
  }

  ajaxSuccess(response) {
    console.log('google maps request success', response);

    this.setState({
      location: response.coordinates,
      displayAddress: response.formalAddress
    });
  }

  logInUser(e, username, password) {
    e.preventDefault();
    var context = this;
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        username: username,
        password: password
      }),
      url: 'http://localhost:8080/api/menus/login',
      success: function() {
        console.log('User successfully logged in')
      },
      error: function(err) {
        console.log('User not stored in db')
      }
    })
  }

  signUpUser(e, username, password) {
    e.preventDefault();
    var context = this;
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        username: username,
        password: password
      }),
      url: 'http://localhost:8080/api/menus/signup',
      success: function() {
        console.log('User successfully stored in db');
        context.logInUser(e, username, password);
      },
      error: function(err) {
        console.log('User not stored in db')
      }
    })
  }

  //Takes in a keyword and location from SearchComponent and does an ajax call through routers.js
  searchForCity(e, keyword, location) {
    var context = this;
    e.preventDefault();

    var sendData ={
      keyword: keyword,
      location: location
    }

    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({location: sendData.location}),
      url: 'http://localhost:8080/api/menus/location',
      success: this.ajaxSuccess.bind(this),
      error: function(err) {
        console.log('error with google maps request', err);
      }
    })

    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url:'http://localhost:8080/api/menus',
      data: JSON.stringify(sendData),
      success: function (res) {
        //parse out response, limits response to 10 results
        console.log(JSON.parse(res).response);

        var venueArr = JSON.parse(res).response.groups[0].items;
        var markers = [];
        venueArr.forEach(function(item) {
          var itemStorage = {};

          itemStorage.name = item.venue.name;
          itemStorage.location = {
            lat: item.venue.location.lat,
            lng: item.venue.location.lng
          }

          markers.push(itemStorage);
        });
        console.log(markers);


        context.setState({
          location: location,
          listOfVenues: JSON.parse(res).response.groups[0].items,
          markers: markers
        });


      },
      error: function (err) {
        console.log('Error posting search function')
      }
    })

    this.setState({
      location: this.state.location,
      displayAddress: this.state.displayAddress
    })

  }
  //the return passes in the searchForCity function into search component to receive user data
  render () {
    console.log('STATE =', this.state.location, this.state.displayAddress);
    return (
      <div>
        <div>
          <form onSubmit={(e) => {this.signUpUser(e, this.refs.username.value, this.refs.password.value)}}>
            <input className="signup" placeholder='Username' ref="username" type="text"/><br></br>
            <input className="signup" placeholder='Password' ref="password" type="text"/><br></br>
            <button type="submit">Sign up</button>
          </form>
          <form onSubmit={(e) => {this.logInUser(e, this.refs.username.value, this.refs.password.value)}}>
            <input className="login" placeholder='Username' ref="username" type="text"/><br></br>
            <input className="login" placeholder='Password' ref="password" type="text"/><br></br>
            <button type="submit">Log in</button>
          </form>
        </div>
        <h1>Trendster</h1>
        <p><i>Showing you the HOT spots</i></p>
        <SearchComponent searchFunc={ this.searchForCity.bind(this) }/>
        <AddressComponent address= { this.state.displayAddress } />
        <MapDisplayComponent center={ this.state.location } markers={ this.state.markers } />
        <ListComponent list={this.state.listOfVenues}/>
      </div>
    );
  }
}


reactDOM.render(<App />, document.getElementById('app'));
