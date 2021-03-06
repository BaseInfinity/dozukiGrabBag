import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BackItem from './backItem.js';
import DeviceItem from './deviceItem.js';

/**
 * propTypes - Setup required properties.
 *
 * @type {{currentSubCategories: (*), historyStack: (*), onChange: (*)}}
 */
const propTypes = {
    currentSubCategories: PropTypes.object.isRequired,
    historyStack: PropTypes.array.isRequired,
    onBack: PropTypes.func.isRequired,
    onItemAdd: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    deviceListMessage: PropTypes.string.isRequired
};

/**
 * deviceList displays the entire catalog of devices by level; supports navigation through levels, including 'back'.
 */
class deviceList extends Component {
    /**
     * render() generates the current child items. (folders and devices)
     *
     * @returns {XML} is the content to render; Using React JSX.
     */
    render() {
        const {currentSubCategories, historyStack, deviceListMessage, onBack, onItemAdd} = this.props;

        let back = null;
        if (historyStack.length) {
            back = <BackItem onItemClick={onBack} />;
        }

        let noDevices = '';
        if (Object.keys(currentSubCategories).length === 0 && currentSubCategories.constructor === Object) {
            noDevices = <p>{deviceListMessage}</p>;
        }

        return (
            <div className='dozuki_grabbag_device_list'>
                <section className='dozuki_grabbag_device_list_section'>
                    <div className="dozuki_grabbag_items_container">
                        {back}
                        {noDevices}
                        {Object.keys(currentSubCategories).sort((a,b) => {
                            let textA = a.toUpperCase();
                            let textB = b.toUpperCase();
                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        }).map((key, index) =>
                        currentSubCategories[key]['details'] !== undefined
                            ?
                                <DeviceItem key={key} name={key} onItemAdd={onItemAdd} onItemClick={this.onItemClick.bind(this)} img={currentSubCategories[key].details.image.thumbnail} childCount={currentSubCategories[key].details.children.length} guideCount={currentSubCategories[key].details.guides.length} />
                            :
                                null
                        )}
                    </div>
                </section>
            </div>
        );
    }

    /**
     * onItemClick() handles a device list item click
     *
     * @param name {string} is the name of the item that was clicked
     */
    onItemClick(name) {
        const {onChange} = this.props;

        onChange(name);
    }
}

deviceList.propTypes = propTypes;

export default deviceList;