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
    historyStack: PropTypes.object.isRequired,
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
            back = <BackItem onBack={this.onBack.bind(this)} />;
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
                                    <FolderItem key={key} name={grabBagData.currentSubCategories[key].name} handleOnClick={this.onOpen.bind(this)} img={grabBagData.currentSubCategories[key].img} />
                                    :
                                    <DeviceItem key={key} name={grabBagData.currentSubCategories[key].name} handleOnClick={this.onAdd.bind(this)} img={grabBagData.currentSubCategories[key].img} />
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
     * onBack() handles a back item click
     * @param event
     */
    onBack(event) {
        const {onChange} = this.props;

        onChange('currentCategoryName', 'back');
        event.preventDefault();
    }

    /**
     * onOpen() handles a folder item click
     *
     * @param folderName
     * @param event
     */
    onOpen(folderName, event) {
        const {onChange} = this.props;

        onChange('currentCategoryName', folderName);
        event.preventDefault();
    }

    /**
     * onAdd() handles a device item click
     *
     * @param deviceName
     * @param event
     */
    onAdd(deviceName, event) {
        const {onChange} = this.props;

        onChange('currentCategoryName', deviceName);
        if (event !== null)
            event.preventDefault();
    }
}

deviceList.propTypes = propTypes;

export default deviceList;