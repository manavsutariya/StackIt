// app/api/answers/[id]/route.js
import { GET } from '@/features/coreFeatures/answers/server/controllers/getAnswerById.controller';
import { PUT } from '@/features/coreFeatures/answers/server/controllers/updateAnswerById.controller';
import { DELETE } from '@/features/coreFeatures/answers/server/controllers/deleteAnswerByID.controller';

export { GET, PUT, DELETE };