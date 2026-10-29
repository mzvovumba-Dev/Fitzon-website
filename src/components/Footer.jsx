function Footer() {
  return (
    <footer className="bg-gray-900 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div>
          <a
            href="#home"
            className="text-2xl font-extrabold text-orange-400"
          >
            FitZone
          </a>

          <p className="mt-2 text-sm text-gray-400">
            Stronger every day. Healthier for life.
          </p>
        </div>

        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} FitZone. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer