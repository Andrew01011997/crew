import React, { useState, useEffect } from 'react'
import { Job } from '../../emulator/types'
import settingsService from '../../emulator/settingsService'

interface InputProps {
  job: Job
  onChange: (value: string) => void
  value: string
}

function Input(props: InputProps) {
  return <div className='settingInput'>
    <label>
      <span className={props.job}>{props.job}</span>
      <input
        name={props.job}
        onChange={event => {
          props.onChange(event.target.value)
        }}
        value={props.value}
      />
      %
    </label>
  </div>
}

function SettingsPage(props: {}) {
  const [isLoading, setIsLoading] = useState(true)
  const [medic, setMedic] = useState('')
  const [engineer, setEngineer] = useState('')
  const [pilot, setPilot] = useState('')

  useEffect(() => {
    const unsub = settingsService.onJobSplit(
      (jobSplit) => {
        setMedic(String(jobSplit.medic))
        setEngineer(String(jobSplit.engineer))
        setPilot(String(jobSplit.pilot))
        setIsLoading(false)
      }
    )
    return unsub
  }, [])

  function handleSubmit() {
    
    if(isCorrect([medic, engineer, pilot]))
      settingsService.setJobSplit({
        medic: parseInt(medic),
        engineer: parseInt(engineer),
        pilot: parseInt(pilot),
      })
      else console.log("no correct")
  }

  function isCorrect(params: any){
    let summ = 0
    for(let i = 0; i<params.length; i++){
      if(isNaN(params[i]))
        return false
      if(parseInt(params[i]) < parseFloat(params[i]))
        return false
      summ+=parseInt(params[i])
    }
    if(summ>100)
      return false

    return true;
  }

  if (isLoading) {
    return null
  }

  return <>
    <Input job={Job.medic} onChange={setMedic} value={medic} />
    <Input job={Job.engineer} onChange={setEngineer} value={engineer} />
    <Input job={Job.pilot} onChange={setPilot} value={pilot} />

    <button onClick={handleSubmit}>
      Apply
    </button>
  </>
}

export default SettingsPage
