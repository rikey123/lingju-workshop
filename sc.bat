  mkdir -p reference/01-editor-format \
           reference/02-orchestration \
           reference/03-memory-knowledge \
           reference/04-export-validation \
           reference/05-downstream-media \
           reference/99-not-selected

  git clone git@github.com:trelby/trelby.git reference/01-editor-format/trelby
  git clone git@github.com:wonderunit/storyboarder.git reference/01-editor-format/storyboarder

  git clone git@github.com:langchain-ai/langgraph.git reference/02-orchestration/langgraph
  git clone git@github.com:microsoft/autogen.git reference/02-orchestration/autogen
  git clone git@github.com:crewAIInc/crewAI.git reference/02-orchestration/crewAI
  git clone git@github.com:langgenius/dify.git reference/02-orchestration/dify
  git clone git@github.com:FlowiseAI/Flowise.git reference/02-orchestration/Flowise

  git clone git@github.com:mem0ai/mem0.git reference/03-memory-knowledge/mem0
  git clone git@github.com:microsoft/graphrag.git reference/03-memory-knowledge/graphrag
  git clone git@github.com:getzep/zep.git reference/03-memory-knowledge/zep