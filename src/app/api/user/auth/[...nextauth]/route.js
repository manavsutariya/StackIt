import authOptions from "@/features/user/auth/server/controller/authOption.controller";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };