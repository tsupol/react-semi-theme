import React, { PropTypes } from 'react';
import {HOC} from 'formsy-react';
import SemiInputComponent from './SemiInputComponent';
import AutoComplete from 'material-ui/AutoComplete';
import IconButton from 'material-ui/IconButton/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';

import { connect } from 'react-redux';

class SemiAutoComplete extends SemiInputComponent{
    state = {
        sources: []
    };
    loading = [];
    loaded = false;
    //shouldComponentUpdate(nextProps, nextState) {
        //return (this.loaded&&this.state.sources!=nextState.sources)||nextProps.getValue()!=this.props.getValue();
        //return this.loaded&&this.state.sources!=nextState.sources;
    //}
    controlledValue = (props = this.props) => {
        let value = (props.value || props.defaultValue || props.searchText || '');
        return value;
    };
    handleClear = ()=> {
        this.props.setValue('');
        this.props.onChange&&this.props.onChange('', null, event);
        this.refs.input.setState({searchText: ''});
    }
    handleNewRequest(chosenRequest, index){
        const {value,id} = chosenRequest
        let searchText = value ? value : id;
        if(this.props.typeahead) {
            let sources = typeof this.props.dataSource=='object' ? this.props.dataSource : this.state.sources;
            for (let i in sources) if (sources[i].value == value) searchText = sources[i].text;
        }
        this.props.setValue(searchText);
        this.props.onChange&&this.props.onChange(searchText, index, event, this);
    }
    handleUpdateInput(value,e){
        if(typeof this.props.dataSource == "string") {
            if(value) {
                let search = this.props.dataSourceSearch ? this.props.dataSourceSearch : 'search';
                /*
                let data = {};
                data[search] = value;
                */
                //this.load = [];


                /*
                this.context.ajax.call('get', `${this.props.dataSource}?${search}=${value}`, null).then(res=>{
                    console.log('res', res);
                    setTimeout(()=>{
                        this.setState({sources: res.data});
                    }, 1000);
                }).catch(error=>{
                    console.log('error', error);
                });
                */

                //this.setState({sources: []});
                this.loaded = false;
                /*
                this.loading&&this.loading.abort();
                this.loading = $.ajax({method: 'get', url: api.baseUrl(`${this.props.dataSource}?${search}=${value}`), null, dataType: 'json',
                    headers: {
                        'Access-Token': this.props.user.access_token,
                        'Content-Type': 'application/json'
                    },
                    // custom
                    tryCount : 0,
                    retryLimit : 3,
                    success : (response)=>{
                        if(response.status == "error"){
                            //reject(response.data.error);
                            console.log('error', response.data.error);
                        }else{
                            //resolve(response);
                            setTimeout(()=> {
                                this.loaded = true;
                                this.setState({sources: response.data});
                            }, 0);
                        }
                    },
                    error : function(xhr, textStatus, errorThrown ) {
                        if (textStatus == 'timeout' || xhr.status == 500) {
                            console.log('retry: xhr', textStatus, xhr);
                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                //try again
                                this.loading = $.ajax(this);
                            }
                        } else {
                            //reject(xhr);
                            xhr.statusText!='abort'&&console.log('error', xhr);
                        }
                    }
                });
                */
                for(let i in this.loading){
                    clearTimeout(this.loading[i]);
                    this.loading.shift();
                }
                this.loading.push(setTimeout(()=>{
                    this.context.ajax.call('get', `${this.props.dataSource}?${search}=${value}`, null).then(res=>{
                        console.log('res', res);
                        this.loaded = true;
                        if(JSON.stringify(this.state.sources)!=JSON.stringify(res.data)) {
                            this.setState({sources: res.data});
                        }
                    }).catch(error=>{
                        console.log('error', error);
                    })
                }, 500));
                /*
                this.ajax('get', this.props.dataSource, data, (res)=>{
                    let r = this.props.dataSourceResult;
                    let sources = (res[r]?res[r]:[]).map((item)=>{
                        let v = this.props.dataSourceMap.value ? this.props.dataSourceMap.value.split('.').reduce((a, b) => a[b], item) : (item.value ? item.value : item);
                        let t = this.props.dataSourceMap.text ? this.props.dataSourceMap.text.split('.').reduce((a, b) => a[b], item) : (item.text ? item.text : item);

                        return {
                            value: v,
                            text: t
                        }
                    });
                    this.setState({sources});
                });
                */
            }else{
                this.setState({sources: []});
            }
        }else if(typeof this.props.dataSource == "object"){
            console.log('value', value, this.props.dataSource);
            if(value) {
                this.setState({sources: this.props.dataSource});
            }else{
                this.setState({sources: []});
            }
        }

        let searchText = this.props.typeahead ? value : '';
        this.props.setValue(searchText);
        this.props.onChange&&this.props.onChange(searchText, null, event, this);
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
            value,
            type,
            validations,
            validationErrors,
            icons,
            ...rest
        } = this.props;

        let currentValue = this.props.getValue();

        // --- Icon Buttons
        let clearIcon = null;
        let minusWidth = 0;
        if (currentValue && currentValue.length !== 0 && !this.props.disabled) {
            clearIcon = (
                <IconButton className="btn-icon" onTouchTap={this.handleClear.bind(this)}>
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

        let width = (this.props.fullWidth ? `calc(100% - ${minusWidth}px)` : `auto`);

        let sources = typeof this.props.dataSource=='object' ? this.props.dataSource : this.state.sources;

        return (
            <div>
                {prependIcon}
                <AutoComplete
                    ref="input"
                    {...rest}
                    inputStyle={{cursor: this.props.disabled ? 'not-allowed' : null}}
                    style={{width}}
                    errorText={this.props.getErrorMessage()}
                    dataSource={sources}
                    value={currentValue}
                    className={this.props.className || null}
                    onNewRequest={this.handleNewRequest.bind(this)}
                    filter={AutoComplete.caseInsensitiveFilter}
                    dataSourceConfig={Object.assign({value: 'text', text: 'text'}, this.props.dataSourceConfig)}
                    onUpdateInput={this.handleUpdateInput.bind(this)}
                    />
                {clearIcon}
            </div>
        );
    }
}
/*
SemiAutoComplete.propTypes = {
    user: PropTypes.object
};
*/
SemiAutoComplete.contextTypes = {
    router: PropTypes.object,
    helper: PropTypes.object,
    ajax: PropTypes.object,
    dialog: PropTypes.object
};

/*
const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps,null,null,{ withRef: true })(HOC(SemiAutoComplete));
*/
export default HOC(SemiAutoComplete);