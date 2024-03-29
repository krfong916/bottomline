import React from 'react'
import {QuestionIconProps} from './QuestionIcon'

export default function CircleTwo(props: QuestionIconProps) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={props.className}
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke={props.stroke}
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 10a2 2 0 1 1 4 0c0 .591 -.417 1.318 -.816 1.858l-3.184 4.143l4 -.001" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    </div>
  )
}
