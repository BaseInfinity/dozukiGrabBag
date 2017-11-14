import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DeviceList from './deviceList.js';
import '../css/deviceListContainer.css';

/**
 * These are strings use in the UI.  Candidates for being provided by a language system.
 *
 * @type {string}
 */
const STRING_DEVICELIST_TITLE  = 'Browse Devices';

/**
 * propTypes - Setup required properties.
 *
 * @type {{currentCategoryName: (*), currentSubCategories: (*), addDevice: (*), changeCategory: (*), deviceListMessage: (*)}}
 */
const propTypes = {
    currentCategoryName: PropTypes.string.isRequired,
    currentSubCategories: PropTypes.object.isRequired,
    addDevice: PropTypes.func.isRequired,
    changeCategory: PropTypes.func.isRequired,
    deviceListMessage: PropTypes.string.isRequired
};

/**
 * DeviceListContainer is the device list container.  It maintains a history stack and displays the framework around the list.
 */
class deviceListContainer extends Component {
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
     * render() generates the device list container HTML, including the device list.
     *
     * @returns {XML} is the content to render; Using React JSX.
     */
    render() {
        const {currentSubCategories, deviceListMessage} = this.props;
        const {historyStack}         = this.state;

        return (
            <div className='dozuki_grabbag_device_list_container'>
                <h3>{STRING_DEVICELIST_TITLE}</h3>
                <DeviceList currentSubCategories={currentSubCategories} historyStack={historyStack} deviceListMessage={deviceListMessage}
                            onBack={this.onBack.bind(this)}
                            onItemAdd={this.onItemAdd.bind(this)}
                            onChange={this.onChange.bind(this)}/>
            </div>
        );
    }

    onBack() {
        const {historyStack}   = this.state;
        const {changeCategory} = this.props;

        let previous = historyStack.pop();
        if (previous !== null && previous !== undefined) {
            changeCategory(previous, historyStack);
        }
    }

    onItemAdd(item) {
        const {addDevice} = this.props;

        addDevice(item);
    }

    /**
     * onChange handles the click event when items are clicks on.
     *
     * It decided if it should drill down, drill up or add the item to the grab bag.
     *
     * @param value is the name of the list item that was clicked on.
     */
    onChange(value) {
        const {currentCategoryName, changeCategory, currentSubCategories} = this.props;
        const {historyStack} = this.state;

        if (currentSubCategories[value].details.children.length) {        // to child
            historyStack.push(currentCategoryName);
            changeCategory(value, historyStack);
        }
    }
}

deviceListContainer.propTypes = propTypes;

export default deviceListContainer;