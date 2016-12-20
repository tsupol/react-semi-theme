import React, {Component, PropTypes} from 'react';
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import $ from 'jquery';
import MediaQuery from 'react-responsive';
import Loading from '../widgets/Loading';
import SemiForm from '../forms/SemiForm';
import Panel from '../widgets/Panel';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import IconButton from 'material-ui/IconButton';
import VerticalAlignBottomIcon from 'material-ui/svg-icons/editor/vertical-align-bottom';
import VerticalAlignTopIcon from 'material-ui/svg-icons/editor/vertical-align-top';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SortIcon from 'material-ui/svg-icons/content/sort';
import Divider from 'material-ui/Divider';
import UltimatePaginationMaterialUi from 'react-ultimate-pagination-material-ui';
import helper from '../libs/helper'

const styles = {
    propContainer: {
        width: 200,
        overflow: 'hidden',
        margin: '20px auto 0'
    },
    propToggleHeader: {
        margin: '20px auto 10px'
    }
};
const deviceWidth = {
    all: '(min-width: 0)',
    mobile: '(min-width: 320px) and (max-width: 601px)',
    tablet: '(min-width: 601px) and (max-width: 1200px)',
    laptop: '(min-width: 1200px) and (max-width: 1224px)',
    desktop: '(min-width: 1224px)'
};

class SemiDataTable extends Component {
    constructor(props, context) {
        super(props, context);
        let page = parseInt(props.location ? props.location.query.page || 1 : 1);
        this.state = {
            page,
            data: [],
            total: 0,
            order: null,
            columns: null,
            editable: false,
            filterData: {}
        };
        this.lastDir = 'asc';
        this.handleChangePage = this.handleChangePage.bind(this);
        this.sort = this.sort.bind(this);
        this.filter = this.filter.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleReload = this.handleReload.bind(this);
    }

    componentWillMount() {
        //var loading = setInterval(()=>{
        //console.log('loaded', this.loaded);
        //if(this.loaded) clearInterval(loading);
        let page = parseInt(this.props.location ? this.props.location.query.page || 1 : this.state.page);
        this.handleChangePage(page);
        //}, 1000);

        // You need to run this once, so you can't do this in `render()`
        if (!helper.isEmpty(this.props, 'settings.filters.fields')) {
            this.props.settings.filters.fields.reverse(); // Because float right
        }
    }

    componentDidUpdate() {
        //
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Just easier
        return !helper.deepCompare(this.state, nextState) || !helper.deepCompare(this.props.dataSource, nextProps.dataSource);
        // let {page: nextPage, data: nextData, total: nextTotal, order: nextOrder, columns: nextColumns} = nextState;
        // let {page, data, total, order, columns} = this.state;
        // return JSON.stringify({page: nextPage, data: nextData, total: nextTotal, order: nextOrder, columns: nextColumns}) != JSON.stringify({page, data, total, order, columns}) || (JSON.stringify(nextProps.dataSource)!=JSON.stringify(this.props.dataSource));

    }

	/**
	 * Private: get table row data
     */
    getTableData() {
        return typeof this.props.dataSource == 'object' ? this.props.dataSource : this.state.data;
    }

    onRowSelection = (selectedRows) => {
        let data = this.getTableData();
        this.props.onRowSelection && this.props.onRowSelection(selectedRows, data);
    };

    //shouldComponentUpdate(nextProps, nextState){
    //console.log(nextState.page!==this.state.page, nextState.data!==this.state.data, nextState.total!==this.state.total, nextState.loading!==this.state.loading);
    //console.log(nextState.page!==this.state.page || nextState.data!==this.state.data || nextState.total!==this.state.total || nextState.loading!==this.state.loading);
    //return nextState.page!==this.state.page || nextState.data!==this.state.data || nextState.total!==this.state.total || nextState.loading!==this.state.loading;
    //}
    handleAjaxData(page, options) {
        let p = new Promise((resolve, reject)=> {
            let order = [];
            let columns = [];
            let propOrder = (options && options.order ? options.order : this.props.settings.order || []);
            let propColumns = (options && options.columns ? options.columns : this.props.settings.columns || []);
            for (let i in propOrder) {
                order.push(propOrder[i]);
            }
            for (let i in propColumns) {
                console.log('propColumns[i]', propColumns[i]);
                if (!helper.isEmpty(propColumns[i]['search'])) {
                    if (typeof propColumns[i]['search'].getMonth === 'function') {
                        propColumns[i]['search'] = propColumns[i]['search'].toMysqlDateFormat();
                    }
                    columns.push(propColumns[i]);
                }
            }
            let params = {
                start: encodeURIComponent(JSON.stringify(options.offset || (page - 1) * (options.limit || this.props.settings.limit || 10))),
                length: encodeURIComponent(JSON.stringify(options.limit || this.props.settings.limit || 10)),
                order: JSON.stringify(order),
                columns: JSON.stringify(columns)
            };
            //console.log('params', params, options);
            let data = [];
            for (let i in params) {
                if (i == 'length' && this.props.settings.limit == false) {
                } else {
                    data.push(i + '=' + params[i])
                }
            }
            this.context.ajax.call('get', `${this.props.dataSource}?${data.join('&')}`, null).then(res=> {
                let r = this.props.dataSourceResult; // root data field name by return from ajax ex. {result:{data: [], total: 0}} * "result" is root in this case
                let data = {
                    data: res[r] ? res[r][this.props.dataSourceMap && this.props.dataSourceMap.data ? this.props.dataSourceMap.data : 'data'] : [], // data field name by return from ajax (default is set to "data")
                    total: res[r] ? res[r][this.props.dataSourceMap && this.props.dataSourceMap.total ? this.props.dataSourceMap.total : 'total'] : 0, // total field name by return from ajax (default is set to "data")
                    canEdit: res[r] ? res[r].canEdit : false,
                    filterData: res[r] ? res[r].filterData : {}
                };
                resolve(data);
            }).catch(err=> {
                // Don't forget to display the error
                this.context.dialog.alert(err, 'DataTable Error!');
                reject(err);
            });
        });
        p.then((result)=> {
            let pathname = this.props.pathname || this.props.location && this.props.location.pathname;
            let order = options && options.order ? options.order.map((field)=>[field.column, field.dir].join(':')).join(',') : null;
            let columns = options && options.columns ? options.columns.map((field)=>[field.data, field.search].join(':')).join(',') : null;
            this.load = setInterval(()=> {
                if (this.refs.table) {
                    clearInterval(this.load);
                    this.setState({
                        page,
                        data: result.data,
                        total: result.total,
                        editable: result.canEdit,
                        filterData: result.filterData,
                        order,
                        columns
                    });
                    // fix: MUI Dialog incorrectly positioned
                    window.dispatchEvent(new Event('resize'));
                }
            }, 50);
            let query = order ? {page, order} : {page};
            pathname && this.context.router.push({pathname, query});
        });
    }

    handleChangePage(page, options) {
        if (typeof this.props.dataSource == 'object') {
            let order = pathname && options && options.order ? options.order.map((field)=>[field.column, field.dir].join(':')).join(',') : null;
            let columns = pathname && options && options.columns ? options.columns.map((field)=>[field.data, field.search].join(':')).join(',') : null;
            this.setState({page, order, columns});
            let pathname = this.props.pathname || this.props.location && this.props.location.pathname;
            pathname && this.context.router.push({pathname, query: {page}});
        } else {
            let order = this.state.order ? this.state.order.split(',').map((field)=> {
                let f = field.split(':');
                return {
                    column: f[0],
                    dir: f[1]
                }
            }) : [];
            let columns = this.state.columns ? this.state.columns.split(',').map((field)=> {
                let f = field.split(':');
                return {
                    data: f[0],
                    search: f[1]
                }
            }) : [];
            if (options && options.order && options.order.length > 0) {
                for (let i in options.order) {
                    let index = order.map((o)=>o.column).indexOf(options.order[i].column);
                    if (index != -1) { // 219-229 for loop a single column order direction (none -> asc -> desc -> none)
                        let shouldResetDir = false;
                        if (order[index].dir == 'desc') shouldResetDir = true;
                        order.splice(index, 1);
                        if (!shouldResetDir) {
                            order.unshift(options.order[i]);
                        }
                    } else {
                        order.push(options.order[i]);
                    }
                }
            } else if (options && options.order && options.order.length == 0) {
                order = [];
            }
            if (options && options.columns && options.columns.length > 0) {
                for (let i in options.columns) {
                    if (columns.map((c)=>c.data).indexOf(options.columns[i].data) != -1) {
                        columns = columns.map((c)=> {
                            return c.data == options.columns[i].data ? Object.assign(c, options.columns[i]) : c;
                        });
                    } else {
                        columns.push(options.columns[i]);
                    }
                }
            } else if (options && options.columns && options.columns.length == 0) {
                columns = [];
            }
            options = Object.assign({}, options, {order, columns});
            this.handleAjaxData(page, options);
        }
    }

    sort(field) {
        if (field.sortable) {
            let key = typeof field.key == 'object' ? field.key.map((k)=>k + ':asc').join(',') : field.key + ':asc';
            let re = new RegExp(key, 'gi');
            let order = this.props.location ? this.props.location.query.order : this.state.order;
            let dir = (order && order.match(re) ? 'desc' : 'asc') || 'asc';
            let limit = this.props.settings.limit !== undefined ? this.props.settings.limit : 10;
            let newOrder = typeof field.key == 'object' ? field.key.map((k)=> {
                return {column: k, dir}
            }) : [{column: field.key, dir}];
            let options = {
                order: this.props.pagination || limit == false ? newOrder : [{column: 'id', dir}]/*,
                 offset: this.props.pagination ? 0 : (dir=='asc' ? 0 : this.state.total-limit)*/
            };
            //console.log('sort');
            this.handleChangePage(1, options);
        }
    }

    /*
     filter(field, event, search) {
     let columns = typeof field.key == 'object' ? field.key.map((k)=> {
     return {data: k, search}
     }) : [{data: field.key, search}];
     let options = {columns};
     this.handleChangePage(1, options);
     }
     */
    filter(data) {
        let columns = [];
        for (let i in data) {
            columns.push({data: i, search: data[i]});
        }
        let options = {columns};
        this.handleChangePage(1, options);
    }

    handleCreate() {
        console.log('on create: SemiDataTable');
        // Recommend this approach
        helper.execute(this.props, 'settings.actions.create.onClick');
        // ex. for passing parameters
        // helper.execute(this.props, 'settings.actions.create.onClick', param1, param2);
        // this.props.settings.actions&&this.props.settings.actions.create&&this.props.settings.actions.create.onClick&&this.props.settings.actions.create.onClick();
    }

    handleReload() {
        console.log('on reload: SemiDataTable');
        this.handleChangePage(1, {order: [], columns: []});
        this.props.settings.actions && this.props.settings.actions.reload && this.props.settings.actions.reload.onClick && this.props.settings.actions.reload.onClick();
    }

    goToPage(page) {
        this.handleChangePage(page);
    }

    render() {
        let order = this.state.order ? this.state.order.split(',').map((field)=> {
            let f = field.split(':');
            return {
                column: f[0],
                dir: f[1]
            }
        }) : null;
        // console.log('render', this.state);
        // todo: try to group settings
        let {
            actions, // Buttons
            fields, // Column
            filters, // Built-in SemiForm filters todo: external SemiForm
            limit, // How many to show and AJAX fetch limit
            ...rest
        } = this.props.settings;

        let settings = Object.assign({}, {
            // Default
            showCheckboxes: false,
            enableSelectAll: false
        }, rest, {
            // Override
        });

        limit = limit == false ? false : limit || 10; // 333 - 345 for calculate a pagination
        const offset = limit == false ? 0 : (this.state.page - 1) * limit;
        let data = this.getTableData();
        let total = typeof this.props.dataSource == 'object' ? this.props.dataSource.length : this.state.total;
        if (!fields || fields.length == 0) {
            fields = [];
            for (let i in data) for (let j in data[i]) if (fields.indexOf(j) == -1) fields.push(j);
        }
        let pages = [];
        let max_page = limit == false ? 1 : Math.ceil(total / limit);
        for (let i = 1; i <= max_page; i++) {
            pages.push(i);
        }
        let rows = data.map((row, index)=> { // 346 - 358 map data for check if any column is set to be custom or not
            let obj = {};
            for (let i in fields) {
                let key = fields[i];
                if (typeof key == "string") obj[key] = row[key];
                else if (typeof key == "object") {
                    if (key.key) obj[key.key] = row[key.key];
                    if (key.custom) obj[key.key] = key.custom(row, index, {editable: this.state.editable}, this.props);
                    if (key.tooltip) fields[i].tooltip = key.tooltip;
                }
            }
            return obj;
        });
        if (typeof this.props.dataSource == 'object' && limit != false) { // 359 - 361 chunk data if limit is set to true and data is Object because if is ajax, data will be set before received
            rows = rows.slice(offset, offset + limit);
        }
        let showCreateBtn = actions && actions.create != undefined ? actions.create : false; // 362 - 363 set default value to Create & Reload button to false
        let showReloadBtn = actions && actions.reload != undefined ? actions.reload : false;

        // ----- Buttons
        let headerButtons = [];
        let buttonsKey = 99; // must have unique key, so...
        // 1. Default Buttons
        if (actions) {
            if (showCreateBtn && actions.create) {
                headerButtons.push((
                    <div key={++buttonsKey}>
                        <FloatingActionButton secondary={true} zDepth={1}
                                              style={Object.assign({marginLeft: 8}, actions.create.style)}
                                              onTouchTap={this.handleCreate}>
                            <ContentAdd />
                        </FloatingActionButton>
                        {actions.create.label ? <div className="dt-right-btn-label">{actions.create.label}</div> : null}
                    </div>
                ));
            }
            if (showReloadBtn && actions.reload) {
                headerButtons.push((
                    <FloatingActionButton key={++buttonsKey} mini={true} zDepth={1}
                                          style={Object.assign({marginRight: 10}, actions.reload.style)}
                                          onTouchTap={this.handleReload}>
                        <NavigationRefresh />
                    </FloatingActionButton>
                ));
            }
        }
        // 2. Custom Buttons
        for (let i in actions || []) {
            if (actions[i] && !i.match(/create/gi) && !i.match(/reload/gi)) {
                if (actions[i].props) {
                    headerButtons.push(React.cloneElement(actions[i], {key: i}));
                } else {
                    headerButtons.push(<FlatButton key={i} label={actions[i].label||i} onTouchTap={actions[i].onClick}
                                                   style={actions[i].style}/>)
                }
            }
        }

        // ----- Filters
        let filterBox = null;
        if (!helper.isEmpty(filters, 'fields')) {
            let values = {};
            for (let i in filters.fields) {
                let filter = filters.fields[i];
                values[filter.name] = filter.value || '';
                if (typeof filter.options == 'string' && this.state.filterData[filter.options]) {
                    console.log('this.state.filterData', this.state.filterData);
                    filter.options = this.state.filterData[filter.options];
                }
            }
            // todo: more dynamic width
            let filterWrapWidth = headerButtons.length == 0 ? '100%' : '80%';
            filterBox =
                <div className="dt-filter-wrap" style={{width: filterWrapWidth}}>
                    <SemiForm submitLabel="Filter" formTemplate={{values, components: [filters.fields]}}
                              onSubmit={this.filter} isFilterForm={true}/>
                </div>;
        }

        return (
            <div className="dt-wrap">
                <div className="dt-header-wrap">
                    {headerButtons.length > 0 ? (
                        <div className="dt-button-wrap">
                            {headerButtons}
                        </div>
                    ) : null}
                    {filterBox}
                    <Divider className="dt-header-divider"/>
                </div>
                <Paper zDepth={0} className="dt-table-wrap">
                    <div className="header-border-fix"></div>
                    <Table
                        ref='table'
                        {...rest}
                        onRowSelection={this.onRowSelection}
                    >
                        <TableHeader
                            displaySelectAll={!!settings.showCheckboxes}
                            adjustForCheckbox={!!settings.showCheckboxes}
                            enableSelectAll={!!settings.enableSelectAll}
                        >
                            {/*
                             <TableRow>
                             <TableHeaderColumn colSpan={Object.keys(fields).length} tooltip="Super Header" style={{textAlign: 'center'}}>
                             Super Header
                             </TableHeaderColumn>
                             </TableRow>
                             */}
                            <TableRow>
                                {fields.map((field, i)=> { // 456 - 487 is about icon & responsive device(using MediaQuery)
                                    let isOrder = order && order.filter((o)=>o.column == field.key);
                                    let sortable = isOrder && isOrder.length > 0;
                                    let dynamicIcon = React.cloneElement(sortable ? (isOrder[0].dir.match(/asc/gi) ?
                                        <VerticalAlignTopIcon /> : <VerticalAlignBottomIcon /> ) : <SortIcon />, {
                                        style: {
                                            verticalAlign: 'middle',
                                            marginRight: '10px'
                                        },
                                        color: '#999'
                                    });
                                    let display = field.display || 'all';
                                    let query = null;
                                    if (typeof display == 'string') {
                                        query = deviceWidth[display] == undefined ? display : deviceWidth[display];
                                    } else {
                                        query = display.map((d)=>deviceWidth[d] == undefined ? d : deviceWidth[d]);
                                    }
                                    return (
                                        <MediaQuery query={query} key={i}>
                                            <TableHeaderColumn tooltip={
                                        (field.tooltip||field.title)}
                                                               style={Object.assign({}, field.style, {width: field.width, cursor: field.sortable ? 'pointer' : 'auto'})}
                                                               onTouchTap={field.sortable && this.sort.bind(null,field)}>
                                                <div>
                                                    {field.sortable ? dynamicIcon : null}
                                                    {field.title}
                                                </div>
                                            </TableHeaderColumn>
                                        </MediaQuery>
                                    )
                                })}
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={!!settings.showCheckboxes}
                        >
                            {rows.length ? rows.map((row, index) => (
                                <TableRow key={index} selected={row.selected}>
                                    {fields.map((field, i)=> { // 495 - 509 is about responsive device(using MediaQuery)
                                        let display = field.display || 'all';
                                        let query = null;
                                        if (typeof display == 'string') {
                                            query = deviceWidth[display] == undefined ? display : deviceWidth[display];
                                        } else {
                                            query = display.map((d)=>deviceWidth[d] == undefined ? d : deviceWidth[d]);
                                        }
                                        return (
                                            <MediaQuery query={query} key={i}>
                                                <TableRowColumn
                                                    style={Object.assign({}, field.style, {width: field.width})}>{typeof row[field.key] == 'boolean' ? row[field.key].toString() : row[field.key]}</TableRowColumn>
                                            </MediaQuery>
                                        )
                                    })}
                                </TableRow>
                            )) : <TableRow><TableRowColumn style={{textAlign: 'center'}}>{this.load ? `No data` :
                                <Loading inline/>}</TableRowColumn></TableRow>}
                        </TableBody>
                    </Table>
                </Paper>
                <div
                    style={{display: this.props.pagination==true?'inline-block':'none', textAlign: 'right', width: '100%'}}
                    className="dt-pagination">
                    <UltimatePaginationMaterialUi currentPage={this.state.page} totalPages={max_page}
                                                  onChange={this.handleChangePage}/>
                </div>
            </div>
        );
    }
}

SemiDataTable.propTypes = {};
SemiDataTable.contextTypes = {
    router: PropTypes.object,
    helper: PropTypes.object,
    ajax: PropTypes.object,
    dialog: PropTypes.object
};
export default SemiDataTable;