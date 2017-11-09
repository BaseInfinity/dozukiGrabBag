import React, {Component} from 'react';
import DeviceList from './deviceList.js';
import '../css/deviceListContainer.css';

/**
 * DeviceListContainer is the device list container.  It maintains a history stack and displays the framework around the list.
 */
class DeviceListContainer extends Component {
    /**
     * constructor declares the history stack (just an array) within the object state.
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            historyStack: []
        };
    }

    /**
     * onChange handles the click event when items are clicks on.
     *
     * It decided if it should drill down, drill up or add the item to the grab bag.
     *
     * @param field is the name of the value to update; not used right now.
     * @param value is the name of the list item that was clicked on.
     */
    onChange(field, value) {
        let newCategory = '';
        if ('back' === value) {
            // going up
            let previous = this.state.historyStack.pop();
            if (previous !== null && previous !== undefined) {
                this.props.changeCategory(previous);
                newCategory = previous;
            }
        } else {
            /* only check for add if not 'back' */
            /* only allow to add tips... this is my definition of a 'device'... could use improvement */
            if (!this.props.grabBagData.currentSubCategories[value].children) {
                this.props.addDevice(value);
                return;
            }

            // going down...
            this.state.historyStack.push(this.props.grabBagData.currentCategoryName);
            this.setState({historyStack: this.state.historyStack});
            this.props.changeCategory(value);
            newCategory = value;
        }

        if (newCategory !== '') {
            this.props.updateCurrentSubCategories(newCategory);
        }
    }

    /**
     * render() displays the device list container and the device list.
     *
     * @returns {XML} is the content to render; Using React JSX.
     */
    render() {
        return (
            <div className='dozuki_grabbag_device_list_container'>
                <h3>Browse Devices</h3>
                <DeviceList genListItem={this.props.genListItem} grabBagData={this.props.grabBagData} historyStack={this.state.historyStack} onChange={this.onChange.bind(this)}/>
            </div>
        );
    }
}

export default DeviceListContainer;