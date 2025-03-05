

export class UserEntity {

   constructor({
      id,
      name,
      score = 0,
      avatar,
      isDrawing = false
   }) {
      this.id = id || Date.now().toString();
      this.name = name;
      this.score = score;
      this.avatar = avatar;
      this.isDrawing = isDrawing
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
         score: this.score,
         avatar: this.avatar,
         isDrawing: this.isDrawing,
      }
   }
}