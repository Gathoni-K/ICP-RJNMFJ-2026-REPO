import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    //grabbing the token from the request header

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'No token provided'
        });
    }

    const token = authHeader.split(' ')[1];
    //extracts the token, removes the ''Bearer' part

    const { data, error } = await supabase.auth.getUser(token);
    //verify the token using supabase

    if(error || !data.user) {
        return res.status(401).json({
            error: 'Invalid or expired token'
        });
    }

    req.user = data.user//attach the user to the request so routes can access it

    next();
};