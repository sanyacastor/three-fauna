class DataLoader {
  constructor(useTestData = false) {
    this.saveDataString = '';
    this.useTestData = useTestData;
    this.testSaveString = '[{name: "Initial test place",       xr_objects: [         {           id: 399198485711159504,           name: "Polyhedron",           pos: [             0,             0.3,             0           ],           rot: [             0,             0,             0,             1           ],           scale: [             1,             1,             1           ]         },         {           id: 399198613290352843,           name: "Gear01",           pos: [             0,             -0.3,             0           ],           rot: [             0,             0,             0,             1           ],           scale: [             1,             1,             1           ]         }       ]     }]';
  }

  async loadSaveData() {
    if (this.useTestData) {
      this.saveDataString = this.testSaveString;
      return JSON.parse(this.testSaveString);
    } else {
      return await this.fetchPlaces();
    }
  }

  async fetchPlaces() {
    try {
      const response = await fetch('/.netlify/functions/getAllPlaces');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const places = await response.json();
      this.saveDataString = JSON.stringify(places);

      console.log("loaded_data: >>" + places + "<<");
      return places;
    } catch (error) {
      console.error('Failed to fetch places:', error);
    }

    return undefined;
  }

  
  displayPlaces(places) {
    const placesList = document.getElementById('placesList');
    placesList.innerHTML = '';

    places.forEach(place => {
      const listItem = document.createElement('li');
      listItem.textContent = place.name;
      
      const objectsList = document.createElement('ul');

      place.xr_objects.forEach(object => {
        const objectItem = document.createElement('li');
        objectItem.textContent = `ID: ${object.id}, Name: ${object.name}`;
        
        const detailsList = document.createElement('ul');
        
        const posItem = document.createElement('li');
        posItem.textContent = `Position: [${object.pos.join(', ')}]`;
        
        const rotItem = document.createElement('li');
        rotItem.textContent = `Rotation: [${object.rot.join(', ')}]`;

        const scaleItem = document.createElement('li');
        scaleItem.textContent = `Scale: [${object.scale.join(', ')}]`;
        
        detailsList.appendChild(posItem);
        detailsList.appendChild(rotItem);
        detailsList.appendChild(scaleItem);
        
        objectItem.appendChild(detailsList);
        objectsList.appendChild(objectItem);
      });

      listItem.appendChild(objectsList);
      placesList.appendChild(listItem);
    });
  }
}