import React from 'react';
import './App.css';
import axios from 'axios';
import { Header, Icon, List } from 'semantic-ui-react'

class App extends React.Component {

  state = {
    values : []
  }

  componentDidMount() {
    //fetch data from .netcore api
    axios.get('http://localhost:5000/api/values')
    .then(response => {
      this.setState({
        values : response.data
      })
    })
    .catch(err => {
      console.log(err);
    })

  }

  render () {

    return (
      <div>
         <Header as='h2'>
            <Icon name='hand point down' />
            <Header.Content>Reactivities</Header.Content>
         </Header>
          <List>
            {this.state.values.map((value : any) => {
              return <List.Item key={value.id}>{value.name}</List.Item>
            })}
          </List>
      </div>
    );

    }
}

export default App;
