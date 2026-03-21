import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', (req, res) => {
    const { login, password } = req.body;
    
    if (login === 'admin' && password === 'admin123') {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token });
    }
    
    res.status(401).json({ message: 'Аккаунт не найден' });
});

export default router;
