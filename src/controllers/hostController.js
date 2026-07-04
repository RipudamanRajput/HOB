const { getHostsService, addHostService, getHostByIdService } = require("../services/hostService");


const getHosts = async (req, res) => {
    try {
        const { page, limit, name } = req.query;
        const hosts = await getHostsService(page, limit, name);
        res.json(hosts);
    } catch (error) {
        console.error('Error in getHosts:', error.message);
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
        console.error('Error in getHostById:', error.message);
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
        console.error('Error in postHosts:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            success: false,
            message: error.message
        });
    }
};

module.exports = { getHosts, getHostById, postHosts };