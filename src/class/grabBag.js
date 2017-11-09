import React, {Component} from 'react';
import '../css/grabBag.css';

// TODO: grab bag needs to support:
// 1) dropping on dragged items from the device list
// 2) removing items from the grab bag (click on minus sign; swipe left?)
// 3) show image, name and description from the catalog

/**
 * GrabBag is the grab bag container.  It displays the grab bag and it's contents.
 */
class GrabBag extends Component {
    /**
     * handleOnClick() enables the deleting of items from the grab bag.
     *
     * @param item {categoryInfo} is the device that was clicked on.
     * @param event {Object} is the click event.
     */
    static handleOnClick(item, event) {
        // TODO: implement grab bag delete
        alert('Delete not implemented: ' + item.name + "(" + item.guid + ", " + item.myDeviceId + ")");
        event.preventDefault();
    }

    /**
     * render() displays the grab bag and it's contents.
     *
     * @returns {XML} is the content to render; Using React JSX.
     */
    render() {
        let noDevices = '';
        if (!this.props.myDevices.length) {
            noDevices = <p>You have no devices at this time.</p>;
        }

        return (
            <div className='dozuki_grabbag_container'>
                <h3>Your Devices</h3>
                {noDevices}
                <div className='dozuki_grabbag_device_list'>
                    <section className='dozuki_grabbag_device_list_section'>
                        <div className="row" role="row">
                            <div className="container-fluid">
                                {this.props.myDevices.map((key, index) =>
                                    this.props.genListItem(key, index, this.props.myDevices[index], GrabBag.handleOnClick.bind(this, this.props.myDevices[index]))
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

export default GrabBag;