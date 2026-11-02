function Rating({ value, onChange }) {
  return (
    <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
      <span>Your rating:</span>

      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2"
      >
        <option value={1}>1 star</option>
        <option value={2}>2 stars</option>
        <option value={3}>3 stars</option>
        <option value={4}>4 stars</option>
        <option value={5}>5 stars</option>
      </select>
    </label>
  )
}

export default Rating