import jwt from 'jsonwebtoken'

export const validedToken = async (req, res, next) => {
  try {
    const cookie = req?.headers?.cookie;
    
    if (!cookie) {
      return res.status(401).json({ error: true, message: 'Token not found' });
    }
    
    const token = cookie?.split('=')[1];

    if (!token) {
      return res.status(401).json({ error: true, message: 'Unauthorized access' });
    }
    
    const decode = jwt.verify(token, process.env.JWT_SECRECT);

    req.userId = decode.id
    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: true, message: 'Unauthorized access' });
  }
};
