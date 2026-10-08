function taskReducer(tasks, action) {
    switch (action.type) {
        case "ADD_TASK": {
            return [...tasks, action.task]
        }
        case "SET_TASK": {
            return action.payload
        }
        case "REMOVE_TASK": {
            return tasks.filter((task) => task._id !== action.id)
        }
        case "MARK_DONE": {
            return tasks.map((task) => {
                if (task._id === action.id) {
                    return { ...task, completed: !task.completed }
                }
                return task
            })
        }
        case "UPDATE_TASK": {
            return tasks.map((task) => {
                if (task._id === action.task._id) {
                    return action.task
                }
                return task
            })
        }
        default: {
            throw Error("Unknown Action" + action.type)
        }
    }
}

export default taskReducer;
