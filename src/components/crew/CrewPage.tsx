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
    const freePeoples = 100 - needJob.medic - needJob.pilot - needJob.engineer;
    const needRest = crews.filter(elem => elem.job === Job.unassigned).length / freePeoples;

    if(needMedic < needPilot){
      if(needEngineer < needRest)
        return needEngineer>needMedic?2:3
      else
        return  needRest>needMedic?2:4
    }
    else{
      if(needEngineer < needRest)
        return needEngineer>needPilot?1:3
      else
        return  needRest>needPilot?1:4
    }

  }

  useEffect(
    () => {
      const unsub = crewService.onMemberAdded(
        (member) => {
          const jobType = getJob(member, crew, settingsService.getJobSplit())
          if(jobType!=4)
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


