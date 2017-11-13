import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {DropTarget} from 'react-dnd'
import ItemTypes from './itemTypes'
import '../css/grabBag.css';

// 1) name and description from the catalog?
// 2) show link to catalog page?

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
 * @type {{connectDropTarget: (*), isOver: (*), canDrop: (*)}}
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
     * @param item {Object} is the device that was clicked on.
     * @param event {Object} is the click event.
     */
    static handleOnClick(item, event) {
        const { removeItem } = this.props;
        let message = STRING_CONFIRM_DELETE.toString().format(item.details.topic_info.name, item.itemId);

        //eslint-disable-next-line
        if (confirm(message)) {
            removeItem(item);
        }
        if (event) {
            event.preventDefault();
        }
    }

    /**
     * genListItem()
     *
     * @param key {string}
     * @param data {Object}
     * @param onClick {Object}
     *
     * @returns {XML}
     */
    static genListItem(key, data, onClick) {
        const name = data.details.topic_info.name;
        const src = data.details.image.thumbnail;

        return (
            <div className='col-xs-6 col-sm-4 col-lg-3 dozuki_grabbag_device_list_item_container' key={key}>
                <div className='dozuki_grabbag_device_list_section_item' name='currentCategory' value={name} onClick={onClick}>
                    <div className='dozuki_grabbag_device_list_section_item_title dozuki_grabbag_device_list_device_container' title={name}>
                        {name}
                    </div>
                    <div className='dozuki_grabbag_device_list_section_item_body'>
                        <img className='dozuki_grabbag_device_list_section_item_image dozuki_grabbag_device_list_section_item_device_imagex' src={src} alt='' />
                    </div>
                </div>
            </div>
        );
    };

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
                <div className='dozuki_grabbag_device_list' style={{ ...style, boxShadow }}>
                    {noDevices}
                    <section className='dozuki_grabbag_device_list_section'>
                        <div className="row" role="row">
                            <div className="container-fluid">
                                {Object.keys(myItems)
                                    .sort((a,b) => {
                                        let textA = a.toUpperCase();
                                        let textB = b.toUpperCase();
                                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                    })
                                    .map((key, index) =>
                                    GrabBag.genListItem(key, myItems[key], GrabBag.handleOnClick.bind(this, myItems[key]))
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

GrabBag.propTypes = propTypes;

export default DropTarget(ItemTypes.CARD, cardTarget, collect)(GrabBag);
