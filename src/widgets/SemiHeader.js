import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';

const SemiHeader = (props) => {
	
	let {children, ...settings} = Object.assign({
		// Default
		align: 'left',
		line: 'none',
		size: 3,
		style: {}
	}, props, {
		// Override
	});
	
	let headerClass = `semi-header header${settings.size}`;
	if (settings.line == 'solid') headerClass += ' line-solid';

	let headerStyle = settings.style;

	return (
		<div className={headerClass} style={headerStyle}><span>{children}</span></div>
	);
};

SemiHeader.propTypes = {
	title: PropTypes.string,
	type: PropTypes.string,
	children: React.PropTypes.oneOfType([
		React.PropTypes.object,
		React.PropTypes.array,
		React.PropTypes.string
	])
};
export default SemiHeader;