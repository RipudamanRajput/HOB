const { getHostsService, addHostService, getHostByIdService, getHostByUserIDService, getHostForAdminsService, updateHostService, updateHostPropertyService } = require("../services/hostService");


const getHosts = async (req, res) => {
    try {
        const {
            page,
            limit,
            name,
            email,
            address,
            nameOfBusiness,
            boardingOfPets,
            amenities,
            status,
            bussinessType,
            minPrice,
            maxPrice
        } = req.query;
        const hosts = await getHostsService(
            page,
            limit,
            name,
            email,
            address,
            nameOfBusiness,
            boardingOfPets,
            amenities,
            status,
            bussinessType,
            minPrice,
            maxPrice
        );


        res.json(hosts);
    } catch (error) {
        console.error('Error in get Hosts controller:', error);
        res.status(500).json({ error: error.message });
    }
};

const getHostsforAdmin = async (req, res) => {
    try {
        const {
            page,
            limit,
            name,
            email,
            address,
            nameOfBusiness,
            boardingOfPets,
            amenities,
            status
        } = req.query;
        const hosts = await getHostForAdminsService(
            page,
            limit,
            name,
            email,
            address,
            nameOfBusiness,
            boardingOfPets,
            amenities,
            status);

        res.json(hosts);
    } catch (error) {
        console.error('Error in get Hosts controller:', error);
        res.status(500).json({ error: error.message });
    }
};

const getHostById = async (req, res) => {
    try {
        const hostId = req.params.id;
        const host = await getHostByIdService(hostId);
        if (!host) {
            return res.status(404).json({ error: 'Host not found' });
        }
        res.json(host);
    } catch (error) {
        console.error('Error in get HostById controller:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const postHosts = async (req, res) => {
    try {
        const hostId = await addHostService(req.body);
        res.status(201).json({
            message: 'Host created successfully',
            success: true,
            HostId: hostId
        });
    } catch (error) {
        console.error('Error in pos tHosts controller:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            success: false,
            message: error.message
        });
    }
};

const putHosts = async (req, res) => {
    try {
        const { id } = req.params
        const hostdata = await getHostByIdService(id)
        if (!hostdata) {
            return res.json({ message: "user account not exist" })
        }
        const hostId = await updateHostService(req, res);
        res.status(201).json({
            message: 'Host successfully updated',
            success: true,
            HostId: hostId
        });
    } catch (error) {
        console.error('Error in put Host controller:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            success: false,
            message: error.message
        });
    }
};
const putHostProperty = async (req, res) => {
    try {
        const { id } = req.params
        const hostdata = await getHostByIdService(id)
        if (!hostdata) {
            return res.json({ message: "Host account not exist" })
        }
        const hostId = await updateHostPropertyService(req, res);
        res.status(201).json({
            message: 'Host property successfully updated',
            success: true,
            HostId: hostId
        });
    } catch (error) {
        console.error('Error in put Host controller:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            success: false,
            message: error.message
        });
    }
};

module.exports = { getHosts, getHostById, postHosts, getHostsforAdmin, putHosts, putHostProperty };