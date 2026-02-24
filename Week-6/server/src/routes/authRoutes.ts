import express from 'express';
import { supabase } from '../config/supabase';

const router = express.Router();

//sign up route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required'
        });
    }

    const { data, error } = await supabase.auth.signUp({
        email, 
        password
    });

    if(error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
        message: "Account created successfully",
        user: data.user
    });
});


//login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if(error) {
        return res.status(401).json({ error: error.message });
    }

    res.json({
        message: "Login successful",
        token: data.session.access_token,
        user: data.user
    });
});

export default router;