import React, {PropTypes} from 'react';
import {HOC} from 'formsy-react';
import SemiInputComponent from './SemiInputComponent';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import SemiTextField from './SemiTextField';
import {Row, Col} from 'react-semi-theme/grid';
import helper from '../../libs/helper'

class SemiCheckInput extends SemiInputComponent {

    shouldComponentUpdate(nextProps) {
        let isEqual = false;
        if(this.checkUpdateValue !== undefined) {
            //isEqual = helper.isArrayEqual(this.checkUpdateValue, nextProps.getValue());
            isEqual = this.checkUpdateValue == nextProps.getValue();
        }
        if(!isEqual) {
            // Note: must clone array!
            this.checkUpdateValue = (this.props.multiple || nextProps.multiple) ? nextProps.getValue().slice(0) : nextProps.getValue();
            return true;
        }
        return false;
    }

    controlledValue = (props = this.props) => {
        let value = (props.value || props.defaultValue);
        let valueIsObject = typeof value == 'object';
        // todo: Please do not use shorthand if for " COMPLEX " conditional statement. Always make code simple.
        let defaultValue = props.multiple ? (valueIsObject ? value : (value ? [value] : props.required ? '' : [])) : (valueIsObject ? value[0] : (value ? value : props.required ? '' : null));
        return defaultValue;
    };

    handleCheck(item, index) {
        let currentValue = this.props.getValue();
        //let id = parseInt(item.id, 10);
        if (!currentValue) currentValue = this.props.multiple ? [] : null;
        if (this.props.multiple) {
            const $index = currentValue.indexOf(item.id);
            if ($index < 0) {
                currentValue.push(item.id);
                this.props.onCheck && this.props.onCheck(currentValue, index);
            } else {
                currentValue.splice($index, 1);
                this.props.onCheck && this.props.onCheck(currentValue, index);
            }
        } else {
            currentValue = item.id;
            this.props.onCheck && this.props.onCheck(currentValue);
        }
        if (typeof currentValue == 'object' && this.props.required && currentValue.length == 0 || currentValue == null) currentValue = '';
        this.props.setValue(currentValue);
    }

    render() {
        //console.log('render: SemiTextField', this.props.validations);
        let {
            getErrorMessage,
            getErrorMessages,
            getValue,
            hasValue,
            isFormDisabled,
            isFormSubmitted,
            isPristine,
            setValue,
            isRequired,
            isValid,
            isValidValue,
            resetValue,
            showError,
            showRequired,

            floatingLabelFixed,
            labelPosition,
            children,
            value,
            options,
            multiple,
            type,
            validations,
            validationErrors,
            grid,
            horizontal,
            rightItem,
            ...rest
            } = this.props;



        let currentValue = this.props.getValue();

        // --- Icon Buttons
        let clearIcon = null;
        let minusWidth = 0;
        if (currentValue && currentValue.length !== 0 && !this.props.disabled && this.props.showClearButton) {
            clearIcon = (
                <IconButton className="btn-icon" onTouchTap={this.handleClear.bind(this)}>
                    <ClearIcon/>
                </IconButton>
            );
            minusWidth += 36;
        }

        if (!children && items) children = items;
        if (!currentValue) currentValue = multiple ? [] : null;
        let valueIsObject = typeof currentValue == 'object' && currentValue !== null;

        // generating checkbox/radio

        let items = options ? [] : null;
        if (typeof options === 'object') { // object or array only
            for (let i in options) {
                let option = options[i];
                let id = option.id || i.toString();
                let color = option.color || null;
                let checked = (valueIsObject ? currentValue.indexOf(id) !== -1 : currentValue == id);
                let iconStyle = color ? {fill: color} : {};
                let labelStyle = color ? {color: color} : {};
                let customStyle = Object.assign({
                    marginTop: 2, marginBottom: 2
                },option.style) ;
                let belowInput = null;
                
                // todo: belowItem is temporary
                if (option.belowInput && checked) {
                    if(option.belowInput.type == 'text') {
                        let {grid, hint, ...inputParams} = option.belowInput;
                        belowInput = <SemiTextField fullWidth style={{width: '100%'}} hintText={hint} {...inputParams}/>;
                    }
                }
                
                let checkboxElem =
                    <Checkbox
                        key={i}
                        checkedIcon={multiple ? null : <RadioButtonChecked />}
                        uncheckedIcon={multiple ? null : <RadioButtonUnchecked />}
                        onCheck={this.handleCheck.bind(this, option, i)}
                        label={option.name}
                        checked={checked}
                        iconStyle={iconStyle}
                        labelStyle={labelStyle}
                        style={customStyle}
                    />;
                // todo: finish below item code
                if(horizontal && belowInput) {
                    items.push(
                        <Col key={i} {...option.grid}>
                            <Row>
                                <Col noPadding xs="100%">{checkboxElem}</Col>
                                <Col noPadding xs="100%">{belowInput}</Col>
                            </Row>
                        </Col>
                    );
                } else if(horizontal) {
                    items.push(
                        <Col key={i} {...option.grid}>
                            {checkboxElem}
                        </Col>
                    );
                } else {
                    items.push(checkboxElem);
                }
            }
        }
        let width = (this.props.fullWidth ? `calc(100% - ${minusWidth}px)` : `auto`);
        return (
            <div>
                <div style={{width}}>
                    {horizontal ? <Row>{items}</Row> : items}
                </div>
                <div style={{display: 'inline-block', verticalAlign: 'bottom', paddingBottom: '8px'}}>
                    {clearIcon}
                </div>
            </div>
        );
    }
}

export default HOC(SemiCheckInput);