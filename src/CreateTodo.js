import React, { useState, useEffect } from 'react'
import { Grid, Search, Card, Form } from 'semantic-ui-react'
import Todo from './Todo';

const CreateTodo = ({ userEmail }) => {
  const [success, setSuccess] = useState(0);
  const [notes, setNotes] = useState([]);
  const [dummyNotes, setDummyNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const host = "http://localhost:8000";

  const getNotes = async () => {
    const info = await fetch(`${host}/api/notes/fetchallnotes?email=${userEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjJjODBmMzU2MjMzZjNkMTZhOTgwODJmIn0sImlhdCI6MTY1NzI3ODI2MX0.YsPO_yG3VnMNNYJjUHNjPitETMD5vlGKNnmn_-yqnic"
      }
    });
    const data = await info.json();
    console.log(data);
    setNotes(data);
    setDummyNotes(data);
  }

  const addNotes = async (title, description) => {
    const info = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjJjODBmMzU2MjMzZjNkMTZhOTgwODJmIn0sImlhdCI6MTY1NzI3ODI2MX0.YsPO_yG3VnMNNYJjUHNjPitETMD5vlGKNnmn_-yqnic"
      },
      body: JSON.stringify({ userEmail, title, description })
    });
    const data = await info.json();
    setNotes(notes.concat(data));
    setDummyNotes(notes.concat(data));
  }

  const editNotes = async (id, title, description, active) => {
    const info = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjJjODBmMzU2MjMzZjNkMTZhOTgwODJmIn0sImlhdCI6MTY1NzI3ODI2MX0.YsPO_yG3VnMNNYJjUHNjPitETMD5vlGKNnmn_-yqnic"
      },
      body: JSON.stringify({ title, description, active })
    });
    await info.json();
    // for (let index = 0; index < notes.length; index++) {
    //   const element = notes[index];
    //   if (notes._id === id) {
    //     element.description = description;
    //   }
    // }
    const newNotes = notes.map((element) => {
      if (element._id === id) {
        if (title !== '') {
          element.title = title;
        }
        if (description !== '') {
          element.description = description;
        }
      }
      return element;
    })
    setNotes(newNotes)
    setDummyNotes(newNotes)
    setSuccess(0);
  }

  const deleteNotes = async (id) => {
    const info = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjJjODBmMzU2MjMzZjNkMTZhOTgwODJmIn0sImlhdCI6MTY1NzI3ODI2MX0.YsPO_yG3VnMNNYJjUHNjPitETMD5vlGKNnmn_-yqnic"
      },
    });
    await info.json();
    const newNotes = notes.filter((element) => {
      return (element._id !== id);
    })
    setNotes(newNotes);
    setDummyNotes(newNotes)
  }

  const searchChange = (e) => {
    let filteredNotes = dummyNotes.filter((data) => {
      return data.title.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setNotes(filteredNotes);
  }

  useEffect(() => {
    getNotes(); // eslint-disable-next-line
  }, [])

  const handleDescription = (event) => {
    console.log(event.target.value)
    setDescription(event.target.value);
  }

  const handleTitle = (event) => {
    console.log(event.target.value)
    setTitle(event.target.value);
  }

  const onClick = (event) => {
    event.preventDefault();
    addNotes(title, description);
    setDescription('');
    setTitle('');
  }

  return (
    <div className='createTodo'>
      <h2 className="main-header">Todo List</h2>
      <div className='search'>
        <Grid>
          <Grid.Column width={6}>
            <Search placeholder='Search...' onSearchChange={searchChange} showNoResults={false} />
          </Grid.Column>
        </Grid>
      </div>
      <div style={{ marginBottom: '50px' }}>
        <Form onSubmit={onClick}>
          <Form.Group>
            <Form.Input
              placeholder='Add Title'
              name='title'
              value={title}
              onChange={handleTitle}
            />
            <Form.Input
              placeholder='Add Description'
              name='desciption'
              value={description}
              onChange={handleDescription}
            />
            <Form.Button content='Add Todo' />
          </Form.Group>
        </Form>
      </div>
      <Card.Group itemsPerRow={3}>
        {
          notes.map((element) => {
            return <Todo key={element._id}
              id={element._id}
              title={element.title}
              description={element.description}
              getNotes={getNotes}
              deleteNotes={deleteNotes}
              editNotes={editNotes}
              success={success}
              setSuccess={setSuccess}
              active={element.active}
            />
          })
        }
      </Card.Group>
    </div>
  )
}

export default CreateTodo