import jwt from 'jsonwebtoken';

export const auth = async (req, res) => {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json({
            message: 'access denied'
        });

    } else if(token) {

        try {
            const verifiedToken = await jwt.verify(token, "myjwtsecret");
            return req.user = verifiedToken;
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

}