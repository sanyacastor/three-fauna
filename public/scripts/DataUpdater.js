class DataUpdater {
  constructor(useTestDataInsteadDB, apiUrl) {
    this.useTestDataInsteadDB = useTestDataInsteadDB;

    this.apiUrl = apiUrl;
  }

  async updatePlace(id_string, updateData) {
    if(id_string == undefined) {
      id_string = "399239316304298187";
      console.log("Warning: updatePlace(id == undef) assigning it to default 399239316304298187")
    }
    
    if (this.useTestDataInsteadDB) {
      console.log('Update place:', id_string, updateData);
      return updateData;
    }
    else {
      try {
        console.log('Updating place: id:', id_string + " JSON.stringify(data): " + JSON.stringify(updateData) + " apiUrl: " + this.apiUrl);
        const response = await fetch(this.apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id_string, ...updateData }),
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