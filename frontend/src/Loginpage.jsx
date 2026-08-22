// import React from 'react'
// import { SignIn } from '@clerk/clerk-react'

// const Loginpage = () => {
//   return (
//     <div>Loginpage
//         <SignIn routing='path' path='/login' signUpUrl='/signup'/>
//     </div>
//   )
// }

// export default Loginpage
import React from "react";
import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      {/* Clerk ka asli login box yahan bitha diya */}
      <SignIn routing="path" path="/login" signUpUrl="/signup" />
    </div>
  );
};

export default LoginPage;
