import { useEffect, useState } from 'react'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

function PaymentSuccess() {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function checkPayment() {
      setLoading(true)
      setMessage('')
      setOrder(null)

      const sessionId = new URLSearchParams(
        window.location.search
      ).get('session_id')

      const token = localStorage.getItem('fitzoneToken')

      if (!sessionId) {
        setMessage('We could not find your payment reference.')
        setLoading(false)
        return
      }

      if (!token) {
        setMessage('Please log in again to check your payment.')
        setLoading(false)
        return
      }

      try {
        for (let attempt = 0; attempt < 10; attempt++) {
          const response = await fetch(
            `${API_URL}/api/orders/session/${encodeURIComponent(sessionId)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          const data = await response.json()

          if (cancelled) return

          if (response.ok && data.order?.status === 'paid') {
            setOrder(data.order)
            setLoading(false)
            return
          }

          if (response.status !== 404) {
            throw new Error(
              data.message || 'Unable to check your payment.'
            )
          }

          await new Promise((resolve) => setTimeout(resolve, 2000))

          if (cancelled) return
        }

        setMessage(
          'Your payment is still being confirmed. Please try again shortly.'
        )
      } catch (error) {
        if (!cancelled) {
          setMessage(error.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    checkPayment()

    return () => {
      cancelled = true
    }
  }, [retry])

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-16">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg">
        {loading && (
          <>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Checking your payment...
            </h1>

            <p className="mt-4 text-gray-600">
              Please wait while FITZONE confirms your order.
            </p>
          </>
        )}

        {!loading && order && (
          <>
            <div className="text-6xl">✓</div>

            <h1 className="mt-4 text-3xl font-extrabold text-green-600">
              Payment Successful!
            </h1>

            <p className="mt-4 text-gray-600">
              Thank you for joining FITZONE. Your payment has been confirmed.
            </p>

            <div className="mt-8 rounded-xl bg-gray-100 p-5 text-left">
              <p className="font-semibold text-gray-800">
                Membership: {order.membership_name}
              </p>

              <p className="mt-2 text-gray-700">
                Amount: R
                {(order.total_amount_cents / 100).toFixed(2)}
              </p>

              <p className="mt-2 text-gray-700">
                Order number: {order.id}
              </p>

              <p className="mt-2 text-green-600 font-bold">
                Status: {order.status}
              </p>
            </div>

            <button
              onClick={() => {
                window.location.hash = 'dashboard'
              }}
              className="mt-8 w-full rounded-lg bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
            >
              Go to Dashboard
            </button>
          </>
        )}

        {!loading && !order && (
          <>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Payment Confirmation
            </h1>

            <p className="mt-4 text-orange-600">
              {message}
            </p>

            <button
              onClick={() => setRetry((previous) => previous + 1)}
              className="mt-8 rounded-lg bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
            >
              Check Again
            </button>
          </>
        )}
      </section>
    </main>
  )
}

export default PaymentSuccess