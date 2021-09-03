import {useEffect, useState} from "react"

export function Async() {
  const [isButtonInvisable, setIsButtonInvisable] = useState(false)
  useEffect(() => {
    setTimeout(() => {
	setIsButtonInvisable(true)
    }, 1000)
  }, [])
  return (
    <div>
	<div>Hello World</div>
    	{ !isButtonInvisable && <button>Button</button> }
    </div>
  )
}
