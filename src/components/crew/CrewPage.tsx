import React, { useState, useEffect } from 'react'
import { Crew } from '../../emulator/types'
import crewService from '../../emulator/crewService'
import CrewTable from './CrewTable'
import crewManager from '../../emulator/internals/crewManager'

function CrewPage(props: {}) {
  const [needRefresh, setNeed] = useState(true)
  const [crew, setCrew] = useState<Crew>([])
  useEffect(
    () => {
      const unsub = crewService.onMemberAdded(
        () => {
          setNeed(true)
        }
      )
      if (needRefresh) {
        crewService.getCrew().then(crew => setCrew(crew))
        setNeed(false)
      }
      return unsub;
    }
  )
  return <div className='tableContainer'>
    <CrewTable crew={crew} />
  </div>
}

export default CrewPage
