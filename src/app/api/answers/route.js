// app/api/answers/route.js
import { GET } from '@/features/coreFeatures/answers/server/controllers/getAllAnswers.controller';
import { POST } from '@/features/coreFeatures/answers/server/controllers/createAnswer.controller';

export { GET, POST };