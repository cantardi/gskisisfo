export function handleHttpResponse(response) {
  return response.text().then(text => {
      const data = text && JSON.parse(text);
      
      if (!response.ok) {
        const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
      }

      return data;
  });
}

export function callSearchPeriodAPI(periodname, periodstatus, description) {
  
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      periodname: periodname,
      periodstatus: periodstatus,
      description: description,
    })
  }

  return fetch(process.env.REACT_APP_BACKEND_URL + '/searchPeriod', requestOptions).then(handleHttpResponse)

}

export function callGetMasterFieldValuesAPI(fieldname) {
   
  const requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  }

  return fetch(`${process.env.REACT_APP_BACKEND_URL}/getfieldvalues/${fieldname}`, requestOptions).then(handleHttpResponse)

}

export function callAddServantAPI(servant) {
   
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      servantname: servant.servantname,
      gender: servant.gender,
      birthdate: servant.birthdate, //new Date(this.state.birthdate).toLocaleDateString(),
      email: servant.email,
      mobile1: servant.mobile1,
      mobile2: servant.mobile2,
      schedulingflag: servant.schedulingflag,
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
