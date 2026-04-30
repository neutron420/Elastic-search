import type { Request, Response } from 'express';
import { ElasticsearchService } from '../services/elasticsearch.service';
import { PaperService } from '../services/paper.service';
import { createPaperSchema, updatePaperSchema, searchSchema } from '../validations/paper.validation';
import logger from '../utils/logger';

export class PaperController {
  /**
   * CREATE: Save to PostgreSQL and Index in Elasticsearch
   */
  static async indexPaper(req: Request, res: Response) {
    try {
      const validatedData = createPaperSchema.parse(req.body);
      const result = await PaperService.createPaper(validatedData as any);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Controller Error - Create Paper:', error);
      res.status(400).json({ success: false, error: error.errors || error.message });
    }
  }

  /**
   * UPDATE: Sync changes across PG and ES
   */
  static async updatePaper(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = updatePaperSchema.parse(req.body);
      const result = await PaperService.updatePaper(id as string, validatedData as any);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.errors || error.message });
    }
  }

  /**
   * DELETE: Remove from both PG and ES
   */
  static async deletePaper(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PaperService.deletePaper(id as string);
      res.status(200).json({ success: true, message: 'Deleted from PG and ES successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * SEARCH: Read directly from Elasticsearch (Performance)
   */
  static async searchPapers(req: Request, res: Response) {
    try {
      const validatedQuery = searchSchema.parse(req.query);
      const result = await ElasticsearchService.search(validatedQuery as any);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.errors || error.message });
    }
  }

  /**
   * AUTOCOMPLETE: Read directly from Elasticsearch
   */
  static async autocomplete(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ success: false, message: 'Query string required' });
      }
      const suggestions = await ElasticsearchService.suggest(q);
      res.status(200).json({ success: true, suggestions });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
