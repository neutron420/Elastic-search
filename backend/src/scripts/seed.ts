import { ElasticsearchService } from '../services/elasticsearch.service';
import { PaperService } from '../services/paper.service';
import prisma from '../config/prisma';
import logger from '../utils/logger';

const samplePapers = [
  {
    title: "Attention Is All You Need",
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
    publishedDate: "2017-06-12T00:00:00Z",
    category: "Deep Learning",
    keywords: ["Transformer", "Attention", "NLP"],
    citationsCount: 95000,
    price: 49.99,
    language: "en",
    journal: "NeurIPS",
    doi: "10.48550/arXiv.1706.03762"
  },
  {
    title: "Deep Residual Learning for Image Recognition",
    abstract: "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training...",
    authors: ["Kaiming He", "Xiangyu Zhang", "Shaoqing Ren", "Jian Sun"],
    publishedDate: "2015-12-10T00:00:00Z",
    category: "Computer Vision",
    keywords: ["ResNet", "CNN", "ImageNet"],
    citationsCount: 150000,
    price: 29.99,
    language: "en",
    journal: "CVPR",
    doi: "10.1109/CVPR.2016.90"
  },
  {
    title: "EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks",
    abstract: "Convolutional Neural Networks (CNNs) are commonly developed at a fixed resource budget, and then scaled up...",
    authors: ["Mingxing Tan", "Quoc V. Le"],
    publishedDate: "2019-05-28T00:00:00Z",
    category: "Computer Vision",
    keywords: ["EfficientNet", "Model Scaling", "AutoML"],
    citationsCount: 15000,
    price: 35.00,
    language: "en",
    journal: "ICML",
    doi: "10.48550/arXiv.1905.11946"
  },
  {
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers...",
    authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
    publishedDate: "2018-10-11T00:00:00Z",
    category: "Natural Language Processing",
    keywords: ["BERT", "Transformers", "Pre-training"],
    citationsCount: 80000,
    price: 55.50,
    language: "en",
    journal: "NAACL",
    doi: "10.48550/arXiv.1810.04805"
  },
  {
    title: "Quantum Supremacy Using a Programmable Superconducting Processor",
    abstract: "We report the use of a processor with 53 programmable superconducting qubits to occupy a state space of dimension 2^53...",
    authors: ["Frank Arute", "Kunai Arya", "Ryan Babbush"],
    publishedDate: "2019-10-23T00:00:00Z",
    category: "Quantum Computing",
    keywords: ["Quantum", "Sycamore", "Qubits"],
    citationsCount: 5000,
    price: 120.00,
    language: "en",
    journal: "Nature",
    doi: "10.1038/s41586-019-1666-5"
  },
  {
    title: "Generative Adversarial Nets",
    abstract: "We propose a new framework for estimating generative models via an adversarial process...",
    authors: ["Ian Goodfellow", "Jean Pouget-Abadie", "Mehdi Mirza"],
    publishedDate: "2014-06-10T00:00:00Z",
    category: "Deep Learning",
    keywords: ["GAN", "Generative", "Adversarial"],
    citationsCount: 65000,
    price: 15.99,
    language: "en",
    journal: "NIPS",
    doi: "10.48550/arXiv.1406.2661"
  },
  {
    title: "The Ethics of Artificial Intelligence",
    abstract: "Artificial Intelligence (AI) poses unique ethical challenges, including transparency, bias, and accountability...",
    authors: ["Nick Bostrom", "Eliezer Yudkowsky"],
    publishedDate: "2014-01-01T00:00:00Z",
    category: "AI Ethics",
    keywords: ["Ethics", "Bias", "AI Safety"],
    citationsCount: 12000,
    price: 0.00,
    language: "en",
    journal: "Cambridge University Press",
    doi: "10.1017/CBO9781139046855.020"
  },
  {
    title: "Language Models are Few-Shot Learners",
    abstract: "We train GPT-3, an autoregressive language model with 175 billion parameters, 10x more than any previous model...",
    authors: ["Tom B. Brown", "Benjamin Mann", "Nick Ryder"],
    publishedDate: "2020-05-28T00:00:00Z",
    category: "Natural Language Processing",
    keywords: ["GPT-3", "Language Models", "Zero-shot"],
    citationsCount: 25000,
    price: 89.99,
    language: "en",
    journal: "NeurIPS",
    doi: "10.48550/arXiv.2005.14165"
  },
  {
    title: "Mastering the Game of Go without Human Knowledge",
    abstract: "A long-standing goal of artificial intelligence is an algorithm that learns, tabula rasa, superhuman proficiency in challenging domains...",
    authors: ["David Silver", "Julian Schrittwieser", "Karen Simonyan"],
    publishedDate: "2017-10-18T00:00:00Z",
    category: "Reinforcement Learning",
    keywords: ["AlphaGo Zero", "DeepMind", "Go"],
    citationsCount: 18000,
    price: 45.00,
    language: "en",
    journal: "Nature",
    doi: "10.1038/nature24270"
  },
  {
    title: "AlphaFold: Using AI for Scientific Discovery",
    abstract: "Accurate prediction of protein structures from their amino-acid sequences is a long-standing challenge in biology...",
    authors: ["John Jumper", "Richard Evans", "Alexander Pritzel"],
    publishedDate: "2021-07-15T00:00:00Z",
    category: "Bioinformatics",
    keywords: ["AlphaFold", "Proteins", "Scientific Discovery"],
    citationsCount: 14000,
    price: 199.00,
    language: "en",
    journal: "Nature",
    doi: "10.1038/s41586-021-03819-2"
  },
  {
    title: "Bitcoin: A Peer-to-Peer Electronic Cash System",
    abstract: "A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another...",
    authors: ["Satoshi Nakamoto"],
    publishedDate: "2008-10-31T00:00:00Z",
    category: "Blockchain",
    keywords: ["Bitcoin", "Crypto", "P2P"],
    citationsCount: 22000,
    price: 0.00,
    language: "en",
    journal: "Cryptography Mailing List",
    doi: "10.2139/ssrn.3440801"
  },
  {
    title: "Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing",
    abstract: "We present Resilient Distributed Datasets (RDDs), a distributed memory abstraction that lets programmers perform in-memory computations...",
    authors: ["Matei Zaharia", "Mosharaf Chowdhury", "Tathagata Das"],
    publishedDate: "2012-04-01T00:00:00Z",
    category: "Cloud Computing",
    keywords: ["Spark", "Big Data", "Distributed Computing"],
    citationsCount: 35000,
    price: 65.00,
    language: "en",
    journal: "NSDI",
    doi: "10.5555/2228298.2228301"
  }
];

const seed = async () => {
  try {
    logger.info('Starting massive seed...');

    // 1. Clear existing data in PG
    await prisma.researchPaper.deleteMany({});
    logger.info('Cleared existing PostgreSQL data.');

    // 2. Initialize/Reset ES Index & Alias
    await ElasticsearchService.initIndex();
    
    // 3. Seed to both PG and ES
    for (const paper of samplePapers) {
      await PaperService.createPaper(paper as any);
      logger.info(`Seeded: ${paper.title}`);
    }
    
    logger.info(`Seeding completed! Added ${samplePapers.length} papers to PG and ES.`);
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
