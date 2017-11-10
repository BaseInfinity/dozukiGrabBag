import request from 'request';
import historyItem from './historyItem.js';

// TODO: This is mess.  I need to clean up the API calls and deal with the 429 errors (to many calls; need to throttle)
class dataAPI {
    /**
     *
     * @param parent
     */
    getData(parent) {
        /* get data from the 'ifixit' category API */
        const dataURL = 'https://www.ifixit.com/api/2.0/categories';
        let localThis = parent;  // Use a promise method so I don't have to do this? axios?

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
                            currentSubCategories[catName] = new historyItem({
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
     * @param newCategory
     * @param parent
     */
    updateCurrentSubCategories(newCategory, parent) {
        let localThis = parent;  // Use a promise method so I don't have to do this? axios?

        let dataURL = 'https://www.ifixit.com/api/2.0/categories';
        if (newCategory && newCategory !== 'All') {
            dataURL += "/" + encodeURIComponent(newCategory);
        }

        request.get(dataURL, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let parsed = JSON.parse(body);

                // Just pull the top level out here... we will reload the subcats on change/click
                // Get the images while we are here, guid and id also for good measure
                let currentSubCategories = [];

                if (parsed.children !== undefined) {
                    parsed.children.forEach((child) => {
                        const infoURL = 'https://www.ifixit.com/api/2.0/categories/' + encodeURIComponent(child);
                        currentSubCategories[child] = [];
                        request.get(infoURL, function (error2, response2, body2) {
                            if (!error2 && response2.statusCode === 200) {
                                let parsedInfo = JSON.parse(body2);
                                if (parsedInfo['image'] !== 'undefined' && parsedInfo['image'] !== null) {
                                    currentSubCategories[child] = new historyItem({catName: child, imgId: parsedInfo['image']['id'], imgGuid: parsedInfo['image']['guid'], imgUrl: parsedInfo['image']['thumbnail'], catChildren: parsedInfo.children.length});
                                } else {
                                    currentSubCategories[child] = new historyItem({catName: child, imgId: '', imgGuid: '', imgUrl: '/images/DeviceNoImage_300x225.jpg'});
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
                                currentSubCategories[catName] = new historyItem({catName: catName, imgId: parsedInfo['image']['id'], imgGuid: parsedInfo['image']['guid'], imgUrl: parsedInfo['image']['thumbnail'], catChildren: 1});
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

    }
}

export default dataAPI;