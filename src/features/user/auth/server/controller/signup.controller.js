import asyncHandler from "@/utils/asyncHandler.js";
import responseService from "@/utils/responseService";
import User from "../models/User.model";
import errorService from "@/utils/errorService";
import connectDB from "@/lib/connectDB";

const signup = asyncHandler(async (request) => {
    const { name, email, password } = await request.json();

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        if (!existingUser.isVerified) {
            const error = errorService.createError
                .setErrorType("API_ERROR")
                .setStatus(401)
                .setCode("ACCOUNT_NOT_VERIFIED")
                .setMessage("User already exists. Please complete email verification.")
                .addContext("endPoint", "signup")
                .addContext("method", "POST")
                .addData("isVerified", false)
                .build();

            errorService.throwError(error);
        }

        const error = errorService.createError
            .setErrorType("API_ERROR")
            .setStatus(409)
            .setCode("DUPLICATE_RESOURCE")
            .setMessage("User already exists with this email")
            .addContext("endPoint", "signup")
            .addContext("method", "POST")
            .addData("isUserAlreadyExist", true)
            .build();

        errorService.throwError(error);
    }

    const newUser = new User({
        name,
        email,
        password,
        isVerified: false,
    });

    const savedUser = await newUser.save();

    const responseData = responseService.createResponseData
        .setData({
            success: true,
            successDetails: {
                message: "User created successfully. Please verify your email.",
                data: {
                    user: {
                        _id: savedUser._id,
                        email: savedUser.email,
                        name: savedUser.name
                    }
                }
            },
            errorDetails: {},
        })
        .build();

    return responseService.generateResponse(responseData);
});

export default signup;
