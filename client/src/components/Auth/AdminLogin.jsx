import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContainer from './AuthContainer'
import { useAuth } from '../../store/AuthContext'
import { APP_ROUTES } from '../../lib/appRoutes'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { loginWithEmailPassword, authProvider } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await loginWithEmailPassword(email.trim(), password)
      navigate(APP_ROUTES.admin)
    } catch (err) {
      const errorCode = err?.code || ''
      if (errorCode === 'auth/configuration-not-found' || errorCode === 'auth/operation-not-allowed') {
        setError('Firebase Auth is not enabled for this project. Turn on Email/Password sign-in in Firebase Console, or use the fallback local admin login.')
      } else if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
        setError('Wrong email or password for the Firebase Auth user. If needed, reset the password in Firebase Console and try again.')
      } else {
        setError(err?.message || 'Unable to sign in. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <AuthContainer>
        <form className="auth-form glass-frame" onSubmit={handleSubmit}>
          <h2>Admin Login</h2>
          <p className="auth-subtitle">
            {authProvider === 'firebase'
              ? 'Sign in with your Firebase admin account.'
              : 'Firebase Auth is unavailable right now. Local fallback login is active.'}
          </p>

          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
            <button type="button" className="secondary-button" onClick={() => navigate('/')}>
              Back to site
            </button>
          </div>
        </form>
      </AuthContainer>
    </div>
  )
}

export default AdminLogin
