import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// import SemiForm from '../src/forms/SemiForm';

let formTemplate = {
    values: {
        test: ''
    },
    components: [
        [
            {
                type: 'text', name: 'test', label: 'Test'
            }
        ]
    ]
};

injectTapEventPlugin();
render(
    <MuiThemeProvider>
        {
            //<SemiForm formTemplate={formTemplate} onSubmit={(data)=>{console.log(data);}} />
        }
    </MuiThemeProvider>, document.getElementById('app')
);