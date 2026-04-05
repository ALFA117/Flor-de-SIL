import { useState } from 'react'

export default function FloresInput({ flores, onChange }) {
  const [input, setInput] = useState('')

  const addFlor = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    if (!flores.includes(trimmed)) {
      onChange([...flores, trimmed])
    }
    setInput('')
  }

  const removeFlor = (flor) => {
    onChange(flores.filter((f) => f !== flor))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addFlor()
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ej: Rosas rojas"
          className="flex-1 border border-crema-oscura rounded-lg px-3 py-2 text-sm font-lato
                     bg-crema focus:outline-none focus:ring-2 focus:ring-cafe-claro"
        />
        <button
          type="button"
          onClick={addFlor}
          className="bg-cafe-medio hover:bg-cafe-oscuro text-crema font-bold px-4 py-2
                     rounded-lg transition-colors duration-200 text-sm"
        >
          +
        </button>
      </div>

      {flores.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {flores.map((flor) => (
            <span
              key={flor}
              className="inline-flex items-center gap-1 bg-crema-oscura text-cafe-oscuro
                         text-sm font-lato px-3 py-1.5 rounded-full"
            >
              🌸 {flor}
              <button
                type="button"
                onClick={() => removeFlor(flor)}
                className="ml-1 text-cafe-medio hover:text-red-500 transition-colors font-bold"
                aria-label={`Eliminar ${flor}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {flores.length === 0 && (
        <p className="text-xs text-cafe-claro font-lato">Agrega al menos una flor.</p>
      )}
    </div>
  )
}
