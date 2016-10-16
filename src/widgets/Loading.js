import React, { PropTypes, Component } from 'react';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';

class Loading extends Component {

  render() {
    if(this.props.inline) return(
      <div className="center-modal">
        <CircularProgress />
      </div>
    );
    return (
      <div className="center">
        <div className="center-inner loading">
          <CircularProgress />
        </div>
      </div>
    );
  }

}
// const Loading = ({inline}) => {
//     if(inline) return(
//         <div className="center-modal">
//             <CircularProgress />
//         </div>
//     );
//     return (
//         <div className="center">
//             <div className="center-inner loading">
//                 <CircularProgress />
//             </div>
//         </div>
//     );
// };

Loading.propTypes = {};
export default Loading;