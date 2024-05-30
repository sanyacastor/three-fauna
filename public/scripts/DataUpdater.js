class DataUpdater {
  constructor(useTestDataInsteadDB, apiUrl) {
    this.useTestDataInsteadDB = useTestDataInsteadDB;

    this.apiUrl = apiUrl;
  }

  async updatePlace(id, updateData) {
    updateData = {"name":"Test Place 86","xr_objects":[{"id":399198613290352830,"name":"Gear02211","pos":[0.42,-0.3,0.42],"rot":[0.42,0.42,0,1],"scale":[1,1,1]}]}

    
    if (this.useTestDataInsteadDB) {
      console.log('Update place:', id, updateData);
      return updateData;
    }
    else {
      try {
        console.log('Updating place: id:', id + " JSON.stringify(data): " + JSON.stringify(updateData) + " apiUrl: " + this.apiUrl);
        const response = await fetch(this.apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id:'399239316304298187', ...updateData }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update place: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Updated place:', result);
        return result;
      } catch (error) {
        console.error('Error updating place:', error);
        return undefined;
      }
    }
  }
}