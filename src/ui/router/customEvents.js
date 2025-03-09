export class CustomEvents extends Event {
   constructor(type, data) {
      super(type, { bubbles: true, composed: true }); 
      this.detail = data;
   }

   getData() {
      return this.detail; 
   }

   dispatchEvent(data) {
      Object.assign(this, { detail: data }); 
      document.dispatchEvent(this); 
   }
}
