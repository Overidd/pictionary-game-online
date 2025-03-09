

export class UserEntity {

   constructor({
      id,
      name,
      score = 0,
      avatar,
      isDrawing = false,
      isReady = false,
   }) {
      this.id = id;
      this.name = name;
      this.score = score;
      this.avatar = avatar;
      this.isDrawing = isDrawing
      this.isReady = isReady
   }

   set addScore(score) {
      this.score += score;
   }

   resetScore() {
      this.score = 0;
   }

   setDrawingStatus() {
      this.isDrawing = !this.isDrawing
   }

   toJSON() {
      return {
         name: this.name,
         id: this.id,
         score: this.score,
         avatar: this.avatar,
         isDrawing: this.isDrawing,
      }
   }
}