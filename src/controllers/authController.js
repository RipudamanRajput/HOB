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
            expiresIn
        });
        // Redirect to frontend with token
        // res.redirect(`http://localhost:3000/auth-success?token=${token}`);
    } catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
};

const logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        req.session.destroy(() => {
            res.json({
                success: true,
                message: "Logged out"
            });
        });
    });
};

module.exports = { generateToken, googleCallback, logout };