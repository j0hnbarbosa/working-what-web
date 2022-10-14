import React from 'react'

function Dropdown({
  options = [],
  label = "",
  name = ""
}) {
  return (
    <div>
      <label for={name}>{label}</label>
      <select name={name} id={name}>
        {options.map((item) => (
          <option
            key={item.key}
            value={item.value}
          >
            {item.text}
          </option>)
        )}
      </select>
    </div>
  )
}

export default Dropdown