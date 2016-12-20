import React, {PropTypes, Component} from 'react';
import {List, ListItem} from 'material-ui/List';

const menuFilter = (required, permissions) => {
    // todo : filter here
    // console.log('menu', required, permissions);
    if (!required) return true;
    for (let item of required) {
        if (permissions.indexOf(item) !== -1) return true;
    }
    return false;
};

class SideMenu extends Component {
    constructor(props, context) {
        super(props, context);
    }

    linkTo = (pathname) => {
        return this.context.router.push(pathname);
    };

    isActiveMenu = (menuPath, parentPath) => {
        // console.log('props.location.pathname', this.props.location.pathname, menuPath);
        let currentPath = this.props.location.pathname;
        if (menuPath == '/') return currentPath == menuPath;
        let path = parentPath || menuPath;
        let index = currentPath.indexOf(path);
        // Fix `nose` highlighted when currentPath is `nose-...`
        if (index == 0 && currentPath.length > path.length && currentPath[path.length] != '/') {
            return false;
        }
        return index !== -1;
    };

    getMenuItems = (menu, parentMenuItem) => {
        let menuItems = [];
        // todo: originally this.props.user.permissions
        menu.filter(m => menuFilter(m.permissions, [])).map((menuItem, i)=> {
            let nestedItems = [];
            if (menuItem.nestedItems) {
                // recursive get nestedItems
                nestedItems = this.getMenuItems(menuItem.nestedItems, menuItem);
                if (nestedItems.length == 0) return;
            }
            let linkUrl = parentMenuItem ? parentMenuItem.to + menuItem.to : menuItem.to;
            let className = "nav-item";
            if (nestedItems.length > 0) {
                className += " has-child";
            }
            if (parentMenuItem) {
                className += " nav-item-child";
            }
            let isActive = this.isActiveMenu(menuItem.to, menuItem.parentPath);
            // if (isActive) console.log('isActive', menuItem.text);
            menuItems.push((
                <ListItem
                    className={className}
                    key={i}
                    primaryText={menuItem.text}
                    insetChildren={!menuItem.icon}
                    leftIcon={menuItem.icon}
                    onTouchTap={this.linkTo.bind(null, linkUrl)}
                    primaryTogglesNestedList={nestedItems.length > 0}
                    style={isActive?{backgroundColor: 'rgba(0,0,0,0.2)'}:null}
                    nestedItems={nestedItems}
                    initiallyOpen={isActive}
                />
            ));
        });
        if (menuItems.length > 0) return menuItems;
        return [];
    };

    render() {
        let menuItems = this.getMenuItems(this.props.menu);
        // console.log('menuItems', menuItems);
        return (
            <List style={{display: 'table', width: '100%', tableLayout: 'fixed'}}>
                {menuItems}
            </List>
        );
    }
}

SideMenu.propTypes = {
    location: PropTypes.object.isRequired
};

SideMenu.contextTypes = {
    router: PropTypes.object
};

export default SideMenu;