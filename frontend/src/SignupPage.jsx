import React from 'react'
import { SignUp } from "@clerk/clerk-react";

const SignupPage = () => {
  return (
    <div>SignupPage
        <SignUp routing="path" path="/signup" signInUrl="/login" />
    </div>
  )
}

export default SignupPage