import React, { useState, useEffect } from 'react'
import { Crew, Job, Member, JobSplit } from '../../emulator/types'
import crewService from '../../emulator/crewService'
import CrewTable from './CrewTable'
import settingsService from '../../emulator/settingsService'

function CrewPage(props: {}) {
  const [needRefresh, setNeed] = useState(true)
  const [crew, setCrew] = useState<Crew>([])

  const getJob = (mem : Member, crews: Crew, needJob: JobSplit) =>{

    const needMedic = crews.filter(elem => elem.job === Job.medic).length / needJob.medic
    const needPilot = crews.filter(elem => elem.job === Job.pilot).length / needJob.pilot
    const needEngineer = crews.filter(elem => elem.job === Job.engineer).length / needJob.engineer;

    if(needEngineer > needMedic){
      return needMedic>needPilot? 1:2
    }
    else{
      return needEngineer>needPilot? 1:3
    }

  }

  useEffect(
    () => {
      const unsub = crewService.onMemberAdded(
        (member) => {
          const jobType = getJob(member, crew, settingsService.getJobSplit())
          crewService.assignJob(member.id, jobType==1?Job.pilot:jobType==2?Job.medic:Job.engineer)
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
