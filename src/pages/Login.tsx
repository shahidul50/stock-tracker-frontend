
import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, LockKeyhole, LogIn, Mail, ShieldCheck } from "lucide-react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants/routes"
import { useAuthContext } from "@/context/auth.context"

const loginSchema = z.object({
  email: z.email("Enter a valid email address.").trim(),
  password: z.string().min(8, "Password must be at least 8 characters."),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthContext()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { email: "", password: "" } as LoginFormValues,
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      try {
        await login(value)
        navigate(ROUTES.DASHBOARD, { replace: true })
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Unable to sign in. Please check your credentials.",
        )
      }
    },
  })

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-md">
        <section className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-[0_16px_45px_-28px_rgba(0,80,55,0.45)]">
          <div className="h-1 bg-primary" />
          <div className="px-6 py-8 sm:px-8 sm:py-9">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-md bg-muted shadow-sm">
                <img src="/images/Stack Tracker Logo.png" alt="StockTracker" className="size-8 object-contain" />
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">StockTracker</h1>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-primary dark:text-emerald-400">Inventory management portal</p>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-5 text-muted-foreground">
                Sign in to access your stock management dashboard
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">Login as</span>
                <button
                  type="button"
                  onClick={() => {
                    form.setFieldValue("email", "admin@stocktracker.com")
                    form.setFieldValue("password", "Password123")
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary transition-colors hover:bg-primary/20 dark:text-emerald-400 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 cursor-pointer"
                >
                  Admin
                </button>
              </div>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                event.stopPropagation()
                void form.handleSubmit()
              }}
              className="space-y-5"
            >
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        autoComplete="email"
                        placeholder="admin@stocktracker.co"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        aria-invalid={field.state.meta.errors.length > 0}
                        className="h-9 pl-9"
                      />
                    </div>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="********"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        aria-invalid={field.state.meta.errors.length > 0}
                        className="h-9 pl-9 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              {/* <div className="flex items-center justify-between gap-3 text-xs">
                <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                  <Checkbox aria-label="Remember me" />
                  Remember Me
                </label>
                <Link to="#" className="font-medium text-primary hover:underline">Forgot Password?</Link>
              </div> */}

              {submitError && <p className="text-center text-xs text-destructive" role="alert">{submitError}</p>}

              <Button type="submit" className="h-9 w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={form.state.isSubmitting}>
                {form.state.isSubmitting ? "Signing in..." : "Sign In to Dashboard"}
                {!form.state.isSubmitting && <LogIn className="size-4" />}
              </Button>
            </form>
          </div>
        </section>

        <div className="mt-4 flex items-start gap-3 rounded-lg border border-border/60 bg-muted/70 px-4 py-2.5 text-center text-xs leading-4 text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <span>Restricted Access: Account creation is managed by the system administrator.</span>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
