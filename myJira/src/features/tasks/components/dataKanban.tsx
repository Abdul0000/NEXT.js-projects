import React, { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Task, TaskStatus } from "../types";
import KanbanColumnHeader from "./kanbanColumnHeader";
import KanbanCard from "./kanbanCard";

interface DataKanbanProps {
  data: Task[];
  onChange: (tasks: { $id: string; status: TaskStatus; position: number }[]) => void;
}

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TaskState = {
  [key in TaskStatus]: Task[];
};

const DataKanban = ({ data, onChange = () => {} }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => Number(a.position) - Number(b.position)
      );
    });
    return initialTasks;
  });

  useEffect(()=>{
    const NewTasks: TaskState = {
        [TaskStatus.BACKLOG]: [],
        [TaskStatus.TODO]: [],
        [TaskStatus.IN_PROGRESS]: [],
        [TaskStatus.IN_REVIEW]: [],
        [TaskStatus.DONE]: [],
      };
  
      data.forEach((task) => {
        NewTasks[task.status].push(task);
      });
  
      Object.keys(NewTasks).forEach((status) => {
        NewTasks[status as TaskStatus].sort(
          (a, b) => Number(a.position) - Number(b.position)
        );
      });
       setTasks(NewTasks);
  },[data])

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    setTasks((prevTasks) => {
      const newTask = { ...prevTasks };
      const sourceColumn = [...newTask[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      if (!movedTask) {
        console.log("No Task Found at the source index");
        return prevTasks;
      }

      const updatedMovedTask =
        sourceStatus !== destStatus
          ? { ...movedTask, status: destStatus }
          : movedTask;

      // Update source column
      newTask[sourceStatus] = sourceColumn;

      // Update destination column
      const destColumn = [...newTask[destStatus]];
      destColumn.splice(destination.index, 0, updatedMovedTask);
      newTask[destStatus] = destColumn;

      // Initialize updatePayload inside setTasks
      const updatePayload: {
        $id: string;
        status: TaskStatus;
        position: number;
      }[] = [];

      // Minimum upload payload
      updatePayload.push({
        $id: updatedMovedTask.$id,
        status: destStatus,
        position: Math.min((destination.index + 1) * 1000, 100_000_000),
      });

      newTask[destStatus].forEach((task, index) => {
        if (task && task.$id !== updatedMovedTask.$id) {
          const newPosition = Math.min((index + 1) * 1000, 100_000_000);
          if (Number(task.position) !== newPosition) {
            updatePayload.push({
              $id: task.$id,
              status: destStatus,
              position: newPosition,
            });
          }
        }
      });

      if (sourceStatus !== destStatus) {
        newTask[sourceStatus].forEach((task, index) => {
          if (task) {
            const newPosition = Math.min((index + 1) * 1000, 100_000_000);
            if (Number(task.position) !== newPosition) {
              updatePayload.push({
                $id: task.$id,
                status: sourceStatus,
                position: newPosition,
              });
            }
          }
        });
      }

      onChange(updatePayload);

      return newTask;
    });
  }, [onChange]);


  return (
    <DragDropContext onDragEnd={onDragEnd} >
        <div className='flex overflow-x-auto'>
            { boards.map((board) => {
                return (
                    <div key={board} className='flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]'>
                        <KanbanColumnHeader board= {board} taskCount = {tasks && tasks[board].length | 0}/>
                        <Droppable droppableId= {board}>
                            {((provided)=> (
                                <div {...provided.droppableProps} ref={provided.innerRef} className='min-h-[200px] py-1.5'>
                                    {tasks[board].map((task, index)=>(
                                        <Draggable index={index} key={task.$id} draggableId={task.$id}>
                                            {(provided)=>(
                                                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} >
                                                    <KanbanCard task={task}/>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            ))}
                        </Droppable>
                    </div>
                )
            }) }
        </div>
    </DragDropContext>
  )
}

export default DataKanban