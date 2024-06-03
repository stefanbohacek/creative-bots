import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  request.session.destroy((err) => {
    res.redirect('/');
  });
});

export default router;