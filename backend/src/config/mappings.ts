export const paperIndexMapping = {
  settings: {
    analysis: {
      analyzer: {
        autocomplete_analyzer: {
          tokenizer: 'autocomplete_tokenizer',
          filter: ['lowercase'],
        },
        autocomplete_search_analyzer: {
          tokenizer: 'lowercase',
        },
      },
      tokenizer: {
        autocomplete_tokenizer: {
          type: 'edge_ngram',
          min_gram: 2,
          max_gram: 20,
          token_chars: ['letter', 'digit'],
        },
      },
    },
  },
  mappings: {
    properties: {
      title: {
        type: 'text',
        fields: {
          suggest: {
            type: 'text',
            analyzer: 'autocomplete_analyzer',
            search_analyzer: 'autocomplete_search_analyzer',
          },
          keyword: {
            type: 'keyword',
          },
        },
      },
      abstract: {
        type: 'text',
      },
      authors: {
        type: 'keyword', 
      },
      publishedDate: {
        type: 'date',
      },
      category: {
        type: 'keyword',
      },
      keywords: {
        type: 'keyword',
      },
      citationsCount: {
        type: 'integer',
      },
      price: {
        type: 'double',
      },
      language: {
        type: 'keyword',
      },
      journal: {
        type: 'keyword',
      },
      doi: {
        type: 'keyword',
      },
    },
  },
} as const;
