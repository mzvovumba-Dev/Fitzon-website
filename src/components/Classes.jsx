import { useState } from 'react'
import classes from '../data/classes'
import Rating from './Rating'

function Classes() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [ratings, setRatings] = useState({})

  const categories = ['All', 'Strength', 'Cardio', 'Mind & Body']

  const filteredClasses =
    selectedCategory === 'All'
      ? classes
      : classes.filter(
          (fitnessClass) => fitnessClass.category === selectedCategory,
        )

  function handleRatingChange(classId, rating) {
    setRatings((currentRatings) => ({
      ...currentRatings,
      [classId]: rating,
    }))
  }

  return (
    <section id="classes" className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="font-semibold uppercase tracking-widest text-orange-500">
            Find Your Workout
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Fitness Classes
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Discover a class that matches your goals, challenge yourself, and
            enjoy your fitness journey.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 font-semibold transition ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-orange-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredClasses.map((fitnessClass) => (
            <article
              key={fitnessClass.id}
              className="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={fitnessClass.image}
                alt={fitnessClass.name}
                className="h-52 w-full object-cover"
              />

              <div className="p-6">
                <span className="text-sm font-semibold text-orange-500">
                  {fitnessClass.category}
                </span>

                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  {fitnessClass.name}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {fitnessClass.description}
                </p>

                <Rating
                  value={ratings[fitnessClass.id] ?? 5}
                  onChange={(rating) =>
                    handleRatingChange(fitnessClass.id, rating)
                  }
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Classes