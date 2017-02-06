import React from 'react';
import $ from 'jquery';

class SearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'San Francisco CA',
      keyword: 'restaurants'
    };
  }
   //this takes in the keyword and location from the user and passes it up to the search func in index.jsx
   //clears out the search bar after submission
   render() {
     return (
       <div id='search'>
         <form onSubmit={ (e) => {this.props.searchFunc(e, this.refs.keyword.value, this.refs.location.value)
          this.refs.keyword.value = ''
          this.refs.location.value = ''} }>
           <input className="searchInput" type='text' placeholder='Where are you?' ref='location' width='80' />
           <br></br>
           <input className="searchInput" type='text' placeholder='What are you looking for?' ref='keyword' width='80' />
           <br></br>
           <button type='submit' className="submit">Submit</button>
         </form>
       </div>
     );
   }
}

export default SearchComponent;
