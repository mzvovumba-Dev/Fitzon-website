import { useState } from 'react'

function Contact() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fitzoneUser')) || null
    } catch {
      return null
    }
  })

  async function handleSubmit(event) {
    event.preventDefault()

    if (loading) return

    setMessage('')
    setLoading(true)

    try {
      const endpoint =
        mode === 'signup'
          ? 'http://localhost:5000/api/auth/register'
          : 'http://localhost:5000/api/auth/login'

      const body =
        mode === 'signup'
          ? { name: name.trim(), email: email.trim(), password }
          : { email: email.trim(), password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setMessage(data.message || `Request failed (${response.status}).`)
        return
      }

      if (mode === 'signup') {
        setMessage('Account created successfully! Please log in.')
        setMode('login')
        setPassword('')
        return
      }

      if (!data.user || !data.token) {
        setMessage('Login response is incomplete. Please try again.')
        return
      }

      localStorage.setItem('fitzoneUser', JSON.stringify(data.user))
      localStorage.setItem('fitzoneToken', data.token)

      setUser(data.user)
      setPassword('')
      setMessage('Welcome to FitZone!')
    } catch (error) {
      console.error('Authentication error:', error)
      setMessage(
        'Could not connect to FitZone. Please make sure the backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('fitzoneUser')
    localStorage.removeItem('fitzoneToken')
    setUser(null)
    setMessage('You have logged out.')
    setMode('login')
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <section
      id="contact"
      className="bg-gray-900 px-6 py-20 text-white"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-semibold uppercase tracking-widest text-orange-400">
          Get In Touch
        </p>

        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
          Contact FitZone
        </h2>

        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-300">
          Ready to start your fitness journey? Get in touch with our team to
          learn more about our classes and training options.
        </p>

        {user ? (
          <div className="mx-auto mt-10 max-w-md rounded-xl bg-gray-800 p-6">
            <h3 className="text-xl font-bold text-orange-400">
              Welcome, {user.name}!
            </h3>

            <p className="mt-2 text-gray-300">{user.email}</p>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 rounded-lg bg-orange-500 px-8 py-3 font-bold text-white hover:bg-orange-600"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-md rounded-xl bg-gray-800 p-6 text-left">
            <div className="mb-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setMessage('')
                }}
                className={`flex-1 rounded-lg px-4 py-3 font-bold ${
                  mode === 'login'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                Log In
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup')
                  setMessage('')
                }}
                className={`flex-1 rounded-lg px-4 py-3 font-bold ${
                  mode === 'signup'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label
                    htmlFor="fitzone-name"
                    className="mb-1 block"
                  >
                    Full name
                  </label>

                  <input
                    id="fitzone-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white"
                    placeholder="Your full name"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="fitzone-email"
                  className="mb-1 block"
                >
                  Email address
                </label>

                <input
                  id="fitzone-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="fitzone-password"
                  className="mb-1 block"
                >
                  Password
                </label>

                <input
                  id="fitzone-password"
                  name="password"
                  type="password"
                  autoComplete={
                    mode === 'signup'
                      ? 'new-password'
                      : 'current-password'
                  }
                  minLength={8}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white"
                  placeholder="At least 8 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-orange-500 px-8 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'signup'
                    ? 'Create Account'
                    : 'Log In'}
              </button>
            </form>
          </div>
        )}

        {message && (
          <p
            role="status"
            aria-live="polite"
            className="mx-auto mt-4 max-w-md text-orange-300"
          >
            {message}
          </p>
        )}

        <div className="mt-8">
          <a
            href="mailto:info@fitzone.co.za"
            className="rounded-lg border border-orange-500 px-8 py-3 font-bold text-white transition hover:bg-orange-600"
          >
            Email Us: info@fitzone.co.za
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact