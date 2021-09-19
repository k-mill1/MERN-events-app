import React, { useState, useEffect } from 'react'
import Add from './Add'
import Searchbar from './searchBar'
import Dropdown from './dropdownContainer'
import Card from 'react-bootstrap/Card'
import './App.css'
import Table from 'react-bootstrap/Table'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
import sortBy from 'lodash/sortBy'

function Dashboard(props) {
  const [events, cEvents] = useState([])
  const [current, cCurrent] = useState(undefined)
  const [location, cLocation] = useState(undefined)
  const [name, cName] = useState(undefined)
  const [sort, cSort] = useState('unsorted')

  const refreshList = () => {
    props.client.getEvents().then((response) => cEvents(response.data))
  }

  const removeEvent = (id) => {
    props.client.removeEvent(id).then(() => !location && !name ? refreshList() : location ? getByLocation(location) : getByName(name))
  }

  const getByLocation = (loc) => {
    props.client.getByLocation(loc).then((response) => cEvents(response.data))
  }

  const getByName = (nam) => {
    props.client.getByName(nam).then((response) => cEvents(response.data))
  }

  const updateEvent = (ev) => {
    cCurrent(ev);
  }

  useEffect(() => {
    refreshList();
  }, [])

  const singleRow = (current) => {
    return (
      <tr key={current._id}>
        <td>{current.name}</td>
        <td>{current.location}</td>
        <td>{current.information}</td>
        <td>{current.date}</td>
        <td>
          <button className ='button-28' onClick={() => removeEvent(current._id)}><svg xmlns = 'http://www.w3.org/2000/svg' width = '16' height = '16' fill = 'currentColor' class = 'bi bi-trash' viewBox = '0 0 16 16'>
            <path d = 'M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/>
            <path fill-rule = 'evenodd' d = 'M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/>
            </svg>
          </button>{' '}
          <button className ='button-27' onClick={() => updateEvent(current)}><svg xmlns='http://www.w3.org/2000/svg' width = '16' height = '16' fill = 'currentColor' class = 'bi bi-pencil' viewBox = '0 0 16 16'>
            <path d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'/>
            </svg>
          </button>
        </td>
      </tr>
    );
  }

  const buildrows = () => {
    const sortedEvents = sortBy(events, function(obj) {return new Date(obj.date);});
    if (events.length > 0) {
      if (sort === 'unsorted') {
        return events.map((current) => {
          return singleRow(current);
      })} else if (sort === 'ascending') {
          return sortedEvents.map((current) => {
            return singleRow(current);
      })} else {
          return sortedEvents.reverse().map((current) => {
            return singleRow(current);
      })
    }} else {
      return (
        <tr className = 'no-events-to-show'>
          <td colSpan = '5'>{'No events to show'}</td>
        </tr>
      )
    }
  }
  
  return (
    <div>
      <Container fluid = 'xs'>
        <Card>
          <Card.Header className = 'large-header'>Dashboard</Card.Header>
          <Card.Body >
            <Row>
              <Searchbar 
                refreshList={() => {
                  refreshList();
                  cCurrent(undefined);
                }}
                cName = {cName}
                cLocation = {cLocation}
                getByLocation = {(loc) => getByLocation(loc)}
                getByName = {(nam) => getByName(nam)}
              />
            </Row>
            <br />
            <Row>
              <Col md = {7}>
              <Card className = 'event-card'>
                <Card.Header className = 'small-card-header' >Event Listings</Card.Header>
                <Card.Body>
                  <Dropdown 
                    sort = {sort}
                    cSort = {cSort}
                  />
                  <Table responsive className = 'event-table'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Description</th>
                      <th>Date/Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>{buildrows()}</tbody>
                </Table>
                </Card.Body>
              </Card>
              </Col>
              <Col>
              <Add 
                client={props.client}
                refreshList={() => {
                  refreshList();
                  cCurrent(undefined);
                }}
                currentEvent={current}
                cCurrentEvent={cCurrent}
                currentLocation={location}
                currentName={name}
                getByLocation={(loc) => getByLocation(loc)}
                getByName={(nam) => getByName(nam)}
              />
              </Col>
            </Row>
            <button className = 'button-62 log-out-button' onClick={() => props.client.logoutHandler()}> Log out</button>
          </Card.Body>
        </Card>
      </Container> 
    </div>
  )
}

export default Dashboard
