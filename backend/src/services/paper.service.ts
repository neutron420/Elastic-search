import prisma from '../config/prisma';
import { ElasticsearchService } from './elasticsearch.service';
import type { IResearchPaper } from '../interfaces/paper.interface';
import logger from '../utils/logger';

export class PaperService {

  static async createPaper(data: IResearchPaper) {
    try {
      // 1. Save to PostgreSQL (Source of Truth)
      const paper = await prisma.researchPaper.create({
        data: {
          title: data.title,
          abstract: data.abstract,
          authors: data.authors,
          publishedDate: new Date(data.publishedDate),
          category: data.category,
          keywords: data.keywords,
          citationsCount: data.citationsCount,
          price: data.price,
          language: data.language,
          journal: data.journal,
          doi: data.doi,
        },
      });

      // 2. Index in Elasticsearch (Search Layer)
      // Use the Postgres ID to keep them synced
      await ElasticsearchService.indexDocument({
        ...data,
        id: paper.id, 
      } as any);

      logger.info(`Paper created and indexed: ${paper.id}`);
      return paper;
    } catch (error) {
      logger.error('Error in createPaper service:', error);
      throw error;
    }
  }


  static async updatePaper(id: string, data: Partial<IResearchPaper>) {
    try {
      // 1. Update PostgreSQL
      const paper = await prisma.researchPaper.update({
        where: { id },
        data: {
          ...data,
          publishedDate: data.publishedDate ? new Date(data.publishedDate) : undefined,
        } as any,
      });

      // 2. Update Elasticsearch
      await ElasticsearchService.updateDocument(id, data);

      logger.info(`Paper updated in PG and ES: ${id}`);
      return paper;
    } catch (error) {
      logger.error(`Error updating paper ${id}:`, error);
      throw error;
    }
  }


  static async deletePaper(id: string) {
    try {
      // 1. Delete from PostgreSQL
      await prisma.researchPaper.delete({ where: { id } });

      // 2. Delete from Elasticsearch
      await ElasticsearchService.deleteDocument(id);

      logger.info(`Paper deleted from PG and ES: ${id}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error deleting paper ${id}:`, error);
      throw error;
    }
  }

tic async getPaperById(id: string) {
    return await prisma.researchPaper.findUnique({ where: { id } });
  }
}
