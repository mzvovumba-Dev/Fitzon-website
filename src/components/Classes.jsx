import { useEffect, useState } from 'react'
import strengthImage from '../../images/strength.jpg'
import yogaImage from '../../images/yoga.jpg'
import hiitImage from '../../images/HIIT.jpg'
import pilatesImage from '../../images/pilates.jpg'
import Rating from './Rating'

const classImages = {
  1: strengthImage,
  2: yogaImage,
  3: hiitImage,
  4: pilatesImage,
}

function Classes() {
  const [classes, setClasses] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [ratings, setRatings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = ['All', 'Strength', 'Cardio', 'Mind & Body']

  useEffect(() => {
    async function fetchClasses() {
      try {
        const response = await fetch('http://localhost:5000/api/classes')

        if (!response.ok) {
          throw new Error('Could not load fitness classes.')
        }

        const data = await response.json()

        setClasses(
          data.map((fitnessClass) => ({
            ...fitnessClass,
            image: classImages[fitnessClass.id],
          })),
        )
      } catch (err) {
        console.error('Error loading classes:', err)
        setError('Unable to load fitness classes. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

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

        {loading && (
          <p className="text-center text-gray-600">
            Loading fitness classes...
          </p>
        )}

        {error && (
          <p role="alert" className="text-center text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && (
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
        )}

        {!loading && !error && filteredClasses.length === 0 && (
          <p className="text-center text-gray-600">
            No classes found in this category.
          </p>
        )}
      </div>
    </section>
  )
}

export default Classes