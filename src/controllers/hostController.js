const { getHostsService, addHostService, getHostByIdService, getHostByUserIDService } = require("../services/hostService");


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
            amenities
        } = req.query;
        const hosts = await getHostsService(
            page,
            limit,
            name,
            email,
            address,
            nameOfBusiness,
            boardingOfPets,
            amenities);
        res.json(hosts);
    } catch (error) {
        console.error('Error in get Hosts controller:', error.message);
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
        const hostdata = await getHostByUserIDService(req.body.userId)
        if (hostdata) {
            return res.json({ message: "user account already exist" })
        }
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

module.exports = { getHosts, getHostById, postHosts };