class DataSaveLoadTests {
  constructor(dataLoader, dataUpdater) {
    this.dataLoader = dataLoader;
    this.dataUpdater = dataUpdater;

      
    this.tast_upload_savedata = {"name":"Test Place 86",
                                "xr_objects":[
                                                {"id":399198613290352830,
                                                "name":"Gear01",
                                                "pos":[0.33,-0.3,0.42],
                                                "rot":[0.42,0.42,0,1],"scale":[1,1,1]}
                                ]}
  }

  async testSaveLoad() {
    console.log("_________test load file_________");
      this.dataUpdater.updatePlace('399255095038968011', this.tast_upload_savedata);
    console.log("________/test load file_________");

    console.log("_________test read file_________");      
      let res = await this.dataLoader.loadSaveData();
      //let exactPlace = this.dataLoader.pickExactPlace('399255095038968011');
      //this.dataLoader.displayPlaces([exactPlace]);
    console.log("________/test read file_________");
  }
}