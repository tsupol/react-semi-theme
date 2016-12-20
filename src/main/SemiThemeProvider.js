import React, {PropTypes, Component} from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import semiPrototypes from '../libs/semiPrototypes'; // !!! Do not delete, see the file and you will understand
// import {ajax, getAll} from '../api/ApiCall';

// todo: modify theme here (e.g. change form's font)
// see `http://www.material-ui.com/#/customization/themes` for more details
import {grey500} from 'material-ui/styles/colors';
const muiTheme = getMuiTheme({
	palette: {
		disabledColor: grey500
	}
});

injectTapEventPlugin();

class SemiThemeProvider extends Component {

	constructor(props, context) {
		super(props, context);
	}

	render() {
		// console.log('render: app', this.props.user);
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div>
					{this.props.children}
				</div>
			</MuiThemeProvider>
		);
	}
}

SemiThemeProvider.propTypes = {
	children: PropTypes.element,
	location: PropTypes.object,
	actions: PropTypes.object,
	user: PropTypes.object
};
SemiThemeProvider.childContextTypes = {
	ajax: PropTypes.object
};

export default SemiThemeProvider;