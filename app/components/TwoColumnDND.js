'use client';
import {useEffect, useState} from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from "axios";


export default function TwoColumnDragDrop() {
    const [columns, setColumns] = useState({
        review: [],
        purchased: [],
        upNext: [],
    });
    const [completed, setCompleted] = useState({completed: []});
    const host = (process.env.NEXT_PUBLIC_API_MODE === "dev" ? process.env.NEXT_PUBLIC_API_HOST_DEV : process.env.NEXT_PUBLIC_API_HOST_PROD);







    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        // Same column
        if (source.droppableId === destination.droppableId) {
            const column = Array.from(columns[source.droppableId]);
            const [moved] = column.splice(source.index, 1);
            column.splice(destination.index, 0, moved);
            setColumns({ ...columns, [source.droppableId]: column });
        } else {
            // Move between columns
            const sourceCol = Array.from(columns[source.droppableId]);
            const destCol = Array.from(columns[destination.droppableId]);
            const [moved] = sourceCol.splice(source.index, 1);
            destCol.splice(destination.index, 0, moved);
            setColumns({
                ...columns,
                [source.droppableId]: sourceCol,
                [destination.droppableId]: destCol,
            });
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(columns).map(([columnId, items]) => (
                    <Droppable key={columnId} droppableId={columnId}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`p-4 rounded-2xl min-h-[200px] bg-gray-100 transition-colors ${
                                    snapshot.isDraggingOver ? 'bg-blue-100' : ''
                                }`}
                            >
                                <h2 className="text-lg font-semibold mb-3 capitalize">{columnId === "upNext" ? "Up Next" : columnId}</h2>
                                {items.map((item, index) => (
                                    <Draggable key={item} draggableId={item} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`p-4 mb-3 rounded-xl shadow-sm bg-white border border-gray-200 hover:shadow-md transition ${
                                                    snapshot.isDragging ? 'bg-blue-50 scale-105' : ''
                                                }`}
                                            >
                                                {item}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
}
