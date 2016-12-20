import React, { PropTypes, Component } from 'react';
import Panel from './Panel';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import InfoIcon from 'material-ui/svg-icons/action/info';
import DoneIcon from 'material-ui/svg-icons/action/done';
import BlockIcon from 'material-ui/svg-icons/content/block';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';
import {red500,orange500,green500,lightBlue500,grey200,white} from 'material-ui/styles/colors';

class Message extends Component {
    state = {
        show: true
    };
    close = ()=> {
        this.setState({show: false});
    };
    render() {
        let {show} = this.state;
        let icon = null;
        let backgroundColor = grey200;
        let {type, title, info, always} = this.props;
        type = type ? type.toLowerCase() : 'custom';
        switch (type) {
            case 'warning':
            {
                icon = <WarningIcon color={orange500} style={{width: '60px', height: '60px'}}/>;
                break;
            }
            case 'info':
            {
                icon = <InfoIcon color={lightBlue500} style={{width: '60px', height: '60px'}}/>;
                break;
            }
            case 'success':
            {
                icon = <DoneIcon color={green500} style={{width: '60px', height: '60px'}}/>;
                break;
            }
            case 'error':
            {
                icon = <BlockIcon color={red500} style={{width: '60px', height: '60px'}}/>;
                break;
            }
            default:
            {
                break;
            }
        }
        return show && (
            <Panel>
                <div style={{backgroundColor}}>
                    {!always &&
                    <div style={{float: 'right'}}><IconButton onTouchTap={this.close}><ClearIcon /></IconButton></div>}
                    <div className="con-pad">
                        {icon && <div style={{display: 'inline-block', padding: '0 20px', verticalAlign: 'middle'}}>
                            {icon}
                        </div>}
                        <div
                            style={{display: 'inline-block', padding: '0 20px', verticalAlign: 'middle', height: '60px', lineHeight: !icon&&!info ? '60px' : '30px'}}>
                            {title && (<h3 style={{padding: 0, margin: 0}}>{title}</h3>)}
                            {info && (<div>{info}</div>)}
                        </div>
                    </div>
                </div>
            </Panel>
        );
    }
};

Message.propTypes = {};

export default Message;