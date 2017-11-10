import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DeviceList from './deviceList.js';
import '../css/deviceListContainer.css';

/**
 * propTypes - Setup required properties.
 *
 * @type {{grabBagData: (*), addDevice: (*), changeCategory: (*), updateCurrentSubCategories: (*)}}
 */
const propTypes = {
    grabBagData: PropTypes.object.isRequired,
    addDevice: PropTypes.func.isRequired,
    changeCategory: PropTypes.func.isRequired,
    updateCurrentSubCategories: PropTypes.func.isRequired
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
        const {grabBagData} = this.props;
        const {historyStack} = this.state;

        return (
            <div className='dozuki_grabbag_device_list_container'>
                <h3>Browse Devices</h3>
                <DeviceList grabBagData={grabBagData} historyStack={historyStack} onChange={this.onChange.bind(this)}/>
            </div>
        );
    }

    /**
     * onChange handles the click event when items are clicks on.
     *
     * It decided if it should drill down, drill up or add the item to the grab bag.
     *
     * @param value is the name of the list item that was clicked on.
     */
    onChange(value) {
        const {grabBagData, addDevice, changeCategory, updateCurrentSubCategories} = this.props;
        const {historyStack} = this.state;

        let newCategory = '';
        if ('back' === value) {
            // to parent
            let previous = historyStack.pop();
            if (previous !== null && previous !== undefined) {
                changeCategory(previous);
                newCategory = previous;
            }
        } else {
             // only check for add if not 'back'
             // only allow to add tips... this is my definition of a 'device'... could use improvement
            if (!grabBagData.currentSubCategories[value].children) {
                addDevice(value);
                return;
            }

            // to child
            historyStack.push(grabBagData.currentCategoryName);
            this.setState({historyStack: historyStack});
            changeCategory(value);
            newCategory = value;
        }

        if (newCategory !== '') {
            updateCurrentSubCategories(newCategory);
        }
    }
}

deviceListContainer.propTypes = propTypes;

export default deviceListContainer;