import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropTarget} from 'react-dnd';
import ItemTypes from './itemTypes';
import GrabBagItem from './grabBagItem';
import '../css/grabBag.css';

const DND_CANDROP_COLOR  = 'orange';
const DND_ISACTIVE_COLOR = 'green';

/**
 * These are strings use in the UI.  Candidates for being provided by a language system.
 *
 * @type {string}
 */
const STRING_GRABBAG_TITLE  = 'Your Grab Bag';
const STRING_CONFIRM_DELETE = "Are you sure you want to remove '{0} ({1})' from your Grab Bag?";

//eslint-disable-next-line
String.prototype.format = function() {
    let a = this;
    for (let k in arguments) {
        a = a.replace("{" + k + "}", arguments[k])
    }
    return a
};

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
 * @type {{connectDropTarget: (*), isOver: (*), canDrop: (*), grabBagMessage: (*), removeItem: (*), myItems: (*)}}
 */
const propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    grabBagMessage: PropTypes.string.isRequired,
    removeItem: PropTypes.func.isRequired,
    myItems: PropTypes.object.isRequired
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
 * GrabBag is the grab bag container.  It displays the grab bag and it's contents.
 */
class GrabBag extends Component {
    /**
     * handleOnClick() enables the deleting of items from the grab bag.
     *
     * @param item {Object} is the device that was clicked on.
     * @param event {Object} is the click event.
     */
    static removeItem(item, event) {
        const { removeItem } = this.props;
        let message = STRING_CONFIRM_DELETE.toString().format(item.details.topic_info.name, item.itemId);

        //eslint-disable-next-line
        if (confirm(message)) {
            removeItem(item);
        }
    }

    /**
     * render() displays the grab bag and it's contents.
     *
     * @returns {XML} is the content to render; Using React JSX.
     */
    render() {
        const { canDrop, isOver, connectDropTarget, myItems, grabBagMessage } = this.props;
        const isActive = canDrop && isOver;

        let noDevices = '';
        if (Object.keys(myItems).length === 0 && myItems.constructor === Object) {
            noDevices = <p>{grabBagMessage}</p>;
        }

        let boxShadow = '';
        if (isActive) {
            boxShadow = '0 0 4px ' + DND_ISACTIVE_COLOR;
        } else if (canDrop) {
            boxShadow = '0 0 2px ' + DND_CANDROP_COLOR;
        }

        return connectDropTarget(
            <div className='dozuki_grabbag_container'>
                <h3>{STRING_GRABBAG_TITLE}</h3>
                <div className='dozuki_grabbag_device_list' style={{ boxShadow }}>
                    {noDevices}
                    <section className='dozuki_grabbag_device_list_section'>
                        <div className="dozuki_grabbag_items_container">
                            {Object.keys(myItems)
                                .sort((a,b) => {
                                    let textA = a.toUpperCase();
                                    let textB = b.toUpperCase();
                                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                })
                                .map((key, index) =>
                                <GrabBagItem key={key} data={myItems[key]} removeItem={GrabBag.removeItem.bind(this, myItems[key])}/>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

GrabBag.propTypes = propTypes;

export default DropTarget(ItemTypes.CARD, cardTarget, collect)(GrabBag);
