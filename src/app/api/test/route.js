// app/api/user/profile/route.js
import signupContoller from '@/features/user/auth/server/controllers/signup.controller';

export async function GET(request) {
    return signupContoller(request);
}
