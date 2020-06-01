import moment from 'moment';

export const emptyFilter = {
  oneOf: [],
  requester:null,
  company:null,
  assigned:null,
  workType:null,
  statusDateFrom: null,
  statusDateTo: null,
  closeDateFrom: null,
  closeDateTo: null,
  pendingDateFrom: null,
  pendingDateTo: null,
  deadlineFrom: null,
  deadlineTo: null
}

export const fixedFilters = [
  //all tasks
  {
    title: 'All tasks',
    id: 'all',
    filter:{
      ...emptyFilter,
    }
  },
  // my tasks
  {
    title: 'My tasks',
    id: 'myTasks',
    filter:{
      ...emptyFilter,
      assigned: "cur",
      requester: "cur",
      oneOf: ['assigned', 'requester' ],
    }
  },
  // assignedTasks
  {
    title: 'Assigned tasks',
    id: 'assignedTasks',
    filter:{
      ...emptyFilter,
      assigned: "cur",
    }
  },
  // escalatedTasks
  {
    title: 'Escalated tasks',
    id: 'escalatedTasks',
    filter:{
      ...emptyFilter,
      assigned: "cur",
      requester: "cur",
      oneOf: ['assigned', 'requester' ],
      deadlineTo: moment().unix()*1000
    }
  },
]
