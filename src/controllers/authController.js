const jwt = require('jsonwebtoken');

const expiresIn = '1h'; // Access token expires in 1 hour

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, googleId: user.googleId },
        process.env.JWT_SECRET,
        { expiresIn } // Access token expires in 1 hour
    );
};

const googleCallback = async (req, res) => {
    try {
        const user = req.user;
        const token = generateToken(user);
        res.json({
            token,
            expiresIn,
            user:{
                id: user.id,
                email: user.email,
                name: user.name,
                googleId: user.googleId,
                avatar: user.avatar
            }
        });
        // Redirect to frontend with token
        // res.redirect(`http://localhost:3000/auth-success?token=${token}`);
    } catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
};


module.exports = { generateToken, googleCallback };