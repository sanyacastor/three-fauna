export class data_loader {
  constructor(useTestData = false) {
    this.saveDataString = '';
    this.useTestData = useTestData;
    this.testSaveString = '[{"coll":{"name":"Place"},"id":"399239316304298187","ts":{"isoString":"2024-05-29T22:04:56.890Z"},"name":"Initial test place","xr_objects":[{"id":"399332537155977419","name":"Polyhedron","pos":[0,0.3,0],"rot":[0,0,0,1],"scale":[1,1,1]},{"id":"399332498998296779","name":"Gear01","pos":[0,-0.3,0],"rot":[0,0,0,1],"scale":[1,1,1]}]},{"coll":{"name":"Place"},"id":"399255095038968011","ts":{"isoString":"2024-05-29T21:30:17.830Z"},"name":"Test Place 2","xr_objects":[{"id":"399332498998296779","name":"Gear01","pos":[0,-0.3,0],"rot":[0,0,0,1],"scale":[1,1,1]}]}]';
    this.allPlaces = [];
  }

  async loadSaveData() {
    debugger;
    if (this.useTestData) {
      this.saveDataString = this.testSaveString;
       this.allPlaces = JSON.parse(this.testSaveString);
       return true;
    } else {
      return await this.fetchPlaces();
    }

    return false;
  }

  pickExactPlace(requested_id) {
    if(requested_id==undefined) {
      requested_id = "399239316304298187";
      console.log("Warning: pickExactPlace(id == undef) assigning it to default 399239316304298187")
    }

    for (let i = 0; i < this.allPlaces.length; i++) {
      if (this.allPlaces[i].id === requested_id) {
        return this.allPlaces[i];
      }
    }
  }

  async fetchPlaces() {
    try {
      const response = await fetch('/.netlify/functions/getAllPlaces');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const places = await response.json();
      this.allPlaces = places;
      this.saveDataString = JSON.stringify(places);

      console.log("loaded_data: >>" + JSON.stringify(places) + "<<");
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