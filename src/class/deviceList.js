import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BackItem from './backItem.js';
import FolderItem from './folderItem.js';
import DeviceItem from './deviceItem.js';

/**
 * propTypes - Setup required properties.
 *
 * @type {{currentSubCategories: (*), historyStack: (*), onChange: (*)}}
 */
const propTypes = {
    currentSubCategories: PropTypes.object.isRequired,
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
        const {currentSubCategories, historyStack} = this.props;

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
                            {Object.keys(currentSubCategories).sort((a,b) => {
                                let textA = a.toUpperCase();
                                let textB = b.toUpperCase();
                                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                            }).map((key, index) =>
                            currentSubCategories[key].name !== undefined
                                ?
                                currentSubCategories[key].children
                                    ?
                                    <FolderItem key={key} name={currentSubCategories[key].name} onItemClick={this.onItemClick.bind(this)} img={currentSubCategories[key].img} />
                                    :
                                    <DeviceItem key={key} name={currentSubCategories[key].name} onItemClick={this.onItemClick.bind(this)} img={currentSubCategories[key].img} />
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