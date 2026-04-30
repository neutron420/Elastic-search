# Research Archive Service (Pro Version)

A high-performance, enterprise-grade research paper search engine built with Node.js, TypeScript, PostgreSQL (Neon Cloud), and Elasticsearch.

![Build Status](https://img.shields.io/badge/Build-Passing-success?style=flat&logo=github)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)
![Search Speed](https://img.shields.io/badge/Search_Latency-%3C50ms-black?style=flat&logo=elasticsearch)
![Database](https://img.shields.io/badge/Neon_DB-Cloud-316192?style=flat&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat&logo=github)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat&logo=docker)

## Core Functional Overview

### What It Does
The Research Archive Service provides a centralized platform for indexing, storing, and retrieving academic research papers with sub-millisecond precision. It allows users to perform complex full-text searches across large datasets, handle typographical errors through fuzzy matching, and filter results by metadata such as category, publication date, citation metrics, and financial pricing. The system is designed to provide a "Google-like" search experience for specialized academic content.

### How It Works
The system operates as a distributed service that synchronizes data across a relational database and an inverted-index search engine. When a paper is submitted, the application first commits the record to a PostgreSQL instance on Neon Cloud to ensure ACID-compliant persistence. Simultaneously, the record is pushed to an Elasticsearch cluster where it is analyzed and indexed. The backend utilizes a service-oriented architecture to orchestrate these writes, ensuring that any discrepancies between the two data stores are minimized through strict error handling and transactional logic.

### Why It Was Built
This architecture was selected to solve the "Search vs. Scale" problem inherent in traditional relational databases. While PostgreSQL is excellent for maintaining relationships and data integrity, it is not optimized for complex, high-speed text retrieval. By offloading the search burden to Elasticsearch, the system maintains high performance even as the dataset grows into the millions. The inclusion of a Circuit Breaker pattern ensures that the application remains resilient; if the search engine becomes unavailable, the primary database remains functional, preventing total system downtime.

## Key Technical Implementation Details

- **Polyglot Persistence**: Leveraging PostgreSQL for relational integrity and Elasticsearch for full-text search capabilities.
- **Service Orchestration**: A clean separation of concerns where the service layer manages the synchronization between disparate data sources.
- **Zero-Downtime Indexing**: Utilizing the Production Alias Pattern to allow for index maintenance and mapping updates without service interruption.
- **Data Observability**: Integrated Kibana dashboards provide real-time visibility into index health, document distribution, and search performance.

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Primary Storage**: PostgreSQL (Neon Cloud)
- **Search & Analytics**: Elasticsearch & Kibana 8.12
- **Resilience**: Opossum Circuit Breaker
- **Logging**: Winston Structured Logging

## Setup and Installation

1. **Environment Configuration**:
   Create a `.env` file in the root with the following variables:
   ```env
   PORT=3100
   DATABASE_URL=your_neon_postgres_url
   ELASTICSEARCH_NODE=http://localhost:9200
   ELASTICSEARCH_INDEX=research_papers
   ```

2. **Infrastructure Initialization**:
   ```bash
   cd backend
   docker-compose up -d
   npx prisma migrate dev
   npm run seed
   ```

3. **Execution**:
   ```bash
   npm run dev
   ```

## API Documentation

### Search Endpoint
`GET /api/papers/search`

Provides comprehensive search capabilities including fuzzy matching, range filtering (price and citations), and multi-field sorting.

**Parameters**: `q`, `category`, `minPrice`, `maxPrice`, `minCitations`, `sortBy`, `sortOrder`.

---
Final Production Release
