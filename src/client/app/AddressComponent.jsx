import React from 'react';

//DISPLAYS WHAT CITY WE ARE SEARCHING
class AddressComponent extends React.Component {
	render() {
		return(
			<div id='address-comp'>
				<h3> See what's trending in { this.props.address } </h3>
			</div>
		);
	}
}

export default AddressComponent;
