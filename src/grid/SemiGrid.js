import React, { PropTypes } from 'react';

const SemiGrid = (props) => {
	let className = 'semi-grid';
	if(props.className) className += ' ' + props.className;
	return (
		<div className={className} style={props.style}>
			<div className="sg-wrap">
				{props.children}
			</div>
		</div>
	);
};

SemiGrid.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array
	])
};
export default SemiGrid;