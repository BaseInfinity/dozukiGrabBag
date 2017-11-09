import React, {Component} from 'react';
import request from 'request';
import categoryInfo from './categoryInfo.js';
import DeviceListContainer from './deviceListContainer.js';
import GrabBag from './grabBag.js';

// TODO: This is mess.  I need to clean up the API calls and deal with the 429 errors (to many calls; need to throttle)
/**
 * GrabBagContainer is the outer most container... is the conduit between the 'grab bag' and the 'device list'.
 */
class GrabBagContainer extends Component {
    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);

        let myDevicesIn      = [];
        let myNextDeviceIdIn = 1;
        if (typeof(Storage) !== 'undefined') {
            let devicesIn = localStorage.getItem('dozuki_grabbag_mydevices');
            if (devicesIn !== null && devicesIn !== undefined) {
                myDevicesIn = JSON.parse(devicesIn);
            }

            let nextDeviceIdIn = localStorage.getItem('dozuki_grabbag_nextdeviceid');
            if (nextDeviceIdIn !== null && nextDeviceIdIn !== undefined) {
                myNextDeviceIdIn = nextDeviceIdIn;
            }
        }

        this.state = {
            myDevices: myDevicesIn,
            currentCategoryName: 'All',
            currentSubCategories: [],
            nextDeviceId: myNextDeviceIdIn
        };
    }

    /**
     *
     */
    componentDidMount() {
        const dataURL = 'https://www.ifixit.com/api/2.0/categories';
        let localThis = this;  // Use a promise method so I don't have to do this? axios?

        request.get(dataURL, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let parsed         = JSON.parse(body);

                // Just pull the top level out here... we will reload the subcats on change/click
                // Get the images while we are here, guid and id also for good measure
                let currentSubCategories = [];

                for (let catName in parsed) {
                    const infoURL = 'https://www.ifixit.com/api/2.0/categories/' + encodeURIComponent(catName);
                    currentSubCategories[catName] = [];
                    request.get(infoURL, function (error2, response2, body2) {
                        if (!error2 && response2.statusCode === 200) {
                            let parsedInfo = JSON.parse(body2);
                            currentSubCategories[catName] = new categoryInfo({
                                  catName: catName
                                , imgId: parsedInfo['image']['id']
                                , imgGuid: parsedInfo['image']['guid']
                                , imgUrl: parsedInfo['image']['thumbnail']
                                , catChildren: 1
                            });
                            localThis.setState({currentSubCategories});
                        } else {
                            // TODO: Deal with errors better
                            console.log(error);
                        }
                    });
                }
            } else {
                // TODO: Deal with errors better
                console.log(error);
            }
        });
    }

    /**
     *
     * @param deviceName
     */
    addDevice = (deviceName) => {
        let device        = this.state.currentSubCategories[deviceName];
        device.myDeviceId = this.state.nextDeviceId;
        this.state.myDevices.push(device);
        let nextDeviceId = parseInt(device.myDeviceId, 10) + 1;
        this.setState({myDevices: this.state.myDevices, nextDeviceId: nextDeviceId});

        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem('dozuki_grabbag_mydevices', JSON.stringify(this.state.myDevices));
            localStorage.setItem('dozuki_grabbag_nextdeviceid', nextDeviceId);
        }
    };

    /**
     *
     * @param newCategory
     */
    changeCategory = (newCategory) => {
        this.setState({currentCategoryName: newCategory, currentSubCategories: []});
    };

    /**
     *
     * @param item
     * @param index
     * @param data
     * @param onClick
     * @returns {XML}
     */
    genListItem = (item, index, data, onClick) => {
        return (
                                <div className='col-xs-12 col-sm-6 col-lg-4' key={index}>
                                    <div className='dozuki_grabbag_device_list_section_item' name='currentCategory' value={data.name}
                                         onClick={onClick}>
                                        <div className='dozuki_grabbag_device_list_section_item_title' title={data.name}>
                                            {data.children ? <i className='fa fa-folder-o pull-left' /> : item.myDeviceId ? <i className='fa fa-minus pull-left' /> : <i className='fa fa-plus pull-left' />}
                                            &nbsp;{data.name}
                                        </div>
                                        <div className='dozuki_grabbag_device_list_section_item_body'><img className='dozuki_grabbag_device_list_section_item_image' src={data.img} alt='' /></div>
                                    </div>
                                </div>
        );
    };

    /**
     *
     * @param newCategory
     */
    updateCurrentSubCategories = (newCategory) => {
        let dataURL = 'https://www.ifixit.com/api/2.0/categories';
        if (newCategory && newCategory !== 'All') {
            dataURL += "/" + encodeURIComponent(newCategory);
        }

        let localThis = this;  // Use a promise method so I don't have to do this? axios?

        request.get(dataURL, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let parsed = JSON.parse(body);

                // Just pull the top level out here... we will reload the subcats on change/click
                // Get the images while we are here, guid and id also for good measure
                let currentSubCategories = [];

                if (parsed.children !== undefined) {
                    parsed.children.forEach((child) => {
                        currentSubCategories[child] = [];
                        const infoURL = 'https://www.ifixit.com/api/2.0/categories/' + encodeURIComponent(child);
                        request.get(infoURL, function (error2, response2, body2) {
                            if (!error2 && response2.statusCode === 200) {
                                let parsedInfo = JSON.parse(body2);
                                if (parsedInfo['image'] !== 'undefined' && parsedInfo['image'] !== null) {
                                    currentSubCategories[child] = new categoryInfo({catName: child, imgId: parsedInfo['image']['id'], imgGuid: parsedInfo['image']['guid'], imgUrl: parsedInfo['image']['standard'], catChildren: parsedInfo.children.length});
                                } else {
                                    currentSubCategories[child] = new categoryInfo({catName: child, imgId: '', imgGuid: '', imgUrl: '/images/DeviceNoImage_300x225.jpg'});
                                }
                                localThis.setState({currentSubCategories});
                            } else {
                                // TODO: Deal with errors better
                                console.log(error2);
                            }
                        });
                    });
                } else {
                    for (let catName in parsed) {
                        const infoURL = 'https://www.ifixit.com/api/2.0/categories/' + encodeURIComponent(catName);
                        currentSubCategories[catName] = [];
                        request.get(infoURL, function (error2, response2, body2) {
                            if (!error2 && response2.statusCode === 200) {
                                let parsedInfo = JSON.parse(body2);
                                currentSubCategories[catName] = new categoryInfo({catName: catName, imgId: parsedInfo['image']['id'], imgGuid: parsedInfo['image']['guid'], imgUrl: parsedInfo['image']['standard'], catChildren: 1});
                                localThis.setState({currentSubCategories});
                            } else {
                                // TODO: Deal with errors better
                                console.log(error2);
                            }
                        });
                    }
                }
            } else {
                // TODO: Deal with errors better
                console.log(error);
            }
        });

    };

    /**
     *
     * @returns {XML}
     */
    render() {
        return (
            <div className="row" role="row">
                <div className="container-fluid">
                    <div className="col-xs-12 col-sm-6">
                        <GrabBag myDevices={this.state.myDevices} genListItem={this.genListItem}></GrabBag>
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <DeviceListContainer addDevice={this.addDevice} genListItem={this.genListItem} changeCategory={this.changeCategory} updateCurrentSubCategories={this.updateCurrentSubCategories} grabBagData={this.state}></DeviceListContainer>
                    </div>
                </div>
            </div>
        );
    }
}

export default GrabBagContainer;