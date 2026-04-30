import { Client } from '@elastic/elasticsearch';
import { config } from './index';
import logger from '../utils/logger';

const esClient = new Client({
  node: config.elasticsearch.node,
  auth: {
    username: config.elasticsearch.auth.username,
    password: config.elasticsearch.auth.password,
  },
});

export const checkConnection = async () => {
  try {
    const health = await esClient.cluster.health({});
    logger.info(`Elasticsearch connected: ${health.status}`);
  } catch (error) {
    logger.error('Elasticsearch connection failed', error);
  }
};

export default esClient;
