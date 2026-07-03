const { addUser, getUsers: getUsersService, getUserById: getUserByIdService, updateUser: updateUserService, deleteUser: deleteUserService } = require("../services/userService");

const getUsers = async (req, res) => {
    try {
        const { page, limit, name, email } = req.query;
        const users = await getUsersService(page, limit, name, email);
        res.json({ users });
    } catch (error) {
        console.error('Error in getUsers:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await getUserByIdService(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Error in getUserById:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const postUsers = async (req, res) => {
    try {
        const userId = await addUser(req.body);
        res.status(201).json({
            message: 'User created successfully',
            success: true,
            userId: userId
        });
    } catch (error) {
        console.error('Error in postUsers:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            success: false,
            message: error.message
        });
    }

};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await getUserByIdService(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const updatedUserData = req.body;
        await updateUserService(userId, updatedUserData);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error in updateUser:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            success: false,
            message: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await getUserByIdService(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await deleteUserService(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            success: false,
            message: error.message
        });
    }
};

module.exports = { getUsers, getUserById, postUsers, updateUser, deleteUser };