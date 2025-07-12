// app/api/questions/[id]/route.js
import { GET } from '@/features/coreFeatures/questions/server/controllers/getQuestionByID.controller';
import { PUT } from '@/features/coreFeatures/questions/server/controllers/updateQuestionByID.controller';
import { DELETE } from '@/features/coreFeatures/questions/server/controllers/deleteQuestionByID.controller';

export { GET, PUT, DELETE };