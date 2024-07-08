"use client";

import { cardsData } from "@/bin/CardsData";
import { useEffect, useState } from "react";
import { Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import LoadingSkeleton from "./LoadingSkeleton";
import { DndContext } from "@/context/DndContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Cards {
  id: number;
  title: string;
  components: {
    id: number;
    name: string;
    images?: string[];
  }[];
}

const DndExample = () => {
  const [data, setData] = useState<Cards[] | []>([]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const newData = [...JSON.parse(JSON.stringify(data))]; // Shallow copy

    const sourceDroppableId = parseInt(
      source.droppableId.split("droppable")[1]
    );
    const destinationDroppableId = parseInt(
      destination.droppableId.split("droppable")[1]
    );

    const sourceIndex = newData.findIndex((x) => x.id === sourceDroppableId);
    const destinationIndex = newData.findIndex(
      (x) => x.id === destinationDroppableId
    );

    const [movedImage] = newData[sourceIndex].components[
      source.index
    ].images.splice(result.source.index, 1);

    if (!newData[destinationIndex].components[destination.index]) {
      newData[destinationIndex].components.push({
        id: new Date().getTime(), // Unique ID for each new item
        name: "",
        images: [movedImage],
      });
    } else {
      newData[destinationIndex].components[destination.index].images.push(
        movedImage
      );
    }

    if (newData[sourceIndex].components[source.index].images.length === 0) {
      newData[sourceIndex].components.splice(source.index, 1);
    }

    setData(newData);
  };

  useEffect(() => {
    setData(cardsData);
  }, []);

  const handleSave = () => {
    const javascriptLibraries = data.find((card) => card.title === "Preview");
    if (javascriptLibraries) {
      console.log("Javascript Libraries:", javascriptLibraries.components);
    } else {
      console.log("Javascript Libraries not found");
    }
  };

  if (!data.length) {
    return <LoadingSkeleton />;
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <h1 className="text-center mt-8 mb-3 font-bold text-[25px] ">
        Edit Your Store
      </h1>
      <div className="flex gap-4 justify-between my-20 mx-4 flex-col lg:flex-row">
        <Droppable droppableId={`droppable0`}>
          {(provided) => (
            <Accordion
              type="multiple"
              className="w-full border border-gray-400 border-dashed p-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <h2 className="text-center font-bold mb-6 text-black">
                Drag from (Accordion)
              </h2>
              {data[0].components.map((component, index) => (
                <AccordionItem key={component.id} value={component.name}>
                  <AccordionTrigger>{component.name}</AccordionTrigger>
                  <AccordionContent>
                    {component.images?.map((image, imgIndex) => (
                      <Draggable
                        key={`${component.id}-${imgIndex}`}
                        draggableId={`${component.id}-${imgIndex}`}
                        index={imgIndex}
                      >
                        {(provided) => (
                          <div
                            className="bg-gray-200 mx-1 px-4 py-3 my-3"
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                          >
                            <img src={image} alt={component.name} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
              {provided.placeholder}
            </Accordion>
          )}
        </Droppable>

        <Droppable droppableId={`droppable1`}>
          {(provided) => (
            <div
              className="p-5 w-full bg-white border-gray-400 border border-dashed"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <h2 className="text-center font-bold mb-6 text-black">
                {data[1].title}
              </h2>
              {data[1].components.map((component, index) => (
                <Draggable
                  key={component.id}
                  draggableId={component.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="bg-gray-200 mx-1 px-4 py-3 my-3"
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      {component.images?.map((image, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={image}
                          alt={component.name}
                          className="w-full h-auto"
                        />
                      ))}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </DndContext>
  );
};

export default DndExample;
