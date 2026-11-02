function Contact() {
  return (
    <section id="contact" className="bg-gray-900 px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-semibold uppercase tracking-widest text-orange-400">Get In Touch</p>
        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Contact FitZone</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-300">
          Ready to start your fitness journey? Get in touch with our team to learn more about our classes and training options.
        </p>
        <div className="mt-8">
          <a href="mailto:info@fitzone.co.za" className="rounded-lg border border-orange-500 px-8 py-3 font-bold text-white transition hover:bg-orange-600">
            Email Us: info@fitzone.co.za
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact
