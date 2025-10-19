"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signIn, signUp } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateSignupData, validateSigninData } from "@/utils/validations";
import Link from "next/link";

export default function AuthForm({ mode = "signin" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { error, isAuthenticated, loading, initialized } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated && initialized) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, initialized, router]);

  // Show loading while checking auth status
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (mode === "signin") {
        const validation = validateSigninData(formData);
        if (!validation.isValid) {
          setErrors(validation.errors);
          setIsLoading(false);
          return;
        }
        
        const result = await dispatch(signIn({
          email: formData.email,
          password: formData.password
        }));
        
        if (signIn.fulfilled.match(result)) {
          // Authentication successful, useEffect will handle redirect
          console.log("Sign in successful");
        }
      } else {
        const validation = validateSignupData(formData);
        if (!validation.isValid) {
          setErrors(validation.errors);
          setIsLoading(false);
          return;
        }
        
        const result = await dispatch(signUp({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }));
        
        if (signUp.fulfilled.match(result)) {
          // Authentication successful, useEffect will handle redirect
          console.log("Sign up successful");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {mode === "signin" ? "Sign in to DentWise" : "Create your account"}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === "signin" 
              ? "Enter your email and password to access your account"
              : "Fill in your details to get started with DentWise"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : (mode === "signin" ? "Sign In" : "Sign Up")}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
