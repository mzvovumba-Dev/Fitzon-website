function About() {
  return (
    <section id="about" className="bg-gray-100 px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-semibold uppercase tracking-widest text-orange-500">
          About FitZone
        </p>

        <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Your Fitness Journey Starts Here
        </h2>

        <p className="mx-auto mt-6 max-w-3xl leading-relaxed text-gray-600">
          FitZone is dedicated to helping people build strength, improve
          flexibility, and develop healthier lifestyles. Our fitness classes
          and dedicated trainers provide a welcoming environment where you
          can work toward your personal goals.
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

export default About