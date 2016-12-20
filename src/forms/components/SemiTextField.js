import React, { Component, PropTypes } from 'react';
import {HOC} from 'formsy-react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton/IconButton';
import {ToggleCheckBox, ToggleCheckBoxOutlineBlank} from 'material-ui/svg-icons';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import VisibleOffIcon from 'material-ui/svg-icons/action/visibility-off';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import validator from 'validator';
import { debounce } from './utils';

class SemiTextField extends Component{
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            value: this.props.value || ''
        }
    }
    componentWillMount() {
        this.props.setValue(this.state.value);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.value != this.state.value) {
            // console.log('this.state.value', this.checkUpdateValue, this.state.value);
            this.checkUpdateValue = this.state.value;
            return true;
        } else if(this.checkUpdateValue != nextProps.getValue()) {
            // console.log('nextProps.getValue()', this.checkUpdateValue, nextProps.getValue());
            this.checkUpdateValue = nextProps.getValue();
            return true;
        } else if(this.checkUpdateError != nextProps.getErrorMessage()) {
            this.checkUpdateError = nextProps.getErrorMessage();
            return true;
        } else if(this.checkedValue != nextState.checked){
            this.checkedValue = nextState.checked;
            return true;
        }
        return false;
    }
    handleBlur = (event) => {
        this.props.setValue(event.currentTarget.value);
        delete this.changeValue;
        if (this.props.onBlur) this.props.onBlur(event);
    };
    handleChange = (event) => {
        let value = event.currentTarget.value;
        if(this.props.type && this.props.type.match(/numeric/gi) && value&&!validator.isNumeric(value)){
            value = this.props.getValue();
        }
        // this.props.setValue(value);
        // console.log('value', value);
        this.setState({value});
        if (!this.changeValue) {
            this.changeValue = debounce(this.props.setValue, 400);
        }
        this.changeValue(value);
        this.props.onChange&&this.props.onChange(value, event);
    };
    handleClear = () => {
        this.setState({value: ''});
        this.props.setValue('');
        delete this.changeValue;
        this.props.onChange&&this.props.onChange('');
    };
    render() {
        // console.log('render: SemiTextField', this.props.validations);

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
            value,
            type,
            validations,
            validationErrors,
            checkbox,
            prependIcon,
            appendButton,
            disabled,
            setValidations,
            maxWidth,
            calculatedWidth,
            showClearButton,
            validationError,
            grid,
            hint,
            ...rest
        } = Object.assign({
            // Default
            showClearButton: true,
        }, this.props, {
            // Override
        });

        // let currentValue = this.props.getValue();
        let currentValue = this.state.value;

        // --- Icon Buttons
        let clearIcon = null;
        let minusWidth = 0;

        if (currentValue && currentValue.length !== 0 && !this.props.disabled && showClearButton) {
            clearIcon = (
                <ClearIcon className="btn-clear" onTouchTap={this.handleClear.bind(this)} />
            );
        }
        let passwordIcon = null;
        if (type === 'password') {
            passwordIcon = (
                <IconButton className="btn-icon" disabled style={{display: this.props.type=='password' ? 'inline-block' : 'none', verticalAlign: 'middle'}}>
                    <VisibleOffIcon/>
                </IconButton>
            );
            minusWidth += 36;
        }
        if (type&&type.match(/numeric/gi)) {
            validations['isNumeric'] = true;
            validationErrors['isNumeric'] = 'Accept only number!';
        }
        if(prependIcon){
            let iconStyle = Object.assign({
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: 10,
                width: 50,
                height: 50
            }, prependIcon.props.style);
            prependIcon = React.cloneElement(prependIcon, {
                style: iconStyle
            });
            minusWidth += iconStyle.width + iconStyle.marginRight;
        }
        if(appendButton){
            appendButton = React.cloneElement(appendButton, {
                style: {
                    display: 'inline-block',
                    width: '200px',
                    marginLeft: '10px',
                    verticalAlign: 'middle'
                }
            });
            minusWidth += 210;
        }
        if(checkbox){
            let checkboxIcon = this.state.checked ? <ToggleCheckBox color={getMuiTheme().checkbox.checkedColor} /> : <ToggleCheckBoxOutlineBlank />;
            checkbox = <IconButton
                style={{
                    display: 'inline-block',
                    marginTop: (((this.props.label ? 72 : 36) - 24) / 2),
                    marginRight: 8,
                    verticalAlign: 'middle'
                }}
                onTouchTap={()=>{
                    if(this.state.checked){
                        this.handleClear();
                        disabled = true;
                    }
                    this.setState({checked: !this.state.checked});
                }}>
                {checkboxIcon}
            </IconButton>;
            minusWidth += 56;
            if(!this.state.checked){
                disabled = true;
            }
        }
        let width = (this.props.fullWidth ? `calc(100% - ${minusWidth}px)` : `auto`);

        currentValue = this.state.value;

        let {hide, ...textFieldParams} = rest;
        let customTextField = React.cloneElement(
            <TextField
                {...textFieldParams}
                type={type||'text'}
                id={rest.name||`input-${new Date().getTime()}`}
                ref='input'
                disabled={disabled}
                inputStyle={{cursor: this.props.disabled ? 'not-allowed' : null}}
                style={{width: width, verticalAlign: 'middle'}}
                errorText={this.props.getErrorMessage()}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                value={currentValue}/>
        );

        if(customTextField._owner._instance.refs.input && this.props.inputAttrs){
            for(let i in this.props.inputAttrs){
                customTextField._owner._instance.refs.input.input.setAttribute(i, this.props.inputAttrs[i]);
            }
        }

        return (
            <div className="semi-input-wrap">
                {checkbox}
                {prependIcon}
                {customTextField}
                {clearIcon}
                {passwordIcon}
                {appendButton}
            </div>
        );
    }
}

export default HOC(SemiTextField);