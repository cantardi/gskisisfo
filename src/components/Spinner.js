import React from 'react'
import { Spinner } from 'react-bootstrap';

const Spinner = (props) => {
  return (
    <Spinner animation="border" role="status">
      <span className="sr-only">{ props.message }</span>
    </Spinner>
  )
}