import React from 'react'
import {QuestionIconProps} from './QuestionIcon'

export default function CircleThree(props: QuestionIconProps) {
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
        <path d="M12 12a2 2 0 1 0 -2 -2" />
        <path d="M10 14a2 2 0 1 0 2 -2" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    </div>
  )
}
