"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Shield } from "lucide-react";
import { useEffect } from "react";
import { useOtpVerification } from "../hooks/useOtpVerification";
import { useSearchParams, useRouter } from "next/navigation";

export default function OtpVerification() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from"); 

  const backLink = from === "forgot-password" ? "/forgot-password" : "/signup";

  const {
    otp,
    isLoading,
    message,
    canResend,
    resendTimer,
    isBlocked,
    handleOtpChange,
    handleKeyDown,
    handleVerify,
    handleResend,
    startResendTimer
  } = useOtpVerification();

  useEffect(() => {
    // Start timer on component mount
    startResendTimer();
  }, [startResendTimer]);

  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <Card className="w-full max-w-md shadow-lg border-0 ring-1 ring-red-100">
          <CardHeader className="text-center pb-4">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold text-red-900">Account Temporarily Blocked</CardTitle>
            <CardDescription className="text-red-600">
              Too many failed verification attempts
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert className="border-l-4 border-red-500 bg-red-50">
              <AlertDescription className="text-red-800">
                Your account has been temporarily blocked due to multiple failed verification attempts.
                Please try again after 1 hour for security reasons.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <Clock className="h-5 w-5" />
              <span className="font-medium">Come back after 1 hour</span>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Need help?{' '}
                <a href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contact Support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md shadow-lg border-0 ring-1 ring-blue-100">
        <CardHeader className="text-center pb-4">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">Verify Your Email</CardTitle>
          <CardDescription className="text-gray-600">
            We've sent a 6-digit verification code to your email address
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Success/Error Message */}
          {message && (
            <Alert className={`border-l-4 ${message.includes('successfully') ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <AlertDescription className={message.includes('successfully') ? 'text-green-800' : 'text-red-800'}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          {/* OTP Input Fields */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 text-center">
              Enter verification code
            </p>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <Button
            type="button"
            onClick={handleVerify}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            disabled={isLoading || otp.join('').length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>

          {/* Resend Section */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Didn't receive the code?
            </p>

            {canResend ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={isLoading}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                {isLoading ? 'Sending...' : 'Resend Code'}
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  Resend in {resendTimer} seconds
                </span>
              </div>
            )}
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Wrong email?{' '}
              <a href={backLink} className="text-blue-600 hover:text-blue-700 font-medium">
                Go back
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}