import alexImage from '../../images/alex.jpg'
import davidImage from '../../images/david.jpg'
import sarahImage from '../../images/sarah.jpg'

const trainers = [
  {
    id: 1,
    name: 'Alex',
    specialty: 'Strength Training',
    image: alexImage,
  },
  {
    id: 2,
    name: 'David',
    specialty: 'Fitness & Conditioning',
    image: davidImage,
  },
  {
    id: 3,
    name: 'Sarah',
    specialty: 'Yoga & Flexibility',
    image: sarahImage,
  },
]

function Trainers() {
  return (
    <section id="trainers" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-widest text-orange-500">
            Meet Our Team
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Expert Trainers
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Meet our dedicated trainers who will help you improve your fitness
            and reach your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer) => (
            <article
              key={trainer.id}
              className="overflow-hidden rounded-xl bg-gray-50 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={trainer.image}
                alt={trainer.name}
                className="h-72 w-full object-cover"
              />

              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {trainer.name}
                </h3>

                <p className="mt-2 font-medium text-orange-500">
                  {trainer.specialty}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Trainers