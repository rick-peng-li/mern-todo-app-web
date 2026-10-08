import React from 'react';
import Task from './Task/Task';
import { useContext } from 'react';
import TaskContext from '../context/TaskContext';
function AllTask() {
    const { tasks } = useContext(TaskContext);
    return (
        <div>
            {
                (tasks.length !==0) ? (
                    tasks.map((task, index) => {
                        return (
                            <Task
                                key={task._id || index}
                                task={task}
                            />
                        )
                    })
                ) : (
                    <h1>No Task Found</h1>
                )
            }
        </div>
    );
}

export default AllTask;