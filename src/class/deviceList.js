import React, {Component} from 'react';
import BackItem from './backItem.js';
import FolderItem from './folderItem.js';
import DeviceItem from './deviceItem.js';

/**
 * deviceList displays the entire catalog of devices by level; supports navigation through levels, including 'back'.
 */
class deviceList extends Component {

    /**
     * render displays the current category's items.
     *
     * The grabBagContainer.genListItem() method is used for item layout.
     *
     * @returns {XML} is the content to render; Using React JSX.
     */
    render() {
        let back = <div />;

        if (this.props.historyStack.length) {
            back = <BackItem onBack={this.onBack.bind(this)} />;
        }

        return (
            <div className='dozuki_grabbag_device_list'>
                <section className='dozuki_grabbag_device_list_section'>
                    <div className="row" role="row">
                        <div className="container-fluid">
                            {back}
                            {Object.keys(this.props.grabBagData.currentSubCategories).map((key, index) =>
                            this.props.grabBagData.currentSubCategories[key].name !== undefined
                                ?
                                this.props.grabBagData.currentSubCategories[key].children
                                    ?
                                    <FolderItem key={key} name={this.props.grabBagData.currentSubCategories[key].name} handleOnClick={this.onOpen.bind(this)} img={this.props.grabBagData.currentSubCategories[key].img} />
                                    :
                                    <DeviceItem key={key} name={this.props.grabBagData.currentSubCategories[key].name} handleOnClick={this.onAdd.bind(this)} img={this.props.grabBagData.currentSubCategories[key].img} />
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
     * handleOnClick passes the event up, to be handled by the parent class.
     *
     * @param keyName {string} is the name of the item clicked on.  TODO: should use the image GUID for this stuff?
     * @param event {object} is the click event.
     */
    handleOnClick(keyName, event) {
        this.props.onChange('currentCategoryName', keyName);
        event.preventDefault();
    }

    onBack(event) {
        this.props.onChange('currentCategoryName', 'back');
        event.preventDefault();
    }

    onOpen(folderName, event) {
        console.log("open " + folderName);
        this.props.onChange('currentCategoryName', folderName);
        event.preventDefault();
    }

    onAdd(deviceName, event) {
        console.log("add " + deviceName);
        this.props.onChange('currentCategoryName', deviceName);
        if (event !== null)
            event.preventDefault();
    }}

export default deviceList;