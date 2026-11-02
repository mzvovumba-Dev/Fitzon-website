import heroImage from '../../images/home.jpg'

function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[500px] items-center bg-gray-900 px-6 py-20 text-white md:min-h-[600px]"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="mb-4 font-semibold uppercase tracking-[0.25em] text-orange-400">
          Welcome to FitZone
        </p>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl md:text-7xl">
          Transform Your Body.
          <span className="block text-orange-400">
            Transform Your Life.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-200">
          Build strength, improve your fitness, and reach your goals with
          expert trainers and classes designed for you.
        </p>

        <a
          href="#classes"
          className="mt-8 inline-block rounded-lg bg-orange-500 px-8 py-3 font-bold text-white transition hover:bg-orange-600"
        >
          Explore Our Classes
        </a>
      </div>
    </section>
  )
}

export default Hero