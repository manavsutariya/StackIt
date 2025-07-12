// app/api/comments/route.js
import { GET } from '@/features/coreFeatures/comments/server/controllers/getAllComments.controller';
import { POST } from '@/features/coreFeatures/comments/server/controllers/createComment.controller';

export { GET, POST };