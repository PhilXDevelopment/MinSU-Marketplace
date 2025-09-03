"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { registerUser } from "@/app/actions/user-actions"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    numbers: false,
    match: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const validateEmail = (email: string) => {
    const isValid = email.endsWith("@minsu.edu.ph") || email === ""
    setIsEmailValid(isValid)
    return isValid
  }

  const checkPasswordStrength = (password: string) => {
    const hasMinLength = password.length >= 12
    const hasNumbers = /\d.*\d.*\d/.test(password) // At least 3 numbers
    const passwordsMatch = password === confirmPassword && password !== ""

    setPasswordStrength({
      length: hasMinLength,
      numbers: hasNumbers,
      match: passwordsMatch,
    })

    return hasMinLength && hasNumbers && passwordsMatch
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    if (newEmail) validateEmail(newEmail)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    checkPasswordStrength(newPassword)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value
    setConfirmPassword(newConfirmPassword)
    setPasswordStrength((prev) => ({
      ...prev,
      match: password === newConfirmPassword && password !== "",
    }))
  }

  const handleNextStep = () => {
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Email must be from the @minsu.edu.ph domain",
        variant: "destructive",
      })
      return
    }

    if (!fullName) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name",
        variant: "destructive",
      })
      return
    }

    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!checkPasswordStrength(password)) {
      toast({
        title: "Invalid Password",
        description: "Please ensure your password meets all requirements",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", fullName)
      formData.append("email", email)
      formData.append("password", password)

      const result = await registerUser(formData)

      if (result.success) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created. You can now log in.",
        })
        router.push("/auth/login")
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "An error occurred during registration. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return null // Don't render anything if redirecting
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] pt-16 pb-16">
      <div className="container max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-none shadow-sm">
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-3xl font-bold text-[#004D40]">Create an Account</CardTitle>
              <CardDescription>Join the MinSU community</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-5">
                {step === 1 ? (
                  <>
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Your full name"
                          className="pl-10 rounded-lg"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.name@minsu.edu.ph"
                          className={`pl-10 rounded-lg ${!isEmailValid ? "border-red-500 focus:ring-red-500" : ""}`}
                          value={email}
                          onChange={handleEmailChange}
                          required
                        />
                      </div>
                      {!isEmailValid && (
                        <motion.p
                          className="text-red-500 text-sm mt-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          Email must be from the @minsu.edu.ph domain
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="pt-2"
                    >
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full h-11 bg-[#004D40] hover:bg-[#00352C] rounded-lg"
                      >
                        Continue
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          className="pl-10 pr-10 rounded-lg"
                          value={password}
                          onChange={handlePasswordChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <div className="mt-2 space-y-1">
                        <PasswordStrengthIndicator label="At least 12 characters" isMet={passwordStrength.length} />
                        <PasswordStrengthIndicator label="At least 3 numbers" isMet={passwordStrength.numbers} />
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          className="pl-10 rounded-lg"
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          required
                        />
                      </div>
                      {confirmPassword && !passwordStrength.match && (
                        <motion.p
                          className="text-red-500 text-sm mt-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          Passwords do not match
                        </motion.p>
                      )}
                    </motion.div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1 h-11 rounded-lg"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-11 bg-[#004D40] hover:bg-[#00352C] rounded-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Register"}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-[#004D40] font-medium hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function PasswordStrengthIndicator({ label, isMet }: { label: string; isMet: boolean }) {
  return (
    <div className="flex items-center text-sm">
      {isMet ? (
        <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
      ) : (
        <div className="w-4 h-4 rounded-full mr-2 border border-gray-300" />
      )}
      <span className={isMet ? "text-green-700" : "text-gray-500"}>{label}</span>
    </div>
  )
}
