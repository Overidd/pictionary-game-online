// type EventCallback = (data: any) => void;

class EventEmitter {
   events = new Map();

   /**
    * @param {String} event 
    * @param {EventCallback} callback 
    */
   on(event, callback) {
      if (!this.events.has(event)) {
         this.events.set(event, []);
      }
      this.events.get(event)?.push(callback);
   }

   /**
    * @param {String} event 
    * @param {any} data 
    */
   emit(event, data) {
      this.events.get(event)?.forEach(callback => callback(data));
   }

   /**
    * @param {String} event 
    * @param {EventEmitter} callback 
    */
   off(event, callback) {
      if (this.events.has(event)) {
         this.events.set(
            event,
            this.events.get(event)?.filter(cb => cb !== callback) || []
         );
      }
   }
}

export const eventEmitter = new EventEmitter();
