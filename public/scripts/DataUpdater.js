class DataUpdater {
  constructor(useTestDataInsteadDB, apiUrl) {
    this.useTestDataInsteadDB = useTestDataInsteadDB;

    this.apiUrl = apiUrl;
  }

  async updatePlace(id, updateData) {
    if (this.useTestDataInsteadDB) {
      console.log('Update place:', id, updateData);
      return updateData;
    }
    else {
      try {
        console.log('Updating place: id:', id + " data: " + updateData + " apiUrl: " + this.apiUrl);
        const response = await fetch(this.apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, ...updateData }),
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