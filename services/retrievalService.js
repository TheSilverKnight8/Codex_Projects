const OpenAI = require('openai');

const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);
const shouldUseMock = process.env.USE_MOCK_DATA !== 'false';

const client = hasOpenAIKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function buildMockResponse(task, uploadedFiles) {
  const fileCards = uploadedFiles.map((file, index) => ({
    id: `uploaded-${index + 1}`,
    title: file.originalName,
    sourceLabel: 'Uploaded document',
    snippet: 'Candidate local reference from your uploaded course materials.',
    link: file.url
  }));

  return {
    task,
    mode: 'mock',
    warning:
      'Sources are for guidance. Do not copy responses directly into final coursework. Use your own analysis and writing.',
    sections: {
      bestMatches: [
        {
          title: 'High-priority concept overview',
          sourceLabel: 'System ranking',
          snippet: `Start with an overview related to: ${task}`,
          link: null
        },
        ...fileCards.slice(0, 2)
      ],
      courseMaterials: fileCards.length
        ? fileCards
        : [
            {
              title: 'No uploaded course files yet',
              sourceLabel: 'Local upload adapter',
              snippet: 'Upload lecture notes, slides, or textbook excerpts to enable local retrieval.',
              link: null
            }
          ],
      pastAssignments: [
        {
          title: 'Sample prior assignment draft',
          sourceLabel: 'Mock past assignment index',
          snippet: 'Placeholder for semantic match against previous assignments.',
          link: null
        }
      ],
      onlineSources: [
        {
          title: 'Khan Academy',
          sourceLabel: 'Reputable educational source',
          snippet: 'Use for concept refreshers and practice-oriented explanations.',
          link: 'https://www.khanacademy.org'
        },
        {
          title: 'Encyclopaedia Britannica',
          sourceLabel: 'Reference source',
          snippet: 'Use for historical and factual summaries to anchor your own writing.',
          link: 'https://www.britannica.com'
        }
      ],
      suggestedStudyPlan: [
        'Review top 2 best matches and identify key terms.',
        'Skim relevant course materials and highlight evidence you can cite.',
        'Cross-check with 1-2 online sources for missing context.',
        'Draft your outline or quiz notes in your own words.'
      ]
    },
    adapters: {
      localUploadSearch: 'enabled-mock',
      openAIFileSearch: 'todo',
      openAIWebSearch: 'todo'
    }
  };
}

async function processTask(task, uploadedFiles) {
  if (!client || shouldUseMock) {
    return buildMockResponse(task, uploadedFiles);
  }

  // TODO: Replace this stub with actual vector store creation and file indexing.
  // Expected wiring:
  // 1) Upload files to OpenAI Files API
  // 2) Attach to a vector store for file_search
  // 3) Include vector store IDs in tool resources
  const uploadedSummaries = uploadedFiles.map((file) => `${file.originalName} (${file.mimetype})`);

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    tools: [
      { type: 'web_search_preview' }
      // TODO: Enable file_search once vector store IDs are available.
      // { type: 'file_search', vector_store_ids: ['vs_...'] }
    ],
    input: [
      {
        role: 'system',
        content:
          'You are a study assistant. Return strict JSON with keys: bestMatches, courseMaterials, pastAssignments, onlineSources, suggestedStudyPlan.'
      },
      {
        role: 'user',
        content: `Task: ${task}\nUploaded files: ${uploadedSummaries.join(', ') || 'none'}`
      }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'task_portal_payload',
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            bestMatches: { type: 'array', items: { type: 'object' } },
            courseMaterials: { type: 'array', items: { type: 'object' } },
            pastAssignments: { type: 'array', items: { type: 'object' } },
            onlineSources: { type: 'array', items: { type: 'object' } },
            suggestedStudyPlan: { type: 'array', items: { type: 'string' } }
          },
          required: [
            'bestMatches',
            'courseMaterials',
            'pastAssignments',
            'onlineSources',
            'suggestedStudyPlan'
          ]
        }
      }
    }
  });

  const parsed = JSON.parse(response.output_text || '{}');

  return {
    task,
    mode: 'openai',
    warning:
      'Sources are for guidance. Do not copy responses directly into final coursework. Use your own analysis and writing.',
    sections: parsed,
    adapters: {
      localUploadSearch: uploadedFiles.length ? 'enabled-basic' : 'no-files',
      openAIFileSearch: 'todo',
      openAIWebSearch: 'enabled'
    }
  };
}

module.exports = {
  processTask
};
