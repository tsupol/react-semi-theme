import React, {PropTypes, Component} from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import {ajax, getAll} from '../api/ApiCall';
// import helper from '../libs/helper';

injectTapEventPlugin();

class SemiThemeProvider extends Component {

  constructor(props, context) {
    super(props, context);
    // todo: not hard-code serverUrl and access-token
    this.serverUrl = `http://localhost/${devProjectName}/public/api/`;
    this.access_token = 'todo';
  }

  // getChildContext() {
  //
  //     // todo: add default ajax method
  //     return {
  //         ajax: {
  //             call: (method, url, data) => {
  //                 return ajax(method, this.serverUrl + url, data, this.access_token);
  //             },
  //             getAll: (urls) => {
  //                 for(let i in urls) {
  //                     urls[i] = this.serverUrl + urls[i];
  //                 }
  //                 return getAll(urls, this.access_token);
  //             }
  //         }
  //     }
  // }
  //
  // componentWillReceiveProps(nextProps) {
  // }

  render() {
    // console.log('render: app', this.props.user);
    return (
      <MuiThemeProvider >
        <div>
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

// Test.prototype.test = function() {
//     console.log('123456', 123456);
// }
// window.helper = helper;

// Date.prototype.getISODate = function () {
//   let month = this.getMonth() + 1;
//   if (month < 10) month = '0' + month;
//   let day = this.getDate();
//   if (day < 10) day = '0' + day;
//   return this.getFullYear() + '-' + month + '-' + day;
// };
// Date.prototype.getTimeAmPm = function () {
//   // time
//   let hours = this.getHours();
//   let minutes = this.getMinutes();
//   let ampm = hours >= 12 ? 'pm' : 'am';
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   minutes = minutes < 10 ? '0' + minutes : minutes;
//   let strTime = hours + ':' + minutes + '' + ampm;
//   return strTime;
// };
// Date.prototype.getDateTimeStr = function () {
//   // date
//   let month = this.getMonth() + 1;
//   if (month < 10) month = '0' + month;
//   let day = this.getDate();
//   if (day < 10) day = '0' + day;
//   return this.getFullYear() + '-' + month + '-' + day + ' ' + this.getTimeAmPm();
// };
// Date.prototype.unix = function () {
//   return this.getTime() / 1000;
// };
// Date.prototype.getMonthName = function () {
//   var monthNames = ["January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];
//   return monthNames[this.getMonth()];
// };
// Date.prototype.getShortMonthName = function () {
//   var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];
//   return monthNames[this.getMonth()];
// };
//
// String.prototype.has = function (find) {
//   let result = this.indexOf(find);
//   return result != -1;
// };
// String.prototype.capitalize = function () {
//   return this.charAt(0).toUpperCase() + this.slice(1);
// };

SemiThemeProvider.propTypes = {
  children: PropTypes.element,
  location: PropTypes.object,
  actions: PropTypes.object,
  user: PropTypes.object
};
// App.childContextTypes = {
//   ajax: PropTypes.object
// };

export default SemiThemeProvider;