import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { firebaseAuth, isFirebaseConfigured } from '../services/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(Boolean(firebaseAuth))

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthLoading(false)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      if (nextUser) {
        setUser({ uid: nextUser.uid, email: nextUser.email })
      } else {
        setUser(null)
      }
      setAuthLoading(false)
    })

    return unsubscribe
  }, [])

  const loginWithEmailPassword = async (email, password) => {
    if (firebaseAuth) {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password)
      const nextUser = credential.user
      setUser({ uid: nextUser.uid, email: nextUser.email })
      return { ok: true, user: nextUser }
    }

    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    setUser({ uid: 'local-admin', email })
    return { ok: true, user: { uid: 'local-admin', email } }
  }

  const logout = async () => {
    if (firebaseAuth) {
      await signOut(firebaseAuth)
      return
    }

    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      authLoading,
      isAuthenticated: Boolean(user),
      authProvider: isFirebaseConfigured ? 'firebase' : 'local-fallback',
      login: (nextUser) => setUser(nextUser),
      loginWithEmailPassword,
      logout,
    }),
    [user, authLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
