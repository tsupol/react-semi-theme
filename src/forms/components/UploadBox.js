import React, { PropTypes, Component } from 'react';
import {HOC} from 'formsy-react';
import Dropzone from 'react-dropzone';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionVisibility from 'material-ui/svg-icons/action/visibility';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { red500 } from 'material-ui/styles/colors';

class UploadBox extends Component {
    constructor(props, context) {
        super(props, context);
    }
    componentDidMount(){
        this.props.setValue(this.props.multiple ? [] : '');
    }
    state = {
        openModal: false,
        files: []
    };

    shouldComponentUpdate(nextProps, nextState){
        let isEqual = false;
        if(this.fileUpdateValue !== undefined) {
            isEqual = this.fileUpdateValue == JSON.stringify(nextState.files);
        }
        if(!isEqual){
            this.fileUpdateValue = JSON.stringify(nextState.files);
            return true;
        }
        return false;
    }

    onDrop = (files)=> {
        let {action, name, multiple} = this.props;
        if(action){
            this.onDropAjax(action, files, name, multiple);
        }else{
            this.props.setValue(multiple ? files : files[0] || '');
            this.setState({files});
        }
    };

    onDropAjax = (action, files, name, multiple)=> {
        this.clearFilesAjax(action, this.state.files, true, this.state.openModal).then(()=>{
            let data = {};
            data[name] = files;
            this.context.ajax.call("post", action, data, {files: [name]}).then((res)=>{
                files = res.files.map((file)=>{
                    let pair = files.filter((f)=>f.name==file.name)[0];
                    return Object.assign(pair, {serial: file.serial, url: file.url});
                });
                let nextFiles = files.map((f)=>f.url);
                this.props.setValue(multiple ? nextFiles : nextFiles[0] || '');
                this.setState({files});
            });
        });
    };

    previewWithModal = () => {
        this.setState({openModal: true});
    };

    handleClosePreview = ()=> {
        this.setState({openModal: false});
    };

    clearFiles = (index, e)=> {
        let {files, openModal} = this.state;
        let {action, multiple} = this.props;
        e.preventDefault();
        e.stopPropagation();
        if(action){
            this.clearFilesAjax(action, files, index, openModal, multiple);
        }else{
            if(index === true){
                files = [];
            }else{
                files.splice(index, 1);
            }
            if(!files.length){
                openModal = false;
            }
            this.props.setValue(multiple ? files : files[0] || '');
            this.setState({files, openModal});
        }
        return false;
    };

    clearFilesAjax = (action, files, index, openModal, multiple)=> {
        return new Promise((resolve, reject)=>{
            let paths = [];
            let nextFiles = files.slice(0);
            if(index === true){
                paths = files.map((file)=>file.serial);
                nextFiles = [];
            }else{
                paths.push(files[index].serial);
                nextFiles.splice(index, 1);
                if(!nextFiles.length){
                    openModal = false;
                }
            }
            if(paths.length){
                this.context.ajax.call("delete", action, {files: paths}).then(()=>{
                    resolve();
                    this.props.setValue(multiple ? nextFiles : nextFiles[0] || '');
                    this.setState({files: nextFiles, openModal});
                },(err)=>{
                    reject(err);
                });
            }else{
                resolve();
                this.props.setValue(multiple ? nextFiles : nextFiles[0] || '');
                this.setState({files: nextFiles, openModal});
            }
        });
    };

    render() {
        let {files} = this.state;
        let {
            style,
            example,
            fullWidth,
            thumbnail,
            count,
            calculatedWidth,
            floatingLabelText,
            hintText,
            validations,
            validationErrors,
            showClearButton,
            setValidations,
            setValue,
            resetValue,
            getValue,
            hasValue,
            getErrorMessage,
            getErrorMessages,
            isFormDisabled,
            isValid,
            isPristine,
            isFormSubmitted,
            isRequired,
            showRequired,
            showError,
            isValidValue,
            validationError,
            ...rest
        } = this.props;
        let dropZoneStyle = Object.assign({
            width: fullWidth ? '100%' : '200px',
            height: '200px',
            borderWidth: '2px',
            borderColor: 'rgb(102, 102, 102)',
            borderStyle: 'dashed',
            borderRadius: '5px',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            cursor: 'pointer',
            boxSizing: 'border-box'
        }, style);
        let exampleStyle = Object.assign({}, dropZoneStyle, {
            borderColor: 'rgba(102, 102, 102, 0.1)',
            cursor: 'default',
            borderStyle: 'solid',
            marginBottom: '24px'
        });
        if(typeof example == "string"){
            exampleStyle['backgroundImage'] = `url(${example})`;
        }
        if(typeof thumbnail == "string"){
            dropZoneStyle['backgroundImage'] = `url(${thumbnail})`;
        }
        if(files.length){
            dropZoneStyle['backgroundImage'] = `url(${files[0].preview})`;
        }
        let {grid, ...dropZoneProps} = rest;
        dropZoneProps = Object.assign({},{
            multiple: false,
            name: 'files'
        }, dropZoneProps);
        return (
            <div style={{marginBottom: 32}}>
                { typeof example == "string" ? (
                    <div style={exampleStyle}></div>
                ) : null }
                <Dropzone onDrop={this.onDrop} {...dropZoneProps} style={dropZoneStyle}></Dropzone>
                { files.length ? (
                    <div style={{position: 'absolute'}}>
                        <IconButton onClick={this.clearFiles.bind(null, true)}>
                            <ActionDelete />
                        </IconButton>
                        { dropZoneProps.multiple && files.length>1 ? (
                            <Badge
                                badgeContent={files.length}
                                primary={true}
                                style={{cursor: 'pointer'}}
                                badgeStyle={{top: 12, right: 12, fontSize: 8, width: 16, height: 16}}
                                onClick={this.previewWithModal}
                            >
                                <ActionVisibility />
                            </Badge>
                        ) : null }
                    </div>
                ) : null }
                <Dialog
                    title="Preview"
                    actions={[
                        <FlatButton
                            label="Close"
                            primary={true}
                            onTouchTap={this.handleClosePreview}
                        />
                    ]}
                    modal={false}
                    open={this.state.openModal}
                    autoScrollBodyContent={true}
                    onRequestClose={this.handleClosePreview}
                >
                    <div style={{margin: '24px 0'}}>
                    { files.map((file, i)=>{
                        let previewBoxStyle = Object.assign({}, dropZoneStyle, {
                            backgroundImage: `url(${file.preview})`
                        });
                        return (
                            <div key={i} style={{marginBottom: '24px'}}>
                                <div style={previewBoxStyle}></div>
                                <IconButton onClick={this.clearFiles.bind(null, i)}>
                                    <ActionDelete />
                                </IconButton>
                                {files.length!=i+1 ? (
                                    <Divider />
                                ): null }
                            </div>
                        );
                    }) }
                    </div>
                </Dialog>
            </div>
        );
    }
}

UploadBox.propTypes = {};
UploadBox.contextTypes = {
    ajax: PropTypes.object
};
export default HOC(UploadBox);