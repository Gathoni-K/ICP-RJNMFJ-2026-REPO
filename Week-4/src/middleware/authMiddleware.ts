import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export const authMiddleware = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    // grab the token from the request header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: 'No token provided' 
        });
    }

    // extract the token — remove the "Bearer " part
    const token = authHeader.split(' ')[1];

    // verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return res.status(401).json({ 
            error: 'Invalid or expired token' 
        });
    }

    // attach the user to the request so routes can access it
    req.user = data.user;

    next();
};