import React, {PropTypes, Component} from 'react';
import ErrorMessage from './ErrorMessage';
import SemiTextField from './components/SemiTextField';
import SemiSelectField from './components/SemiSelectField';
import SemiDatePicker from './components/SemiDatePicker';
import SemiColorPicker from './components/SemiColorPicker';
import SemiSliderInput from './components/SemiSliderInput';
import SemiToggleInput from './components/SemiToggleInput';
import SemiCheckInput from './components/SemiCheckInput';
import SemiAutoComplete from './components/SemiAutoComplete';
import SemiSelectTextField from './components/SemiSelectTextField';
import UploadBox from './components/UploadBox';
import {SemiGrid, Row, Col} from 'react-semi-theme/grid';
import * as icons from 'material-ui/svg-icons';
import helper from './../libs/helper';

class FormGenerator extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			values: props.formTemplate.values || {},
			data: props.formTemplate.data || {}
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			values: nextProps.formTemplate.values || {},
			data: nextProps.formTemplate.data || {}
		});
	}

	getDataByName = (name) => {
		// Get SemiForm value first
		return this.context.getData(name) ? this.context.getData(name) : this.state.data[name] ? this.state.data[name] : [];
	};

	getValueByName = (name) => {
		// Get SemiForm value first
		return this.context.getValue(name) ? this.context.getValue(name) : this.state.values[name] ? this.state.values[name] : '';
	};

	render() {
		// console.log('render: form', this.state.ready);
		let props = this.props;
		let {formTemplate} = props;

		let components = [];
		if (formTemplate) {
			// let values = this.state.values,
			// 	data = this.state.data,
			// 	validators = formTemplate.validators,
			// 	formSettings = formTemplate.settings;

			// if (validators) {
			// 	// todo: form validation is to be shared by multiple components in the form
			// }

			for (let rowId in formTemplate.components) {

				let row = formTemplate.components[rowId];
				let rowSettings = {};
				let rowClassName = null;
				let rowProps = {};
				let rowStyle = {};
				// console.log('row', row);

				// Process Row Settings
				// ----------------------------

				// Hide is not even render (more like exclude)
				// Note: rowSettings is now `deprecated`!
				if (rowSettings && rowSettings.hide) continue;
				if (rowSettings && rowSettings.separator) {
					rowClassName = 'has-separator';
				}

				if (row.hide) continue;
				if (row.separator) rowClassName = 'has-separator';
				if (row.center) {
					// console.log('row.center', row.center);
					rowProps.center = row.center;
				}

				// There are 2 types of row...
				// 1. Array row (short and no row parameters)
				// 2. Object row (has Parameters and calculated above)
				if (!Array.isArray(row)) {
					rowSettings = row.settings; // Deprecated!
					rowStyle = row.style;
					row = row.items;
				}

				// Create Cols and Items
				// ----------------------------
				let cols = [];
				for (let itemId in row) {

					let item = row[itemId],
						component = null,
						{name} = item;

					// todo: get value from SemiForm
					// let value = item.type == 'string' ? item.value : values[name];
					let value = this.getValueByName(name);

					// --- Validation
					let vs = item.validations,
						validations = {},
						validationErrors = {};
					if (vs) {
						// Parse validation string and assign appropriate error message
						if (typeof vs === 'string') {
							let params = vs.split(':');
							if (params.length === 1) { // e.g. isEmail
								validations[vs] = true;
								if (ErrorMessage[vs]) validationErrors[vs] = ErrorMessage[vs];
							} else if (params.length === 2) { // e.g. minLength: 2
								validations[params[0]] = params[1];
								if (ErrorMessage[params[0]]) validationErrors[params[0]] = ErrorMessage[params[0]];
							}
						}
						// todo if not string
					}

					let {type, element, ...rest} = Object.assign({
						// Default
						required: false,
						disabled: false,
						fullWidth: true,
						showClearButton: true,
						icon: false,
						iconColor: '#999'
					}, item, {
						// Override
						floatingLabelText: item.label, // todo: * and optional
						hintText: item.hint ? item.hint : '',
						value,
						validations,
						validationErrors
					});

					// --- Icon
					// let leftIcon = null;
					let iconName = {name: icons[rest.icon]}; // dynamic tag must be object
					let iconStyle = {color: rest.iconColor, height: 24, width: 24};
					let leftIcon = rest.icon && icons[rest.icon] ? <div style={{marginTop: 36}}><iconName.name style={iconStyle} viewBox="0 0 22 22" /></div> : null;

					// todo: fix Unknown prop here...
					let {marginLeft, iconColor, icon, ...inputParams} = rest;

					if(item.hide) type = 'empty'; // hidden column

					// --- Col Params
					let colParams = {};
					if(rest.noPadding) colParams.noPadding = true;

					switch (type) {
						case 'custom':
							component = element;
							break;
						case 'text':
							component = (
								<SemiTextField
									{...inputParams}
									/>
							);
							break;
						case 'select+text':
							component = (
								<SemiSelectTextField
									{...inputParams}
									/>
							);
							break;
						case 'password':
							component = (
								<SemiTextField
									{...inputParams} type="password"
									/>
							);
							break;
						case 'label':
							component = (
								<div className="form-string" style={item.style}>{item.label ? item.label : ''}</div>
							);
							break;
						case 'space':
							component = (
								<div className="form-space" style={{height: item.height}}></div>
							);
							break;
						case 'numeric':
							component = (
								<SemiTextField
									{...inputParams} type="numeric"
									/>
							);
							break;
						case 'hidden':
							component = (
								<div style={{display: 'none'}}>
									<SemiTextField
										{...inputParams} type="hidden"
										/>
								</div>
							);
							break;
						case 'select':
							component = (
								<SemiSelectField
									options={this.getDataByName(name)}
									{...inputParams}
									/>
							);
							break;
						case 'multiselect':
							component = (
								<SemiSelectField
									options={this.getDataByName(name)}
									multiple={true}
									{...inputParams}
									/>
							);
							break;
						case 'empty':
							component = (null);
							break;
						case 'color':
							component = (
								<SemiColorPicker
									{...inputParams}
									/>
							);
							break;
						case 'date':
							component = (
								<SemiDatePicker
									{...inputParams}
									/>
							);
							break;
						case 'checkbox':
							component = (
								<SemiCheckInput
									multiple={true}
									{...inputParams}
									/>
							);
							break;
						case 'radio':
							component = (
								<SemiCheckInput
									{...inputParams}
									/>
							);
							break;
						case 'slider':
							component = (
								<SemiSliderInput
									{...inputParams}
									/>
							);
							break;
						case 'toggle':
							component = (
								<SemiToggleInput
									{...inputParams}
									/>
							);
							break;
						case 'autocomplete':
							component = (
								<SemiAutoComplete
									{...inputParams}
									/>
							);
							break;
						case 'typeahead':
							component = (
								<SemiAutoComplete
									typeahead={true}
									{...inputParams}
									/>
							);
							break;
						case 'uploadbox':
							component = (
								<UploadBox
									{...inputParams}
									/>
							);
							break;
					}

					if(leftIcon) {
						cols.push(
							<Col style={item.style} key={itemId} {...item.grid} {...colParams}>
								<Row>
									<Col xs="36px" noPadding>{leftIcon}</Col>
									<Col xs="calc(100% - 36px)" noPadding>{component}</Col>
								</Row>
							</Col>);
					} else {
						cols.push(<Col style={item.style} key={itemId} {...item.grid} {...colParams}>{component}</Col>);
					}

				} // item
				let rowComponent = (<Row className={rowClassName} style={rowStyle} key={rowId} {...rowProps}>{cols}</Row>);
				components.push(rowComponent);
			} // row
		}

		return <SemiGrid>{components}</SemiGrid>;
	}
}

FormGenerator.propTypes = {
	/**
	 * Better form generation, less code,
	 * and prevent you from having to change every files when a component is change
	 */
	formTemplate: PropTypes.object
};
FormGenerator.contextTypes = {
	getData: PropTypes.func,
	getValue: PropTypes.func
};

export default FormGenerator;