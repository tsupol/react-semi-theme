import React, {PropTypes, Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Form} from 'formsy-react';
import ReactDOM from 'react-dom';
import Loading from '../widgets/Loading';
import FormGenerator from './FormGenerator';
import helper from './../libs/helper';

class SemiForm extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			canSubmit: false,
			ready: props.onLoad ? false : true, // for loading spinner
			// For formTemplate
			values: props.values || {},
			data: props.data || {}
		};
	}

	getChildContext() {
		return {
			getValue: (name) => {
				return helper.get(this.state, 'values.' + name);
			},
			getData: (name) => { // Mostly options array
				return helper.get(this.state, 'data.' + name);
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		// for formTemplate
		this.setState({
			values: nextProps.values || {},
			data: nextProps.data || {}
		});
	}

	componentDidMount() {
		// Show loading when fetching server data
		// Prevent the form from rendering when not having enough data (important!)
		if (this.props.onLoad) {
			this.props.onLoad(this.context.ajax).then((/*data*/) => {
				this.setState({ready: true})
			});
		}
	}

	// Formsy's
	enableButton = () => {
		if (this.state.canSubmit === true) return;
		this.setState({
			canSubmit: true
		});
	};

	// Formsy's
	disableButton = () => {
		if (this.state.canSubmit === false) return;
		this.setState({
			canSubmit: false
		});
	};

	/**
	 * Private: Handle submit
	 */
	onFormSubmit = (data, error, event) => {
		if (this.props.onSubmit) {
			let promise = this.props.onSubmit(data, this.context.ajax);
			if (promise) {
				return promise.then(response => {
					// todo: submit loading here...
				}).catch(error => {
					// I find it better not forcing alert on error.
					// this.context.dialog.alert(error, 'Error!');
				});
			}
		}
	};

	// From Formsy. Do nothing for now.
	notifyFormError = (data) => {
	};

	/**
	 * Public: To submit `SemiForm` using ref
	 */
	submit = () => {
		ReactDOM.findDOMNode(this.refs.submitBtn).click();
	};

	/**
	 * Public: Reset form to original state (not clear everything)
	 */
	resetForm = () => {
		this.refs.form.reset();
	};

	handleFormChange = (currentValues, isChanged) => {
		if (this.props.onChange) this.props.onChange(currentValues, isChanged);
	};

	render() {
		// console.log('render: form', this.state.ready);
		let props = this.props;
		let {children, formTemplate, extraButtons, ...rest} = props;

		let settings = Object.assign({}, {
			// Default
			// todo: remove this
			// buttonRight: true,
			buttonAlign: 'right',
			noButton: false,
			noSubmitButton: false,
			hasReset: false,
			compact: false,
			isFilterForm: false,
			submitLabel: 'Submit'
		}, rest, {
			// Override
			eventRender: this.eventRender,
			dayClick: this.dayClick,
			loading: this.loading
		});

		// --- Buttons
		let resetBtn = settings.hasReset && !settings.noButton ? (
			<RaisedButton
				label="Reset"
				style={{marginTop: 24, marginLeft: 24}}
				onClick={this.resetForm}
			/>
		) : null;

		let submitBtn = settings.noSubmitButton || settings.noButton ? null : (
			<RaisedButton
				formNoValidate
				primary={settings.isFilterForm}
				secondary={!settings.isFilterForm}
				style={{marginTop: 24}}
				type="submit"
				label={settings.submitLabel}
				disabled={!this.state.canSubmit}
			/>);

		extraButtons = extraButtons && extraButtons.length && extraButtons.map((btn, key)=>React.cloneElement(btn, {key}));
		let buttonsAlign = settings.buttonAlign;
		let buttons = <div className="btn-wrap"
						   style={{textAlign: buttonsAlign}}>{submitBtn} {resetBtn} {extraButtons}</div>;

		// SemiForm classes for controlling with CSS (Inline style is a pain!)
		let formClass = 'sf-wrap';
		// if (settings.buttonRight) formClass += ' btn-right';
		if (settings.compact) formClass += ' compact';
		if (settings.isFilterForm) formClass += ' filter-form';

		let formChildren = (this.state.ready) ?
			(formTemplate) ? <FormGenerator formTemplate={formTemplate}/> : children : <Loading inline/>;

		// todo: fix unknown props here...
		let {buttonAlign, noSubmitButton, submitLabel, isFilterForm, ...formParams} = rest;

		return (
			<Form
				className={`${formClass}`}
				onSubmit={this.onFormSubmit}
				onInvalid={this.disableButton}
				onValid={this.enableButton}
				onInvalidSubmit={this.notifyFormError}
				onChange={this.handleFormChange}
				ref="form"
				{...formParams}
			>
				{formChildren}
				{buttons}
				<button style={{display:'none'}} ref="submitBtn" type="submit">Submit</button>
			</Form>);
	}
}

SemiForm.propTypes = {
	/**
	 * Shows reset buttons
	 * Reset is not clear everything but resetting to it's original state
	 */
	hasReset: PropTypes.bool,
	/**
	 * Usually used for fetching data from server. Only fired when SemiForm is `Mounted`.
	 * Must return a promise (by using it's `ajax` parameter).
	 *
	 * @param {promise} ajax Used to call `getAll`
	 */
	onLoad: PropTypes.func,
	/**
	 * Better form generation, less code,
	 * and prevent you from having to change every files when a component is change
	 */
	formTemplate: PropTypes.object,
	/**
	 * Default to `Submit`
	 */
	submitLabel: PropTypes.string,
	/** @ignore */
	enableButton: PropTypes.func,
	/** @ignore */
	disableButton: PropTypes.func,
	/** @ignore */
	notifyFormError: PropTypes.func,
	/**
	 * If `formTemplate` is used `children` will be ignored
	 */
	children: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array
	]),
	/**
	 * Hide only submit button
	 */
	noSubmitButton: PropTypes.bool,
	/**
	 * Hide all buttons
	 */
	noButton: PropTypes.bool
};
SemiForm.contextTypes = {
	ajax: PropTypes.object,
	dialog: PropTypes.object
};
SemiForm.childContextTypes = {
	getData: PropTypes.func,
	getValue: PropTypes.func
};

export default SemiForm;