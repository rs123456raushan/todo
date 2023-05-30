import { useState, useEffect } from 'react'
import React from 'react'
import { Button, Card, Image, Input, Checkbox } from 'semantic-ui-react'

const Todo = (props) => {
    const [flag, setFlag] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [checkbox, setCheckbox] = useState(false);

    const onUpdate = () => {
        if (flag) {
            setFlag(0);
            props.setSuccess(0);
        } else {
            setFlag(1);
            props.setSuccess(1);
        }
    }

    const onChange = (event) => {
        setDescription(event.target.value)
    }

    const onChangeTitle = (event) => {
        setTitle(event.target.value)
    }

    const handleCheckbox = () => {
        setCheckbox(!checkbox);
        props.editNotes(props.id, '', '', checkbox);
    }

    useEffect(() => {
        props.getNotes(); // eslint-disable-next-line
    }, [])

    return (
        <div style={{ marginLeft: '30px', marginBottom: '30px', marginRight: '20px' }}>
            {/* <Card.Group> */}
            <Card>
                <Card.Content>
                    <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                    />
                    <Card.Header>{props.title}</Card.Header>
                    <Card.Meta>{props.title}</Card.Meta>
                    <div style={{ marginBottom: '2px', marginTop: '5px' }}>
                        <Checkbox defaultChecked={props.active} onChange={handleCheckbox} />
                    </div>
                    <Card.Description>
                        {props.description}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                        <Button basic color='green' onClick={onUpdate}>
                            Update
                        </Button>
                        <Button basic color='red' onClick={() => props.deleteNotes(props.id)}>
                            Delete
                        </Button>
                    </div>
                </Card.Content>
                {
                    (flag && props.success) && <Card.Content extra>
                        <div style={{ marginBottom: '5px' }}>
                            <Input size='small' type='text' placeholder='Update Title' action onChange={onChangeTitle}>
                                <input />
                                <div style={{ marginLeft: '-3px' }}>
                                    <Button size='medium' active type='submit' onClick={() => props.editNotes(props.id, title, '', checkbox)}>Update</Button>
                                </div>
                            </Input>
                        </div>
                        <div>
                            <Input size='small' type='text' placeholder='Update Description' action onChange={onChange}>
                                <input />
                                <div style={{ marginLeft: '-3px' }}>
                                    <Button size='medium' active type='submit' onClick={() => props.editNotes(props.id, '', description, checkbox)}>Update</Button>
                                </div>
                            </Input>
                        </div>
                    </Card.Content>
                }
            </Card>
            {/* </Card.Group> */}
        </div>
    )
}

export default Todo