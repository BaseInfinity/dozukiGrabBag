import React, {Component} from 'react';
import PropTypes from 'prop-types'
//import '../css/grabBagItem.css';

/**
 * propTypes
 *
 * @type {{removeItem: (*), myItems: (*)}}
 */
const propTypes = {
    removeItem: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

class grabBagItem extends Component {
    /**
     * render() generates the folder item HTML.
     *
     * @returns {XML} is the content to render; Using React JSX.
     */
    render() {
        const {data} = this.props;
        const name = data.details.topic_info.name;
        const src = data.details.image.thumbnail;

        return (
            <div className='col-xs-6 col-sm-4 col-lg-3 dozuki_grabbag_device_list_item_container'>
                <div className='dozuki_grabbag_device_list_section_item' name='currentCategory' value={name} onClick={this.onItemClick.bind(this)}>
                    <div className='dozuki_grabbag_device_list_section_item_title dozuki_grabbag_device_list_device_container' title={name}>
                        {name}
                    </div>
                    <div className='dozuki_grabbag_device_list_section_item_body'>
                        <img className='dozuki_grabbag_device_list_section_item_image dozuki_grabbag_device_list_section_item_device_imagex' src={src} alt='' />
                    </div>
                </div>
                <div className="dozuki_grabbag_device_list_section_item_details" id={data.itemId}>
                    {data.details.guides.map((guide, index) =>
                        <div key={index}><a target="_blank" href={guide.url} title={guide.title}>{guide.title}</a></div>
                    )}
                </div>
            </div>
        )
    }
    /**
     * onItemClick() passes the event up to the parent.
     *
     * @param event {object} is the click event.
     */
    onItemClick(event) {
        const {data, removeItem} = this.props;
        const name = data.details.topic_info.name;

        // TODO: Make remove conditional... like click a remove button (X)
        removeItem(name);
        if (event) {
            event.preventDefault();
        }
    }
}

grabBagItem.propTypes = propTypes;

export default grabBagItem;