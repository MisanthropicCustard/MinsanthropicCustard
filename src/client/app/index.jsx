import React from 'react';
import reactDOM from 'react-dom';
import SearchComponent from './SearchComponent.jsx';
import MapDisplayComponent from './MapDisplayComponent.jsx';
import ListComponent from './ListComponent.jsx';
import AddressComponent from './AddressComponent.jsx';
import $ from 'jquery';

//THIS.STATE
  //LOCATION: HOLDS LATTITUDE AND LONGITUDE. DEFAULTS SAN FRANCISCO.
  //LOGIN: HOLDS USERNAME, PASSWORD, AND RECENT QUERIES.
  //LIST OF VENUES: ARRAY OF VENUES THAT COME BACK FROM FOURSQUARE.
  //MARKERS: CREATES ARRAY OF LATTITUDE AND LONGITUDE OBJECTS FOR MAP.

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        lat:37.7831708,
        lng: -122.4100967
      },
      login: {
        username: '',
        password: '',
        recentQueries: []
      },
      displayAddress: 'San Francisco, CA, USA',
      listOfVenues: [],
      markers: []
    }
  }

  ajaxSuccess(response) {
    //UPDATES LOCATION AND ADDRESS
    this.setState({
      location: response.coordinates,
      displayAddress: response.formalAddress
    });
  }

  //SIGNS UP USER
  signUpUser(e, username, password) {
    e.preventDefault();
    var context = this;
    //MAKES REQUEST TO SIGN UP NEW USER
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        username: username,
        password: password
      }),
      url: 'http://localhost:8080/api/menus/signup',
      success: function(data) {
        //LOG IN NEW USER IF CALL IS SUCCESSFUL
        context.logInUser(e, data.username, data.password);
      },
      error: function(err) {
        console.log('User not stored in db because they already exist');
      }
    })
  }

  //LOGS IN USER
  logInUser(e, username, password) {
    e.preventDefault();
    var context = this;
    //MAKES REQUEST TO LOG IN USER
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        username: username,
        password: password
      }),
      url: 'http://localhost:8080/api/menus/login',
      success: function(data) {
        //UPDATES RECENT QUERIES AND USER
        var loginInfo = {
          username: data[0].username,
          password: data[0].password,
          recentQueries: data[0].recentQueries
        }
        //USES LOGIN INFO TO RESET THE STATE
        context.setState({
          login: loginInfo
        })
      },
      error: function(err) {
        console.log('User not found in db')
      }
    })
  }

  //UPDATES USERS RECENT SEARCHES
  updateUser(e, location, keyword) {
    e.preventDefault();
    var context = this;
    //UPDATE CURRENT RECENT SEARCHES
    this.state.login.recentQueries.push(this.state.displayAddress.split(',')[0] + ': ' + keyword);
    //MAKE REQUEST WITH CURRENT RECENT SEARCHES
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        username: this.state.login.username,
        recentQueries: this.state.login.recentQueries
      }),
      url: 'http://localhost:8080/api/menus/updateUser',
      success: function(data) {
        //RESET STATE WITH CURRENT RECENT SEARCHES
        context.setState({
          login: {
            username: data.username,
            password: data.password,
            recentQueries: data.recentQueries
          }
        })
        alert('Login success.')
      },
      error: function(err) {
        alert('User not found.');
        console.log('User not found in db')
      }
    })
  }

  //Takes in a keyword and location from SearchComponent and does an ajax call through routers.js
  searchForCity(e, keyword, location) {
    var context = this;
    //IF USER IS LOGGED IN... UPDATE THE RECENT SEARCHES
    if(this.state.login.username) {
      this.updateUser(e, location, keyword);
    }
    if (e) {
      e.preventDefault();
    }

    // clear previous d3 charts from other searches to prevent multiple charts
    $('svg').remove();

    var sendData ={
      keyword: keyword,
      location: location
    }

    //MAKES A REQUEST TO GOOGLE MAPS API
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

    //MAKES A REQUEST TO FOURSQUARE API
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url:'http://localhost:8080/api/menus',
      data: JSON.stringify(sendData),
      success: function (res) {
        //PARSE OUT THE RESULTS INTO AN ARRAY
        window.data1 = JSON.parse(res).response.groups[0].items

        var venueArr = JSON.parse(res).response.groups[0].items;
        window.load();

        var markers = [];

        //GOES THROUGH ARRAY OF VENUES AND CREATES NEW LATTITUDE AND LONGITUDE OF VENUE OBJECTS
        venueArr.forEach(function(item) {
          var itemStorage = {};

          itemStorage.name = item.venue.name;
          itemStorage.location = {
            lat: item.venue.location.lat,
            lng: item.venue.location.lng
          }

          markers.push(itemStorage);
        });
        //UPDATES STATE WITH NEW VENUE LOCATIONS AND MARKERS
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

    //UPDATES STATE WITH NEW VENUE LOCATIONS AND MARKERS
    this.setState({
      location: this.state.location,
      displayAddress: this.state.displayAddress
    })

  }

  componentDidMount() {
    console.log('this location', this.state.displayAddress)
    this.searchForCity(null, '', this.state.displayAddress);
  }

  render () {
    //FIRST DIV
      //FORM IS FOR SIGNING UP AND LOGGING IN USERS

    //SEARCH COMPONENT
      //passes in the searchForCity function into search component to receive user data

    //ADDRESS COMPONENT
      //PASSES IN THE CURRENT ADDRESS BASED ON LOCATION

    //MAP DISPLAY COMPONENT
      //PASSES IN LOCATION AND ARRAY OF MARKERS

    //LIST COMPONENT
      //TAKES IN THE ARRAY OF VENUES

    return (
      <div>
        <div>
          <form onSubmit={(e) => {e.preventDefault()}}>
            <input className="signup" placeholder='Username' ref="signUpUsername" type="text"/><br></br>
            <input className="signup" placeholder='Password' ref="signUpPassword" type="password"/><br></br>
            <button type="button" onClick={(e) => {this.signUpUser(e, this.refs.signUpUsername.value, this.refs.signUpPassword.value);
                                                  this.refs.signUpUsername.value = '';
                                                  this.refs.signUpPassword.value = '';}}>Sign up</button>
            <button type="button" onClick={(e) => {this.logInUser(e, this.refs.signUpUsername.value, this.refs.signUpPassword.value);
                                                  this.refs.signUpUsername.value = '';
                                                  this.refs.signUpPassword.value = '';}}>Log in</button>
          </form>
          <div className="recentSearches">
            <p>Recent Searches</p>
            <ul>{this.state.login.recentQueries.map((query) => {
                return <li>{query}</li>
              })}</ul>
          </div>
        </div>
        <div id='title'>
          <div id='title-text'>
            <h1>Trendster</h1>
            <p><i>Showing you the HOT spots</i></p>
          </div>
        </div>
        <SearchComponent onClick={ (e) => this.searchForCity(e, this.state.location) } searchFunc={ this.searchForCity.bind(this) }/>
        <AddressComponent address= { this.state.displayAddress } />
        <MapDisplayComponent center={ this.state.location } markers={ this.state.markers } venues={ this.state.listOfVenues }/>
        <ListComponent list={this.state.listOfVenues}/>
      </div>
    );
  }
}

reactDOM.render(<App />, document.getElementById('app'));
