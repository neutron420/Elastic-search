// Elastic APM must be at the very top
import apm from 'elastic-apm-node';
if (process.env.NODE_ENV === 'production') {
  apm.start({
    serviceName: 'research-archive-api',
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    environment: process.env.NODE_ENV
  });
}

import app from './app';
import { config } from './config';
import { checkConnection } from './config/elasticsearch';
import { ElasticsearchService } from './services/elasticsearch.service';
import logger from './utils/logger';

const startServer = async () => {
  try {
    // Check ES connection
    await checkConnection();

    // Initialize ES Index and Mappings with Aliases
    await ElasticsearchService.initIndex();

    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
