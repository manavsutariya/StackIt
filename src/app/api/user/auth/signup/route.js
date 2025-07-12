import signup from "@/features/user/auth/server/controller/signup.controller";

export async function POST(request) {
    return signup(request)
}