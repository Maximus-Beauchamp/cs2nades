const saveCanvas = (objects) => {
  const jsonObjects = JSON.stringify(objects);
  const blob = new Blob([jsonObjects], { type: 'application/json' });
  const url = URL.createObjectURL(blob);


  const link = document.createElement('a');
  link.href = url;
  link.download = 'canvas_objects.json';
  document.body.appendChild(link); // Append the link to the body
  link.click();
  document.body.removeChild(link); // Clean up by removing the link from the body
};

const handleFileChange = (e, setObjects, ) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
      reader.onload = (event) => {
      const jsonData = JSON.parse(event.target.result);
     //  'objects' state represents the canvas as shapes !!!(square for now to simplify)!!!
     const canvasObjects = jsonData.canvas;
     //  'strategy' state represents the strategy information
     const strategyInfo = jsonData.strategy;
     // Now you can set your 'objects' and 'strategy' states
     setObjects(canvasObjects);
     // setStrategy(strategyInfo);
   };
  reader.readAsText(file);
  } 
};

export {saveCanvas, handleFileChange};