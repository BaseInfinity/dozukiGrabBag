/**
 * categoryInfo is a simple class for use in the history stack;  And now it is used in myDevices also.
 */
class categoryInfo {
    /**
     * name is the 'name' of the device
     *
     * @type {null|string}
     */
    name      = null;
    /**
     * id is the 'id' of the device
     *
     * @type {null|number}
     */
    id        = null;
    /**
     * guid is the 'guid' of the device
     *
     * @type {null|string}
     */
    guid      = null;
    /**
     * img is the 'standard' image URL for the device
     *
     * @type {null|string}
     */
    img       = null;
    /**
     * children is the amount of children the device has
     *
     * Note:
     * The definition of a device that can be added to the grab bag is a bit wonky.
     * For now, a grab bag addable device is on that has no children.
     *
     * @type {number}
     */
    children  = 0;
    /**
     * myDeviceId is used by the grab bag to identify grab bag items.
     *
     * Note:
     * This allows us to keep multiples of the same device in the grab bag.
     *
     * @type {null|number}
     */
    myDeviceId = null;

    constructor(data) {
        this.name       = data.catName;
        this.id         = data.imgId;
        this.guid       = data.imgGuid;
        this.img        = data.imgUrl;
        this.children   = data.catChildren;
        this.myDeviceId = data.myDeviceId;
    }
}

export default categoryInfo;
