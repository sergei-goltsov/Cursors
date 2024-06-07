figma.showUI(__html__, { width: 300, height: 400 });

figma.on("selectionchange", () => {
  const selection = figma.currentPage.selection;
  if (selection.length > 0) {
    const selectedItem = selection[0];
    figma.ui.postMessage({
      type: 'selectionChanged',
      id: selectedItem.id,
      name: selectedItem.name,
      width: selectedItem.width,
      height: selectedItem.height
    });
  } else {
    figma.ui.postMessage({
      type: 'selectionCleared'
    });
  }
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'addCursorIcon') {
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
      const selectedItem = selection[0];
      try {
        const response = await fetch(msg.iconImageUrl);
        const imageData = await response.arrayBuffer();
        const icon = figma.createImage(new Uint8Array(imageData));
        
        const frame = figma.createFrame();
        frame.name = msg.iconType;
        frame.resize(32, 32);
        frame.x = selectedItem.x;
        frame.y = selectedItem.y;
        frame.fills = [{ type: 'IMAGE', imageHash: icon.hash }];

        selectedItem.parent.appendChild(frame);
      } catch (error) {
        console.error('Error fetching or creating image:', error);
      }
    }
  }
};
