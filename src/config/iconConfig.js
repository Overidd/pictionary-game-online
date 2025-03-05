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
   Trash2
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
         Trash2
      }
   });
}