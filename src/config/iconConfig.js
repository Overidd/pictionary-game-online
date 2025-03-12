import {
   createIcons,
   Redo,
   RotateCw,
   Settings,
   User,

   Pencil,
   Eraser,
   Brush,
   PaintBucket,
   Trash2,

   LogOut,
   Volume2,
   VolumeOff,
} from 'lucide';

export const initialIcons = () => {
   createIcons({
      icons: {
         Redo,
         RotateCw,
         Settings,
         User,
         Pencil,
         Eraser,
         Brush,
         PaintBucket,
         Trash2,

         LogOut,
         Volume2,
         VolumeOff,
      }
   });
}