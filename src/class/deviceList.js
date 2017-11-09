import React, {Component} from 'react';

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
        let back = <div></div>;
        if (this.props.historyStack.length) {
            back = <div className='col-xs-12 col-sm-6 col-lg-4' key='back'>
                <div className='dozuki_grabbag_device_list_section_item' name='back' value='back' onClick={this.handleOnClick.bind(this, 'back')}>
                    <div className='dozuki_grabbag_device_list_section_item_title'>BACK</div>
                    <div className='dozuki_grabbag_device_list_section_item_body'><img className='dozuki_grabbag_device_list_section_item_image' src='/images/back.png' alt='' /></div>
                </div>
            </div>;
        }
        return (
            <div className='dozuki_grabbag_device_list'>
                <section className='dozuki_grabbag_device_list_section'>
                    <div className="row" role="row">
                        <div className="container-fluid">
                            {back}
                            {Object.keys(this.props.grabBagData.currentSubCategories).map((key, index) =>
                                this.props.genListItem(key, index, this.props.grabBagData.currentSubCategories[key], this.handleOnClick.bind(this, this.props.grabBagData.currentSubCategories[key].name))
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
}

export default deviceList;