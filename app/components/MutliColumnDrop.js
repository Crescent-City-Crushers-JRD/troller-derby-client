import React, { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

/*
  Multi-column drag & drop board with:
  - Arbitrary item component rendering (ItemComponent)
  - Arbitrary top & bottom buttons per column
  - onMove(item, fromColumnId, toColumnId, toIndex) handler

  Props:
    columns: {
      [columnId]: {
        id: string,
        title: string,
        items: any[]
      }
    }

    ItemComponent: ({ item }) => JSX

    getId: (item) => string | number // unique id for Draggable

    onMove: (item, from, to, index) => void

    topButton: ({ columnId }) => JSX  // custom element/button
    bottomButton: ({ columnId }) => JSX
*/

export default function MultiColumnBoard({
                                             columns: initialCols,
                                             ItemComponent,
                                             getId,
                                             onMove,
                                             topButton: TopButton,
                                             bottomButton: BottomButton,
                                         }) {
    const [columns, setColumns] = useState(() => structuredClone(initialCols));

    const onDragEnd = useCallback(
        (result) => {
            const { source, destination } = result;
            if (!destination) return;

            const fromColumn = source.droppableId;
            const toColumn = destination.droppableId;
            const fromIndex = source.index;
            const toIndex = destination.index;

            // no movement
            if (fromColumn === toColumn && fromIndex === toIndex) return;

            setColumns((prev) => {
                const startCol = prev[fromColumn];
                const finishCol = prev[toColumn];
                const startItems = Array.from(startCol.items);
                const [moved] = startItems.splice(fromIndex, 1);

                const finishItems = Array.from(finishCol.items);
                finishItems.splice(toIndex, 0, moved);

                const newState = {
                    ...prev,
                    [fromColumn]: { ...startCol, items: startItems },
                    [toColumn]: { ...finishCol, items: finishItems },
                };

                // Fire move handler
                if (typeof onMove === "function") {
                    try {
                        onMove(moved, fromColumn, toColumn, toIndex);
                    } catch (e) {
                        console.error("onMove handler failed:", e);
                    }
                }

                return newState;
            });
        },
        [onMove]
    );

    return (
        <div className="p-4">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-3 gap-4">
                    {Object.values(columns).map((col) => (
                        <div key={col.id} className="flex flex-col border rounded-lg p-2 bg-white shadow-sm min-h-[300px]">
                            {/* Column Title */}
                            <h2 className="font-semibold text-lg mb-2 px-1">{col.title}</h2>

                            {/* Top Button */}
                            {TopButton && <div className="mb-2">{<TopButton columnId={col.id} />}</div>}

                            {/* Droppable Column */}
                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 rounded p-2 overflow-auto transition border ${
                                            snapshot.isDraggingOver
                                                ? "bg-blue-50 border-blue-300"
                                                : "bg-gray-50 border-gray-200"
                                        }`}
                                    >
                                        {col.items.map((item, index) => (
                                            <Draggable key={getId(item)} draggableId={String(getId(item))} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-white border rounded shadow-sm p-3 mb-2 transition-transform ${
                                                            snapshot.isDragging ? "scale-[1.02]" : ""
                                                        }`}
                                                    >
                                                        <ItemComponent item={item} columnId={col.id} index={index} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                            {/* Bottom Button */}
                            {BottomButton && <div className="mt-2">{<BottomButton columnId={col.id} />}</div>}
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}

/*
-----------------------------
Example Usage
-----------------------------

const columns = {
  todo: {
    id: "todo",
    title: "To Do",
    items: [ { id: "1", name: "Task A" }, { id: "2", name: "Task B" } ]
  },
  doing: {
    id: "doing",
    title: "Doing",
    items: []
  },
  done: {
    id: "done",
    title: "Done",
    items: []
  }
};

const Item = ({ item }) => <div>{item.name}</div>;

const TopBtn = ({ columnId }) => (
  <button className="text-xs bg-green-200 px-2 py-1 rounded">Add to {columnId}</button>
);

const BottomBtn = ({ columnId }) => (
  <button className="text-xs bg-red-200 px-2 py-1 rounded">Clear {columnId}</button>
);

<MultiColumnBoard
  columns={columns}
  ItemComponent={Item}
  getId={(item) => item.id}
  onMove={(item, from, to, idx) => console.log(item, from, to, idx)}
  topButton={TopBtn}
  bottomButton={BottomBtn}
/>
*/

// --- Added Trash Zone Support ---
// Add a droppable with id "__trash__" inside DragDropContext.
// In onDragEnd, if destination.droppableId === "__trash__", remove the item from its column and do not place it anywhere.

