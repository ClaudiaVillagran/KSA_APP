//   const product = {
//     id: "2390",
//     title: "Instalaciones, red de gas, mantenciones, fugas",
//     price: 25990,
//     commission: 2599,
//     location: ["Machali", "Rancagua"],
//     author: "instalred.contacto@gmail.com",
//     image: "https://ksa.cl/wp-content/uploads/2025/05/ventanas-de-madera.webp",
//   };
//   const addProductToCategory = async (categoryId, product) => {
//     try {
//       const productRef = doc(
//         collection(
//           db,
//           "areas",
//           "EfUbAYF0Hcp1SplhR0ds",
//           "categories",
//           categoryId,
//           "products"
//         ),
//         product.id
//       );

//       await setDoc(productRef, product);
//       console.log("Producto añadido con éxito.");
//     } catch (e) {
//       console.error("Error al agregar producto: ", e);
//     }
//   };

//   // Llamamos a la función para agregar el producto
//   const createProductForCategory = async () => {
//     const categoryId = ; // ID de la categoría a la que pertenece el producto
//     await addProductToCategory(categoryId, product);
//   };

//   // Llamamos a la función para agregar el producto
//   createProductForCategory();