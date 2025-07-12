// app/api/questions/route.js

import { GET } from '@/features/coreFeatures/questions/server/controllers/getAllQuestions.controller';
import { POST } from '@/features/coreFeatures/questions/server/controllers/createQuestion.controller';

export { GET, POST };