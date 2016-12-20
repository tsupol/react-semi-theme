import React, { PropTypes } from 'react';

const ModificatorType = PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]);

const Col = (props) => {
    let className = 'sg-col';
    if(props['no-padding'] || props.noPadding) className += ' sg-no-pad';

    // `gridStyle` is calculated style from `Row` and should override custom style
    let style = Object.assign({}, props.style, props.gridStyle);

    return (
        <div className={className} style={style} width={props.width}>
            {props.children}
        </div>
    );
};

Col.propTypes = {
    xs: ModificatorType,
    sm: ModificatorType,
    md: ModificatorType,
    lg: ModificatorType,
    xl: ModificatorType,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ])
};
export default Col;