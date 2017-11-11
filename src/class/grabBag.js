import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {DropTarget} from 'react-dnd'
import ItemTypes from './itemTypes'
import '../css/grabBag.css';

// TODO: grab bag needs to support:
// 1) removing items from the grab bag (click on minus sign; swipe left?)
// 2) name and description from the catalog?
// 3) show link to catalog page?

/**
 * cardTarget
 *
 * @type {{drop: (())}}
 */
const cardTarget = {
    drop() {
        return { name: 'GrabBag' }
    },
};

/**
 * propTypes
 *
 * @type {{connectDropTarget: (*), isOver: (*), canDrop: (*)}}
 */
const propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
};

/**
 * collect
 *
 * @param connect
 * @param monitor
 * @returns {{connectDropTarget: *, isOver: *, canDrop: *}}
 */
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    };
}

/**
 * style
 *
 * @type {{textAlign: string}}
 */
const style = {
    textAlign: 'center',
};

/**
 * GrabBag is the grab bag container.  It displays the grab bag and it's contents.
 */
class GrabBag extends Component {
    /**
     * handleOnClick() enables the deleting of items from the grab bag.
     *
     * @param item {historyItem} is the device that was clicked on.
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
        const { canDrop, isOver, connectDropTarget } = this.props;
        const isActive = canDrop && isOver;

        let noDevices = '';
        if (!this.props.myDevices || !this.props.myDevices.length) {
            noDevices = <p>You have no devices at this time.</p>;
        }

        let boxShadow = '';
        if (isActive) {
            boxShadow = '0 0 2px green';
        } else if (canDrop) {
            boxShadow = '0 0 2px yellow';
        }

        return connectDropTarget(
            <div className='dozuki_grabbag_container'>
                <h3>Your Devices</h3>
                <div className='dozuki_grabbag_device_list' style={{ ...style, boxShadow }}>
                    {noDevices}
                    <section className='dozuki_grabbag_device_list_section'>
                        <div className="row" role="row">
                            <div className="container-fluid">
                                {this.props.myDevices.map((key, index) =>
                                    this.genListItem(key.name, index, this.props.myDevices[index], GrabBag.handleOnClick.bind(this, this.props.myDevices[index]), true)
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    /**
     *
     * @param name
     * @param index
     * @param data
     * @param onClick
     * @returns {XML}
     */
    genListItem(name, index, data, onClick) {
        let key = name + index;
        return (
            <div className='col-xs-6 col-sm-4 col-lg-3 dozuki_grabbag_device_list_item_container' key={key}>
                <div className='dozuki_grabbag_device_list_section_item' name='currentCategory' value={data.name} onClick={onClick}>
                    <div className='dozuki_grabbag_device_list_section_item_title dozuki_grabbag_device_list_device_container' title={data.name}>
                        &nbsp;{data.name}
                    </div>
                    <div className='dozuki_grabbag_device_list_section_item_body'>
                        <img className='dozuki_grabbag_device_list_section_item_image dozuki_grabbag_device_list_section_item_device_imagex' src={data.img} alt='' />
                    </div>
                </div>
            </div>
        );
    };
}

GrabBag.propTypes = propTypes;

export default DropTarget(ItemTypes.CARD, cardTarget, collect)(GrabBag);
