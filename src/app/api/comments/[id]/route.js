// app/api/comments/[id]/route.js
import { GET } from '@/features/coreFeatures/comments/server/controllers/getCommentByID.controller';
import { PUT } from '@/features/coreFeatures/comments/server/controllers/updareCommentByID.controller';
import { DELETE } from '@/features/coreFeatures/comments/server/controllers/deleterCommentByID.controller';

export { GET, PUT, DELETE };