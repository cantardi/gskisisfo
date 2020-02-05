export function handleHttpResponse(response) {
  return response.text().then(text => {
      const data = text && JSON.parse(text);
      
      if (!response.ok) {
        const error = data || data.message || response.statusText;
          return Promise.reject(error);
      }

      return data;
  });
}

export function callGetMasterFieldAPI() {

  const requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/getmasterfield', requestOptions).then(handleHttpResponse)

}

export function callAddFieldAPI(addedField) {

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      newfield: addedField
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/addmasterfield', requestOptions).then(handleHttpResponse)

}

export function callDeleteFieldAPI(deletedField) {

  const requestOptions = {
    method: 'delete',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      deletedfield: deletedField
    })
  }
  
  return fetch(process.env.REACT_APP_BACKEND_URL + '/deletemasterfield', requestOptions).then(handleHttpResponse)
  
}

export function callGetFieldDetailsAPI(fieldId) {
    
  const requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/getfielddetails/' + fieldId, requestOptions).then(handleHttpResponse)

}

export function callAddFieldValueAPI(addedFieldValues) {

  const requestOptions = {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      newvalues: addedFieldValues
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/addfieldvalue', requestOptions).then(handleHttpResponse)

}

export function callDeleteFieldValueAPI(deletedValues) {

  const requestOptions = {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      deletedvalues: deletedValues
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/deletefieldvalue', requestOptions).then(handleHttpResponse)
  
}

export function callUpdateFieldValueAPI(updatedFieldRows) {
  
  const requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      updatedfields: updatedFieldRows
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/updatefieldvalue', requestOptions).then(handleHttpResponse)

}

export function callGetMasterFieldValuesAPI(fieldname) {
   
  const requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  }

  return fetch(`${process.env.REACT_APP_BACKEND_URL}/getfieldvalues/${fieldname}`, requestOptions).then(handleHttpResponse)

}

export function callSearchPeriodAPI(periodname, periodstatus, description) {
  
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      periodname: periodname,
      periodstatus: periodstatus,
      description: description,
      limit: 20
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/searchperiod', requestOptions).then(handleHttpResponse)

}

export function callGetPeriodDateAPI(periodId) {
  
  const requestOptions = {
    method: 'get',
    headers: {'Content-Type': 'application/json'}
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/getperioddate/' + periodId, requestOptions).then(handleHttpResponse)
}

export function callAddPeriodAPI(period, convertedDays) {

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      periodname: period.periodName,
      status: period.status,
      description: period.description,
      selectedDays: convertedDays
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/addperiod', requestOptions).then(handleHttpResponse)
}

export function callUpdatePeriodDtlAPI(period) {
  
  const requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      periodid: period.periodId,
      periodname: period.periodName,
      status: period.status,
      description: period.description
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/updateperioddtl', requestOptions).then(handleHttpResponse)
}

export function callUpdatePeriodWholeAPI(period, convertedDays) {
  
  const requestOptionHdr = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      periodid: period.periodId,
      periodname: period.periodName,
      status: period.status,
      description: period.description
    })
  }

  const requestOptionChild = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      periodid: period.periodId,
      selectedDays: convertedDays
    })
  }

  return Promise.all([
    fetch(process.env.REACT_APP_BACKEND_URL + '/updateperioddtl', requestOptionHdr),
    fetch(process.env.REACT_APP_BACKEND_URL + '/updateperioddate', requestOptionChild)
  ])
  .then (async([dtlresponse, dateresponse]) => {
    const dtlData = await dtlresponse.json()
    const dateData = await dateresponse.json()
    return [dtlData, dateData]
  }) 
}

export function callGetSchedulingPeriodAPI(table) {
    
  const requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/getschedulingperiod/' + table, requestOptions).then(handleHttpResponse)

}

export function callSearchServantAPI(servantname, servantemail, servantmobile) {

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: servantname,
      email: servantemail,
      mobile: servantmobile,
      limit: 20
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/searchservant', requestOptions).then(handleHttpResponse)

}

export function callGetServantAPI() {

  const requestOptions = {
    method: 'get',
    headers: {'Content-Type': 'application/json'}
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/getservant', requestOptions).then(handleHttpResponse)
  
}

export function callGetServantByIdAPI(servantid) {

  const requestOptions = {
    method: 'get',
    headers: {'Content-Type': 'application/json'}
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/getservantbyid/' + servantid, requestOptions).then(handleHttpResponse)
  
}

export function callAddServantAPI(servant) {
   
  const servantObj = {
    servantname: servant.servantname,
    gender: servant.gender,
    birthdate: servant.birthdate,
    email: servant.email,
    mobile1: servant.mobile1,
    mobile2: servant.mobile2,
    schedulingflag: servant.schedulingflag,
  }

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      servant: servantObj
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/addservant', requestOptions).then(handleHttpResponse)
}

export function callUpdateServantAPI(servant, servantid) {

  const requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      servantid: servantid,
      servantname: servant.servantname,
      gender: servant.gender,
      birthdate: servant.birthdate,
      email: servant.email,
      mobile1: servant.mobile1,
      mobile2: servant.mobile2,
      schedulingflag: servant.schedulingflag,
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/updateservant', requestOptions).then(handleHttpResponse)
}

export function callSearchSongAPI(songname, songtype, composer, maxline) {
    
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      songname: songname,
      songtype: songtype,
      composer: composer,
      limit: maxline
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/searchsong', requestOptions).then(handleHttpResponse)
    
}

export function callAddSongAPI(song) {

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      song: song
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/addsong', requestOptions).then(handleHttpResponse)
}

export function callUpdateSongAPI(song, songid) {

  const requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      songid: songid,
      songname: song.songname,
      songlanguage: song.songlanguage,
      songkey: song.songkey,
      songtype: song.songtype,
      composer: song.composer,
      musicby: song.musicby,
      lyricby: song.lyricby,
      url1: song.url1,
      url2: song.url2,
      schedulingflag: song.schedulingflag,
      lyric: song.lyric
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/updatesong', requestOptions).then(handleHttpResponse)
}

export function callGetSchedServantTemplateAPI(periodid) {

  const requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/getperioddateforscheduling/' + periodid, requestOptions).then(handleHttpResponse)

}

export function callAddServantSchedAPI(servantSchedule) 
{

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      servantSchedule: servantSchedule
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/addservantschedule', requestOptions).then(handleHttpResponse)
  
}

export function callAddSongSchedAPI(songSchedule) 
{

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      songSchedule: songSchedule
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/addsongschedule', requestOptions).then(handleHttpResponse)
  
}