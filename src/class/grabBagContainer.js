import React, {Component} from 'react';
import {DragDropContextProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DeviceListContainer from './deviceListContainer.js';
import GrabBag from './grabBag.js';
import DataAPI from './dataAPI.js';

/**
 * These are strings use in the UI.  Candidates for being provided by a language system.
 *
 * @type {string}
 */
const STRING_NO_DEVICES = 'You have no items in your grab bag at this time.  Browse devices and drag them here to add them to your grab bag.';
const STRING_NO_STORAGE = 'Storage for your grab bag is not available.  Ensure that cookies are turned on, or ty another browser.';
const STRING_NO_API     = 'Failed to find any devices.  Try refreshing your browser.';

/**
 * STRING_ROOT_TEXT is how I identity the root of the tree... it could be 'root' fo that matter.
 *
 * @type {string}
 */
const STRING_ROOT_TEXT  = 'All';

/**
 *
 * @type {number}
 */
const EMPTY_DATA_LENGTH = 2;

/**
 * NEXT_ITEM_ID is the default next item id.
 *
 * @type {number}
 */
const NEXT_ITEM_ID      = 1;

/**
 * GrabBagContainer is the outer most container... is the conduit between the 'grab bag' and the 'device list'.
 *
 *  Some of the things that the GrabBagContainer does:
 *   1) Attempts to read the grab bag from local web storage on mount.
 *   2) Attempts to pull the catalog tree from the API on mount.
 *   3) Attempts to store the grab bag in local web storage when items are added or removed.
 *   4) Manages the pulling of item images from the API. (once per session, on demand)
 *
 */
class GrabBagContainer extends Component {
    pullCounter = 0;
    ignorePull = false;

    /**
     * constructor()
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            /**
             * baseData will contain the category tree pulled from the API, after mount.
             *
             *  This tree structure serves as the foundation for device list navigation and populating.
             *  As needed for display, the nodes will have a 'details' element added is are the result of
             *  additional API pulls.
             */
            baseData: null,
            /**
             * myItems is a list of data structures that are the 'details' elements pulled from the baseData.
             *
             *  The list is used by the grabBag but, it is managed here.
             */
            myItems: {},
            /**
             * currentSubCategories is a list of data structures that are the 'details' elements pulled from
             * the baseData.
             *
             *  The list is used by the deviceList but, it is managed here.
             */
            currentSubCategories: {},
            /**
             * currentCategoryName keeps track of the current category name.
             */
            currentCategoryName: STRING_ROOT_TEXT,
            /**
             * nextItemId is the next value to be used for the itemId for items in the grabBag.
             */
            nextItemId: NEXT_ITEM_ID,
            /**
             * deviceListMessage is used to communicate failures to the user, via the device list.
             */
            deviceListMessage: 'Looking for devices...',
            /**
             *
             */
            grabBagMessage: 'Retrieving your grab bag...',
            /**
             * dataApi is used to pull data from the API.
             */
            dataAPI: new DataAPI()
        };
    }

    /**
     * render() generates the grab bag container HTML.
     *
     * @returns {XML} is the content to render; Using React JSX.
     */
    render() {
        const {myItems, grabBagMessage, currentCategoryName, currentSubCategories, deviceListMessage} = this.state;

        return (
            <DragDropContextProvider backend={HTML5Backend}>
                <div className="container-fluid">
                    <div className="row" role="row">
                        <div className="col-xs-12 col-sm-6">
                            <GrabBag myItems={myItems} removeItem={this.removeItem.bind(this)} grabBagMessage={grabBagMessage}></GrabBag>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <DeviceListContainer addDevice={this.addItem.bind(this)} changeCategory={this.changeCategory.bind(this)} currentCategoryName={currentCategoryName} currentSubCategories={currentSubCategories} deviceListMessage={deviceListMessage}></DeviceListContainer>
                        </div>
                    </div>
                </div>
            </DragDropContextProvider>
        );
    }

    /**
     * componentDidMount() attempts to read the grab bag from local web storage, and attempts to get the initial tree data for the device list.
     */
    componentDidMount() {
        // Pull in grab bag data if it exists.
        this.localStorageIn();

        // Pull in device list data if possible.
        this.pullInitialTreeDataFromAPI();
    }

    /**
     * addItem() adds a device to the grab bag. (myItems)
     *
     * @param {string} itemName is the name of the device to add
     */
    addItem(itemName) {
        const {nextItemId, currentSubCategories, myItems} = this.state;

        // Make a copy of an item object by looking it up in the current categories using the deviceName.
        let item = Object.assign({}, currentSubCategories[itemName]);

        // Add the itemId to the object.
        item.itemId = nextItemId;

        // Add the item object to myItems.
        myItems[itemName + nextItemId] =  item;

        // Increment the next device id
        const newNextItemId = nextItemId + 1;

        // Store the new next device id, and trigger a refresh to show the item in the grab bag.
        this.setState({nextItemId: newNextItemId});

        // Store the grab bag (with the new device in it) in the local web store
        this.localStorageOut();
    }

    /**
     * removeItem()
     *
     * @param {Object} device
     */
    removeItem(device) {
        let {myItems} = this.state;

        // Find the item in the list by matching itemId and delete it.
        Object.keys(myItems).forEach((key) => {
            if (myItems[key].itemId === device.itemId) {
                // Found a match... delete the it.
                delete myItems[key];
                // Update myItems and trigger a refresh to show that the item was removed.
                this.setState({'myItems': myItems}, () => {
                    // Safe to store the myItems to local storage now.
                    this.localStorageOut();
                });
            }
        });
    }

    /**
     * pullInitialTreeDataFromAPI()
     */
    pullInitialTreeDataFromAPI () {
        // attempt to get the initial tree data from the api... we call this the baseData
        this.state.dataAPI.getBaseData((data) => {
            if (data !== null) {
                // Store the initial baseData in the object state.
                this.setState({baseData: data});
                // Loop trough the root's direct decedents within the baseData and get the image details.
                for (let catName in data) {
                    this.state.dataAPI.getCategoryItem(catName, (dataSub) => {
                        // update the baseData items to have a 'details' value as the image data for each comes back.
                        let newBaseData = this.state.baseData;
                        newBaseData[catName].details = dataSub;
                        this.setState({baseData: newBaseData, currentSubCategories: newBaseData});
                    });
                }
            } else {
                this.setState({deviceListMessage: STRING_NO_API});
            }
        });
    }

    /**
     * localStorageOut() will store the grab bag in local web storage, if available.
     */
    localStorageOut() {
        // Check to make sure it is supported.
        if (typeof(Storage) !== 'undefined') {
            const {myItems} = this.state;

            // Store in local web storage a JSON version of the structure.
            localStorage.setItem('dozuki_grabbag_myitems', JSON.stringify(myItems));
        }
    }

    /**
     * localStorageIn() will store the grab bag in local web storage, if available.
     */
    localStorageIn() {
        // Check to make sure it is supported.
        if (typeof(Storage) !== 'undefined') {
            let {nextItemId} = this.state;
            let myItemsIn    = {};

            // Read from local web storage a JSON version of the structure.
            let devicesIn = localStorage.getItem('dozuki_grabbag_myitems');

            // Confirm that we got something before continuing.
            if (devicesIn !== null && devicesIn !== undefined && devicesIn.length > EMPTY_DATA_LENGTH) {
                // Parse the JSON package back into an object we can work with.
                myItemsIn = JSON.parse(devicesIn);

                // Sort the results.
                Object.keys(myItemsIn).sort((a, b) => {
                    let textA = a.toUpperCase();
                    let textB = b.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                }).forEach((key) => {
                    // Increment the nextItemId if needed.
                    nextItemId = nextItemId < myItemsIn[key].itemId ? myItemsIn[key].itemId + 1 : nextItemId;
                });
                this.setState({myItems: myItemsIn, nextItemId: nextItemId});
            } else {
                this.setState({'grabBagMessage': STRING_NO_DEVICES});
            }
        } else {
            this.setState({'grabBagMessage': STRING_NO_STORAGE});
        }
    }

    /**
     * changeCategory() will cause device list to populate with the new category.
     *
     * @param {string} newCategory is the new category the device list is to display
     * @param {Object} historyStack is used to help figure out the location of the category in the tree (baseData).
     */
    changeCategory(newCategory, historyStack) {

        // Because the API pulls can take a while and we don't block as they are being pulled,
        // we need to protect against getting another change (say the user hit the back button
        // before we done with a set of pulls to populate that category).
        //
        // Do this by keeping track of the pull completions and not letting a change to be processed
        // until they are done, and trying again in a tenth of a second.
        if (this.pullCounter) {
            this.ignorePull = true;
            var _this = this;
            setTimeout(() => { _this.changeCategory(newCategory, historyStack); }, 100);
            return;
        }

        // update the current category name, and wipe out the currentSubCategories before repopulating
        this.setState({currentCategoryName: newCategory, currentSubCategories: {}}, () => {
            if (!newCategory || newCategory === 'All') {
                // Just point it at the baseData and we're done... the details on the children was pulled at startup.
                const {baseData} = this.state;
                this.setState({currentSubCategories: baseData});
            } else {
                // Reuse the data in the baseData if available
                let dataPointer = this.getCurrentSubCategoriesPointer(newCategory, historyStack);
                this.setState({currentSubCategories: dataPointer});
                this.cacheCategoryImageData(dataPointer);
            }
        });
    }

    /**
     * getCurrentSubCategoriesPointer() returns a pointer to the current data point in the tree (baseData)
     *
     * @param historyStack {Object}
     * @param newCategory {string}
     *
     * @returns {*}
     */
    getCurrentSubCategoriesPointer(newCategory, historyStack) {
        let dataPointer    = this.state.baseData;
        let myHistoryStack = historyStack.slice();
        let catName        = myHistoryStack.shift();

        // Walk the historyStack from bottom to top to move the dataPointer in the tree.
        while (catName) {
            if (catName !== 'All') {
                dataPointer = dataPointer[catName];
            }
            catName = myHistoryStack.shift();
        }

        // Return the new dataPointer position.
        return dataPointer[newCategory];
    }

    /**
     * cacheCategoryImageData() attempts to pull image data for the current category's children from the API, if needed.
     *
     * @param dataPointer {Object}
     */
    cacheCategoryImageData(dataPointer) {
        // Get the level's 'details' data (if we don't already have it)

        this.pullCounter = Object.keys(dataPointer).length;
        for (let catName in dataPointer) {
            // if the details data is not there, try to get it.
            if (dataPointer[catName]['details'] === undefined && catName !== 'details') {
                const {dataAPI} = this.state;

                dataAPI.getCategoryItem(catName, (dataSub) => {
                    // As the results come back...

                    // Stash them in the 'details' offset of the associated item in the tree (baseData).
                    dataPointer[catName]['details'] = dataSub;

                    // Decrement the pull counter
                    this.pullCounter--;

                    // Only update if not waiting to process another change already.
                    if (!this.ignorePull) {
                        // Populate the currentSubCategories (what the device list displays).
                        this.setState({currentSubCategories: dataPointer});
                    }

                    // Unblock any backed up change requests.
                    if (this.pullCounter === 0) {
                        this.ignorePull = false;
                    }
                });
            } else {
                this.pullCounter--;
            }
        }
    }
}

export default GrabBagContainer;