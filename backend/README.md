# Research Archive Service (Pro Version)

A high-performance, enterprise-grade research paper search engine built with **Node.js**, **TypeScript**, **PostgreSQL (Neon Cloud)**, and **Elasticsearch**.

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/elasticsearch-%23005571.svg?style=for-the-badge&logo=elasticsearch&logoColor=white)
![Kibana](https://img.shields.io/badge/Kibana-005571?style=for-the-badge&logo=Kibana&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Key Features

- **Dual-Database Architecture**: PostgreSQL as the Source of Truth and Elasticsearch for high-speed indexing.
- **Robust Search API**: Supports full-text search, fuzzy matching (typos), and complex filtering.
- **Advanced Filtering**: Filter by category, language, citations count, and **Price Range**.
- **Self-Healing Sync**: Automatic dual-write pattern ensures Postgres and Elasticsearch are always consistent.
- **Circuit Breaker Pattern**: Uses Opossum to prevent system failure during high load or ES downtime.
- **Visual Analytics**: Integrated **Kibana** dashboard for real-time data visualization.
- **Type Safety**: End-to-end TypeScript with Zod request validation.

## Architecture Deep Dive

This system implements the **Polyglot Persistence** pattern to leverage the strengths of different database technologies:

### 1. The Source of Truth (PostgreSQL)
All research paper data is stored in a relational PostgreSQL database hosted on Neon Cloud. Using **Prisma ORM**, we ensure strict schema enforcement and data integrity. This layer is responsible for the permanent storage of all academic records and metadata.

### 2. The Search Layer (Elasticsearch)
Search queries are offloaded to Elasticsearch, a distributed search engine that uses an inverted index. This allows for:
- **Fuzzy Matching**: Handling user typos gracefully.
- **Relevance Scoring**: Ranking papers based on keyword frequency and field weights (e.g., Title has a higher weight than Abstract).
- **Scalability**: Decoupling search from the primary database allows for sub-millisecond response times even with millions of records.

### 3. The Orchestration Layer (Node.js)
The backend service coordinates data flow. Every "Write" operation follows a "Save-then-Index" strategy: data is committed to PostgreSQL first, and only upon success is it indexed into Elasticsearch. This ensures that the search engine never contains orphaned data that doesn't exist in the primary database.

## Operational Observability

### Kibana Dashboard
The integrated Kibana instance provides a professional interface for data monitoring:
- **Index Management**: View the physical storage (`v1` index) and the logical pointer (alias).
- **Discover**: Real-time exploration of the research dataset.
- **Visualizations**: Create custom charts for citation trends or price distributions.

### Centralized Logging
Logs are managed via **Winston** and stored in the `logs/` directory:
- `error.log`: Critical failures and system crashes.
- `combined.log`: General request logs and database synchronization events.

## Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Primary DB**: PostgreSQL (via Prisma ORM)
- **Search Engine**: Elasticsearch 8.12
- **Visualization**: Kibana 8.12
- **Validation**: Zod
- **Resilience**: Opossum (Circuit Breaker)
- **Logging**: Winston

## Setup Instructions

1. **Environment Config**:
   Create a `.env` file in the root:
   ```env
   PORT=3100
   NODE_ENV=development
   DATABASE_URL=your_neon_postgres_url
   ELASTICSEARCH_NODE=http://localhost:9200
   ELASTICSEARCH_INDEX=research_papers
   JWT_SECRET=your_super_secret_key
   ```

2. **Start Infrastructure**:
   ```bash
   docker-compose up -d
   ```

3. **Database Migration**:
   ```bash
   npx prisma migrate dev
   ```

4. **Seed the Massive Data Set**:
   ```bash
   npm run seed
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```

## 📡 API Documentation

### Search Papers
`GET /api/papers/search`

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `q` | string | Full-text search query (supports typos!) |
| `category` | string | Filter by category |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `minCitations` | number | Minimum citations filter |
| `sortBy` | string | `relevance`, `date`, `citations`, `price` |
| `sortOrder` | string | `asc` or `desc` |

**Example**:
```bash
curl "http://localhost:3100/api/papers/search?q=Attention&minPrice=10&maxPrice=100&sortBy=citations"
```

---
Built with professional standards by Antigravity
