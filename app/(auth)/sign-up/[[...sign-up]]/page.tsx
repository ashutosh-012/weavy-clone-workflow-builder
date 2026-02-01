import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-zinc-900 border border-zinc-800 shadow-xl",
            
            // Header
            headerTitle: "text-zinc-50 font-bold",
            headerSubtitle: "text-zinc-400",
            
            // Form elements
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-medium",
            formFieldLabel: "text-zinc-200 font-medium",
            formFieldInput: "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500",
            formFieldInputShowPasswordButton: "text-zinc-400 hover:text-zinc-300",
            
            // Social buttons
            socialButtonsBlockButton: "bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-750",
            socialButtonsBlockButtonText: "text-zinc-100 font-medium",
            
            // Divider
            dividerLine: "bg-zinc-700",
            dividerText: "text-zinc-500",
            
            // Footer
            footerActionLink: "text-blue-400 hover:text-blue-300 font-medium",
            footerActionText: "text-zinc-400",
            
            // Other elements
            identityPreviewText: "text-zinc-300",
            identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
            formHeaderTitle: "text-zinc-50",
            formHeaderSubtitle: "text-zinc-400",
            
            // OTP/Verification
            otpCodeFieldInput: "bg-zinc-800 border-zinc-700 text-zinc-100",
            
            // Alerts
            alertText: "text-zinc-200",
            
            // Main identifier
            main: "bg-zinc-900",
          },
        }}
      />
    </div>
  )
}