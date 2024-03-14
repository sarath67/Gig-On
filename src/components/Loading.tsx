import React from 'react'
import { waveform } from 'ldrs'


export default function Loading() {
    waveform.register()
  return (
    <div>
      <l-waveform
    size="88"
    stroke="6"
    speed="1" 
    color="black" 
    ></l-waveform>
    </div>
  )
}
