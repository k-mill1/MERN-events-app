import React from "react"
import './App.css'

function Dropdown(props) {
  
  return (
    <div>
      <div className = 'dropdown-container'>
          <div className = 'dropdown-name'>Sort by date:</div>
              <select className = 'dropdown-list' onChange={(e) => props.cSort(e.target.value)} value={props.sort}>
                  <option value={'ascending'}>Oldest to Newest</option>
                  <option value={'descending'}>Newest to Oldest</option>
                  <option value={'unsorted'}>Unsorted</option>
              </select>
      </div>
    </div>
  )
}

export default Dropdown
