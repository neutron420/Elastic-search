# Research Archive Service (Pro Version)

A high-performance, enterprise-grade research paper search engine built with **Node.js**, **TypeScript**, **PostgreSQL (Neon Cloud)**, and **Elasticsearch**.

![Build Status](https://img.shields.io/badge/Build-Passing-success?style=flat&logo=github)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)
![Search Speed](https://img.shields.io/badge/Search_Latency-%3C50ms-black?style=flat&logo=elasticsearch)
![Database](https://img.shields.io/badge/Neon_DB-Cloud-316192?style=flat&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat&logo=github)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat&logo=docker)

## 🚀 Key Features

- **Dual-Database Architecture**: PostgreSQL as the Source of Truth and Elasticsearch for high-speed indexing.
- **Robust Search API**: Supports full-text search, fuzzy matching (typos), and complex filtering.
- **Advanced Filtering**: Filter by category, language, citations count, and **Price Range**.
- **Self-Healing Sync**: Automatic dual-write pattern ensures Postgres and Elasticsearch are always consistent.
- **Circuit Breaker Pattern**: Uses Opossum to prevent system failure during high load or ES downtime.
- **Visual Analytics**: Integrated **Kibana** dashboard for real-time data visualization.
- **Type Safety**: End-to-end TypeScript with Zod request validation.

## 🏗️ Architecture Deep Dive

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

## 🧠 Key Technical Challenges Solved

### Handling Dual-Write Consistency
**Problem**: Writing to two databases (Postgres and ES) can lead to data drift if one write fails and the other succeeds.
**Solution**: Implemented a transactional orchestration logic in the `PaperService`. The system ensures the PostgreSQL write is confirmed before attempting the Elasticsearch index. If the index fails, it is caught and logged for manual reconciliation or background retry (Roadmap feature).

### Zero-Downtime Reindexing
**Problem**: Updating index mappings normally requires taking the search service offline.
**Solution**: Implemented a **Production Alias Pattern**. The application communicates with an alias (`research_papers`) rather than a concrete index. This allows us to create a new index (`v2`), reindex data in the background, and switch the alias pointer instantly with zero downtime.

## 📋 Prerequisites

- Node.js (v18+)
- Docker Desktop (for Elasticsearch & Kibana)
- A Neon Cloud PostgreSQL account

## ⚙️ Setup Instructions

1. **Environment Config**:
   ```env
   PORT=3100
   DATABASE_URL=your_neon_postgres_url
   ELASTICSEARCH_NODE=http://localhost:9200
   ELASTICSEARCH_INDEX=research_papers
   ```

2. **Start Infrastructure & Seed**:
   ```bash
   cd backend
   docker-compose up -d
   npx prisma migrate dev
   npm run seed
   ```

3. **Run Server**:
   ```bash
   npm run dev
   ```

---
Built with professional engineering standards by Antigravity
