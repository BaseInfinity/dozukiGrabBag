import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BackItem from './backItem.js';
import FolderItem from './folderItem.js';
import DeviceItem from './deviceItem.js';

/**
 * propTypes - Setup required properties.
 *
 * @type {{grabBagData: (*), onOpen: (*)}}
 */
const propTypes = {
    grabBagData: PropTypes.object.isRequired,
    historyStack: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
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
        const {grabBagData, historyStack} = this.props;

        let back = <div />;
        if (historyStack.length) {
            back = <BackItem onItemClick={this.onItemClick.bind(this)} />;
        }

        return (
            <div className='dozuki_grabbag_device_list'>
                <section className='dozuki_grabbag_device_list_section'>
                    <div className="row" role="row">
                        <div className="container-fluid">
                            {back}
                            {Object.keys(grabBagData.currentSubCategories).map((key, index) =>
                            grabBagData.currentSubCategories[key].name !== undefined
                                ?
                                grabBagData.currentSubCategories[key].children
                                    ?
                                    <FolderItem key={key} name={grabBagData.currentSubCategories[key].name} onItemClick={this.onItemClick.bind(this)} img={grabBagData.currentSubCategories[key].img} />
                                    :
                                    <DeviceItem key={key} name={grabBagData.currentSubCategories[key].name} onItemClick={this.onItemClick.bind(this)} img={grabBagData.currentSubCategories[key].img} />
                                :
                                <span key={key} />
                            )}
                        </div>
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