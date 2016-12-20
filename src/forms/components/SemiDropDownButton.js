import React, { PropTypes } from 'react';
import {HOC} from 'formsy-react';
import SemiInputComponent from './SemiInputComponent';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';
import ErrorMessage from '../../forms/ErrorMessage';
import IconButton from 'material-ui/IconButton/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import Popover from 'material-ui/Popover';
import SearchIcon from 'material-ui/svg-icons/action/search';

import SemiAutoComplete from './SemiAutoComplete';

export class SemiDropDownButton extends SemiInputComponent{
    constructor(props){
        super(props);
    }
    state = {
        open: false
    };
    toggleDropDown = (event)=> {
        event.preventDefault();
        let {open} = this.state;
        open = !open;
        let anchorEl = null;
        if(open){
            anchorEl = event.currentTarget;
        }
        this.setState({open, anchorEl});
    };
    handleCloseDropDown = ()=> {
        this.setState({
            open: false,
            anchorEl: null
        });
    };
    controlledValue = (props = this.props) => {
        let value = (props.value || props.defaultValue);
        let valueIsObject = typeof value=='object';
        let defaultValue = props.multiple ? (valueIsObject ? value.map((i)=>parseInt(i,10)) : (value ? [parseInt(value,10)] : props.required ? '' : [])) : (valueIsObject ? parseInt(value[0],10) : (value ? parseInt(value,10) : props.required ? '' : null));
        return defaultValue;
    };
    handleChange = (value, index)=> {
        if(value!=""){
            this.props.setValue(value);
            this.handleCloseDropDown();
            this.props.onChange && this.props.onChange(value, index);
        }
    };
    handleCheck = (item, index)=>  {
        let currentValue = this.props.getValue();
        if(!currentValue) currentValue = this.props.multiple ? [] : null;
        if(this.props.multiple){
            const index = currentValue.map(v=>parseInt(v,10)).indexOf(parseInt(item.props.value,10));
            if(index < 0) {
                currentValue.push(parseInt(item.props.value,10));
                this.props.onChange&&this.props.onChange(currentValue, index);
            }else{
                currentValue.splice(index, 1);
                this.props.onChange&&this.props.onChange(currentValue, index);
            }
        }else{
            currentValue = parseInt(item.props.value);
            this.handleCloseDropDown();
            this.props.onChange&&this.props.onChange(currentValue, index);
        }
        if(typeof currentValue=='object'&&this.props.required&&currentValue.length==0||currentValue==null) currentValue='';
        this.props.setValue(currentValue);
    };
    render() {
        let {open, anchorEl} = this.state;
        let {label, name, value, options, children, multiple, type, anchorOrigin, targetOrigin, ...rest} = this.props;

        let currentValue = this.props.getValue();
        let items = options ? [] : null;
        if(type == "autocomplete"){
            items.push(<listItem key={0}><SemiAutoComplete icons={[<SearchIcon style={{width: 30, height: 30}} />]} name={name} dataSource={options} onChange={this.handleChange} /></listItem>);
        }else if(typeof options === 'object') { // object or array only
            for(let i in options) {
                let id = options[i].id ? parseInt(options[i].id) : parseInt(i);
                items.push(<ListItem value={id} key={id} primaryText={options[i].name}/>);
            }
        }
        let labels = [];

        if(!children&&items) children = items;
        if(!currentValue) currentValue = multiple ? [] : null;

        let valueIsObject = typeof currentValue=='object'&&currentValue!==null;

        for (let i in children) {
            if (valueIsObject){
                if(currentValue.map(v=>parseInt(v,10)).indexOf(parseInt(children[i].props.value, 10)) >= 0){
                    labels.push(children[i].props.primaryText);
                }
            }else{
                if(parseInt(currentValue,10)==parseInt(children[i].props.value,10)){
                    labels.push(children[i].props.primaryText);
                }
            }
        }

        let checkboxItems = children ? children.map((item, i) => {
            let checkbox = (
                <Checkbox
                checked={(valueIsObject ? currentValue.map(v=>parseInt(v,10)).indexOf(parseInt(item.props.value,10)) >= 0 : parseInt(currentValue,10)==parseInt(item.props.value,10))}
                onCheck={this.handleCheck.bind(null, item, i)} />
            );
            return React.cloneElement(item, {
                leftCheckbox: checkbox
            });
        }) : null;
        anchorOrigin = Object.assign({horizontal: 'right', vertical: 'top'}, anchorOrigin);
        targetOrigin = Object.assign({horizontal: 'right', vertical: 'top'}, targetOrigin);
        return (
            <RaisedButton label={label} {...rest} onTouchTap={this.toggleDropDown} disabled={checkboxItems.length==0}>
                <Popover
                    style={{minWidth: '200px'}}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={anchorOrigin}
                    targetOrigin={targetOrigin}
                    onRequestClose={this.handleCloseDropDown}>
                    <List>
                        {checkboxItems}
                    </List>
                </Popover>
            </RaisedButton>
        );
    }
}

export default HOC(SemiDropDownButton);