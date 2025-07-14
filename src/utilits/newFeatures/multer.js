// import multer, { diskStorage } from "multer";
// import path from 'path';
// import fs from 'fs';
// import { nanoid } from "nanoid";
// export const allowedExtensions = {
//     Images: ['image/png', 'image/jpeg'],
//     Videos: ['video/mp4'],
//     Files: ['application/javascript', 'application/pdf'],
// };

// // export function MulterValidation(customMulter = allowedExtensions.Images, customPath = "General") {
// //   const destPath = path.resolve(`uploads/${customPath}`);

// //   if (!fs.existsSync(destPath)) {
// //     fs.mkdirSync(destPath, { recursive: true });
// //   }

// //   const storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //       cb(null, destPath);
// //     },
// //     filename: function (req, file, cb) {
// //       const uniqueFileName = nanoid() + path.extname(file.originalname);
// //       cb(null, uniqueFileName);
// //     },
// //   });

// //   const fileFilter = (req, file, cb) => {
// //     if (customMulter.includes(file.mimetype)) {
// //       cb(null, true);
// //     } else {
// //       cb(new Error("Invalid file type"), false);
// //     }
// //   };

// //   const upload = multer({ storage, fileFilter });

// //   // Return the middleware for a specific field (adjust 'profileImage' as needed)
// //   return upload.single("profileImage");
// // }


// export const upload = (filetype) => {
//     const storage = diskStorage({
//         destination: "upload",
//         filename: (req, file, cb) => {
//             cb(null, nanoid() + "__" + file.originalname)
//         },

//     })
//     const fileFilter = (req, file, cb) => {
//         if (!filetype.includes(file.mimetype)) {
//             return cb(
//                 new Error(
//                     `Invalid file type: ${file.mimetype}. Allowed types: ${JSON.stringify(filetype)}`
//                 ),
//                 false
//             );
//         }
//         cb(null, true);
//     };
//     const multerUpload = multer({ storage, fileFilter })
//     return multerUpload
// }