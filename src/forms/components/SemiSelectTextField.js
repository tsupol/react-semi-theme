import React, { PropTypes, Component } from 'react';
import {HOC} from 'formsy-react';
import TextField from 'material-ui/TextField';
import SemiDropDownButton from './SemiDropDownButton';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';

class SemiSelectTextField extends Component{
    /*
    shouldComponentUpdate(nextProps){
        if(JSON.stringify(this.props.options) != JSON.stringify(nextProps.options)){
            console.log('should update cause options was changed');
            return true;
        }
        if(this.props.value != nextProps.value){
            console.log('should update cause value was changed', this.props.value , '=>', nextProps.value);
            return true;
        }
        return false;
    }
    componentWillMount(){
        console.log('componentWillMount', this.props);
    }
    componentWillUpdate(nextProps){
        this.props.setValue(this.getText(nextProps.value));
        console.log('componentDidUpdate', nextProps.value);
    }
    */
    getText = (value)=> {
        let {options} = this.props;
        let filtered = options.filter((o)=>o.id==value);
        return filtered.length==0 ? '' : filtered[0].name;
    };
    handleClear = () =>{
        this.props.onChange&&this.props.onChange('');
    };
    render() {
        let {
            /*
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
            */

            type,
            floatingLabelText,
            textLabel,
            label,
            options,
            name,
            disabled,
            required,
            value,
            defaultValue,
            onChange,
            icons,
            showClearButton,
            buttons,
            ...rest
        } = this.props;

        let currentValue = this.props.getValue();
        let text = this.getText(currentValue);
        let minusWidth = 0;

        let clearIcon = null;
        if (currentValue && currentValue.length !== 0 && showClearButton && !disabled) {
            clearIcon = (
                <IconButton className="btn-icon" onTouchTap={this.handleClear} style={{verticalAlign: 'middle'}}>
                    <ClearIcon/>
                </IconButton>
            );
            minusWidth += 36;
        }

        let prependIcon = [];
        if(icons){
            for(let i in icons){
                let iconStyle = Object.assign({
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginRight: 10,
                    width: 50,
                    height: 50
                }, icons[i].props.style);
                prependIcon.push(React.cloneElement(icons[i], {
                    key: i,
                    style: iconStyle
                }));
                minusWidth += iconStyle.width + iconStyle.marginRight;
            }
        }

        let appendButton = [];
        if(buttons!==false) {
            for(let i in buttons){
                let appendButtonStyle = Object.assign({
                    display: 'inline-block',
                    width: 200,
                    marginLeft: 10,
                    verticalAlign: 'middle'
                }, buttons[i].props.style);
                appendButton.push(React.cloneElement(buttons[i], {
                    key: i,
                    style: appendButtonStyle
                }));
                minusWidth += appendButtonStyle.width + appendButtonStyle.marginLeft;
            }
        }

        let width = (this.props.fullWidth ? `calc(100% - ${minusWidth}px)` : `auto`);
        return (
            <div>
                {prependIcon}
                <TextField
                    {...rest}
                    floatingLabelText={textLabel}
                    floatingLabelFixed={true}
                    type={type||'text'}
                    inputStyle={{cursor: /*'not-allowed'*/'default'}}
                    style={{width: width, verticalAlign: 'middle'}}
                    errorText={this.props.getErrorMessage()}
                    disabled={true}
                    value={text}
                    />
                {clearIcon}
                {appendButton}
            </div>
        );
    }
}

export default HOC(SemiSelectTextField);