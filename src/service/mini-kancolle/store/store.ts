import path from 'path';

class Store {
  protected dbDir: string = path.join(global.APP_PATH, 'db');

  protected dbName = '';

  constructor(dbName: string) {
    this.dbName = dbName;
  }

  protected get dbPath() {
    return path.join(this.dbDir, this.dbName);
  }
}

export default Store;
