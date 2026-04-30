import esClient from '../config/elasticsearch';
import { config } from '../config';
import { paperIndexMapping } from '../config/mappings';
import type { IResearchPaper, SearchQuery } from '../interfaces/paper.interface';
import logger from '../utils/logger';
import CircuitBreaker from 'opossum';

const ALIAS_NAME = config.elasticsearch.index;
const INDEX_NAME_V1 = `${ALIAS_NAME}_v1`;

const breakerOptions = {
  timeout: 5000, // 5 seconds
  errorThresholdPercentage: 50,
  resetTimeout: 30000, // 30 seconds
};

export class ElasticsearchService {
  private static breaker = new CircuitBreaker(async (action: Function) => {
    return await action();
  }, breakerOptions);

  static {
    this.breaker.on('open', () => logger.warn('Circuit Breaker OPEN: Elasticsearch is struggling.'));
    this.breaker.on('halfOpen', () => logger.info('Circuit Breaker HALF_OPEN: Testing Elasticsearch...'));
    this.breaker.on('close', () => logger.info('Circuit Breaker CLOSED: Elasticsearch is healthy.'));
    this.breaker.fallback(() => ({ 
      error: 'Search service is currently degraded. Please try again later.',
      results: [],
      total: 0 
    }));
  }

  /**
   * Initialize Index with Aliases (Robust Production Version)
   */
  static async initIndex() {
    try {
      // 1. Check if the physical index exists
      const indexExists = await esClient.indices.exists({ index: INDEX_NAME_V1 });
      if (!indexExists) {
        await esClient.indices.create({
          index: INDEX_NAME_V1,
          ...(paperIndexMapping as any),
        });
        logger.info(`Physical index ${INDEX_NAME_V1} created.`);
      }

      // 2. Check if ALIAS_NAME is accidentally a concrete index
      const aliasIsIndex = await esClient.indices.exists({ index: ALIAS_NAME });
      const aliasInfo = await esClient.indices.getAlias({ name: ALIAS_NAME }).catch(() => null);

      // If it exists as an index but NOT as an alias, we must delete the index to make room for the alias
      if (aliasIsIndex && !aliasInfo) {
        logger.warn(`Deleting concrete index '${ALIAS_NAME}' to make room for Alias.`);
        await esClient.indices.delete({ index: ALIAS_NAME });
      }

      // 3. Ensure the Alias is pointing to our V1 index
      await esClient.indices.putAlias({
        index: INDEX_NAME_V1,
        name: ALIAS_NAME,
      });
      
      logger.info(`Alias ${ALIAS_NAME} is now correctly pointing to ${INDEX_NAME_V1}.`);
    } catch (error) {
      logger.error('Error in initIndex:', error);
      throw error;
    }
  }

  static async indexDocument(paper: IResearchPaper) {
    return this.breaker.fire(async () => {
      const response = await esClient.index({
        index: ALIAS_NAME, // Always use alias
        id: paper.id, // Use the ID from PG
        document: paper,
        refresh: 'wait_for',
      });
      return response;
    });
  }

  static async updateDocument(id: string, paper: Partial<IResearchPaper>) {
    return this.breaker.fire(async () => {
      return await esClient.update({
        index: ALIAS_NAME,
        id,
        doc: paper,
        refresh: 'wait_for',
      });
    });
  }

  static async deleteDocument(id: string) {
    return this.breaker.fire(async () => {
      return await esClient.delete({
        index: ALIAS_NAME,
        id,
        refresh: 'wait_for',
      });
    });
  }

  static async search(query: SearchQuery) {
    return this.breaker.fire(async () => {
      const {
        q,
        category,
        minCitations,
        minPrice,
        maxPrice,
        language,
        sortBy = 'relevance',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
      } = query;

      const from = (page - 1) * limit;
      const must: any[] = [];
      const filter: any[] = [];

      if (q) {
        must.push({
          multi_match: {
            query: q,
            fields: ['title^3', 'abstract', 'authors^2', 'keywords'],
            fuzziness: 'AUTO',
          },
        });
      } else {
        must.push({ match_all: {} });
      }

      if (category) filter.push({ term: { category } });
      if (language) filter.push({ term: { language } });
      if (minCitations) filter.push({ range: { citationsCount: { gte: minCitations } } });
      
      if (minPrice !== undefined || maxPrice !== undefined) {
        const priceRange: any = {};
        if (minPrice !== undefined) priceRange.gte = minPrice;
        if (maxPrice !== undefined) priceRange.lte = maxPrice;
        filter.push({ range: { price: priceRange } });
      }

      let sort: any = [];
      if (sortBy === 'date') sort.push({ publishedDate: { order: sortOrder } });
      else if (sortBy === 'citations') sort.push({ citationsCount: { order: sortOrder } });
      else if (sortBy === 'price') sort.push({ price: { order: sortOrder } });
      else sort.push({ _score: { order: 'desc' } });

      const response = await esClient.search({
        index: ALIAS_NAME, 
        from,
        size: limit,
        query: { bool: { must, filter } },
        sort,
        aggs: {
          categories: { terms: { field: 'category' } },
          languages: { terms: { field: 'language' } },
        },
      });

      return {
        total: (response.hits.total as any).value,
        results: response.hits.hits.map((hit) => ({
          id: hit._id,
          ...(hit._source as IResearchPaper),
          score: hit._score,
        })),
        aggregations: response.aggregations,
      };
    });
  }

  static async suggest(text: string) {
    return this.breaker.fire(async () => {
      const response = await esClient.search({
        index: ALIAS_NAME,
        query: {
          match: {
            'title.suggest': {
              query: text,
              analyzer: 'autocomplete_search_analyzer',
            },
          },
        },
        _source: ['title'],
        size: 5,
      });
      return response.hits.hits.map((hit: any) => hit._source.title);
    });
  }
}
