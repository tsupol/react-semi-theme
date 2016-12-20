/* eslint-disable import/default */
import React, {Component, PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SemiForm from '../forms/SemiForm';

class SemiModal extends Component {
	static propTypes = {
		/**
		 * Controls whether the Dialog is opened or not.
		 * It is recommended to use `open` function instead to avoid using `setState`.
		 */
		open: PropTypes.bool,
		/**
		 * Set to `true` for modal that opened by react-router
		 */
		alwaysOpen: PropTypes.bool,
		/**
		 * Set to `true` if you want to hide submit button
		 */
		hideSubmitButton: PropTypes.bool,
		/**
		 * Fired whenever the modal is closed.
		 */
		onClose: PropTypes.func,
		/**
		 * Usually used for fetching data from server. Only fired when SemiForm is `Mounted`.
		 *
		 * Must return a promise (by using it's `ajax` parameter).
		 *
		 * @param {promise} ajax Used to call `getAll`
		 */
		onLoad: PropTypes.func,
		/**
		 * Usually used for fetching data from server. Only fired when SemiForm is `Mounted`.
		 *
		 * Must return a promise (by using it's `ajax` parameter).
		 *
		 * @param {promise} data Form data from SemiForm merged with externalData passed with `open` function.
		 * @param {promise} ajax to send data to server
		 */
		onSubmit: PropTypes.func
	};

	constructor(props, context) {
		super(props, context);
		this.state = {
			canSubmit: false,
			open: props.alwaysOpen ? true : props.open || false
		};
	}

	onValid = () => {
		if (this.state.canSubmit === true) return;
		this.setState({canSubmit: true});
	};

	onInvalid = () => {
		if (this.state.canSubmit === false) return;
		this.setState({canSubmit: false});
	};

	/**
	 * Public: force enable submit button
	 */
	forceEnableSubmit = () => {
		if (this.state.canSubmit === true) return;
		this.setState({canSubmit: true});
	};
	
	/**
	 * Public: force disable submit button
	 */
	forceDisableSubmit = () => {
		if (this.state.canSubmit === false) return;
		this.setState({canSubmit: false});
	};

	// todo: delete this
	// submitCallback = (data) => {
	//     if(this.props.submitCallback) {
	//         // Close the dialog only when the callback returns true
	//         if(this.props.submitCallback(data)) this.close();
	//     } else {
	//         this.close();
	//     }
	// };

	onLoad = (ajax) => {
		if (this.props.onLoad) return this.props.onLoad(ajax);
	};

	/**
	 * Private: SemiForm's onSubmit
	 *
	 * Merges modal's externalData with SemiForm's data
	 * see `onSubmit` function of `SemiForm` for more details
	 *
	 * @param {object} data
	 * @param {Row} ajax
	 */
	onModalSubmit = (data, ajax) => {
		console.log('modal: ajax', ajax);
		// if (typeof ajax === 'function') return; // unknown bug fix, try removing this and console.log(ajax) to see the bug
		if (this.props.onSubmit) {
			let promise = this.props.onSubmit(Object.assign({}, data, this.state.externalData), this.context.ajax, this.context.dialog);
			// let promise = this.props.onSubmit(Object.assign({}, data, this.state.externalData), ajax, this.context.dialog);
			if (promise) {
				return promise.then(response => {
					this.close();
					return response;
				}).catch(error => {
					// console.log('error', error);
					// todo: error handling
					throw error; // to .catch SemiForm
				});
			} else {
				this.close();
			}

		}
	};

	/**
	 * Public: Open the modal
	 *
	 * Recommended more than using props.open with state
	 *
	 * @param {object} externalData (optional) To pass data to `onSubmit` callback to avoid using `setState`
	 * @param {object} modalComponent (optional) formTemplate or reactElement/Component. Overrides `props.formTemplate`
	 */
	open = (externalData, modalComponent) => {
		this.setState({open: true, externalData, modalComponent});
		// fix: Dialog incorrectly positioned (DataTable)
		// Note: move fix to SemiDataTable (search for: window.dispatchEvent(new Event('resize'));)
		// let counter = 0;
		// let interval = setInterval(()=>{
		// 	window.dispatchEvent(new Event('resize'));
		// 	if(++counter >= 3) {
		// 		clearInterval(interval);
		// 	}
		// }, 750);
	};

	/**
	 * Public: Triggered when modal is closed by any mean.
	 */
	close = () => {
		if (this.props.alwaysOpen) {
			if (this.props.onClose) this.props.onClose();
			this.setState({open: false});
			setTimeout(()=> {
				this.context.router.goBack();
			}, 250);
		} else {
			if (this.props.onClose) this.props.onClose();
			this.setState({open: false});
		}
	};

	/**
	 * Public: To submit `SemiForm` using ref
	 */
	clickSubmit = () => {
		this.refs.form && this.refs.form.submit();
	};

	/**
	 * Private: Trigger SemiForm's onSubmit
	 * If no SemiForm, triggers caller's onSubmit
	 */
	handleSubmit = () => {
		if(!this.refs.form && this.props.onSubmit) {
			this.props.onSubmit();
		}
		this.clickSubmit();
	};

	render() {
		// console.log('render: modal', this.state.open);
		let props = this.props,
			state = this.state;

		let {
			children,
			// SemiForm
			formTemplate,
			onSubmit,
			onLoad,
			// Dialog Settings
			...rest
		} = props;

		let settings = Object.assign({}, {
			// Default
			// Custom
			submitLabel: 'Submit',
			cancelLabel: 'Cancel',
			/**
			 * Force SemiModal to show Submit button even not having formTemplate
			 */
			isFormModal: false
		}, rest, {
			// Override
		});

		const actions = ((state.modalComponent && state.modalComponent.components) || props.formTemplate || settings.isFormModal) && !props.hideSubmitButton ? [
			<FlatButton
				key={1}
				label={settings.cancelLabel}
				primary={true}
				onTouchTap={this.close}
			/>,
			<FlatButton
				key={2}
				label={settings.submitLabel}
				primary={true}
				keyboardFocused={true}
				onTouchTap={this.handleSubmit}
				disabled={!this.state.canSubmit}
				type="submit"
			/>
		] : [
			<FlatButton
				key={1}
				label="Close"
				primary={true}
				onTouchTap={this.close}
			/>
		];

		let modalComponent = state.modalComponent || formTemplate || children;
		let realChildren = null;
		// Is formTemplate?
		if (modalComponent) {
			if (modalComponent.components) { // because Semiform has .components
				realChildren = <SemiForm
					ref="form"
					noButton
					onValid={this.onValid}
					onInvalid={this.onInvalid}
					onLoad={onLoad? this.onLoad : null} // Why doing this? Because this makes SemiForm manage promise easier...
					onSubmit={onSubmit? this.onModalSubmit : null} // ... by not create `promise` in the first place
					formTemplate={modalComponent}
				/>;
			} else {
				realChildren = modalComponent;
			}
		}

		return (
			<div>
				<Dialog
					title={props.title}
					actions={actions}
					modal={true}
					open={this.state.open}
					onRequestClose={this.close}
					autoScrollBodyContent={true}
					{...rest}
				>
					{realChildren}
				</Dialog>
			</div>
		);
	}
}

SemiModal.contextTypes = {
	ajax: PropTypes.object,
	router: PropTypes.object.isRequired,
	dialog: PropTypes.object
};

export default SemiModal;


