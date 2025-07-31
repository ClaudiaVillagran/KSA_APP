import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { db } from "../../config/firebase";

// Función para obtener los productos de una categoría
export const fetchProducts = async (areaId, categoryId) => {
  const querySnapshot = await getDocs(
    collection(db, "areas", areaId, "categories", categoryId, "products")
  );
  const products = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return products;
};

// Función para obtener las categorías de un área específica
export const fetchCategories = async (areaId) => {
  const querySnapshot = await getDocs(
    collection(db, "areas", areaId, "categories")
  );
  const categories = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const category = {
        id: doc.id,
        ...doc.data(),
        products: [], // Inicializa el array de productos vacío
      };

      // Obtener productos de la categoría
      const products = await fetchProducts(areaId, doc.id);
      category.products = products; // Asignamos los productos a la categoría
      return category;
    })
  );
  return categories;
};

export const fetchArea = async (areaId) => {
  const docRef = doc(db, "areas", areaId);
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists()) {
    const areaData = docSnapshot.data();
    const area = {
      id: docSnapshot.id,
      ...areaData,
      categories: [], // Inicializamos el array de categorías vacío
    };

    // Obtener categorías para este área
    const categories = await fetchCategories(areaId);

    // console.log("area",area);
    
    // console.log("categorie",categories);
    area.categories = categories; // Asignamos las categorías al área
    
    // console.log("area categorie",area);
    return area;
  } else {
    console.log("Área no encontrada");
    return null;
  }
};
