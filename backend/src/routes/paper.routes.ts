import { Router } from 'express';
import { PaperController } from '../controllers/paper.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/search', PaperController.searchPapers);
router.get('/autocomplete', PaperController.autocomplete);

// Protected Routes
router.post('/index', authMiddleware, PaperController.indexPaper);
router.put('/:id', authMiddleware, PaperController.updatePaper);
router.delete('/:id', authMiddleware, PaperController.deletePaper);

export default router;
