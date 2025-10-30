import { v4 as uuidv4 } from 'uuid';

// =======================================================
// ✅ SECCIÓN COMENTADA: allProducts
// Se asume que estos datos se cargan en otro componente (ej: Demo.jsx) 
// y se añaden al store como 'allProducts' en la inicialización de useGlobalReducer.
// =======================================================
/*
const allProducts = [
        // Bolsos
        {
            id: 101, name: 'Bolso Salmon', reference: 'Salmon', category: 'Bolsos', price: 185000,
            colors: ['rojo', 'cafe', 'plateado', 'salmon', 'negro', 'rosa'],
            images: {
                salmon: 'https://i.pinimg.com/736x/3a/05/43/3a05432a7abca663c6ab96b7c971577c.jpg',
                rojo: 'https://i.pinimg.com/736x/5e/65/4c/5e654cce4e8e2d88ad49994c44becdfb.jpg',
                cafe: 'https://i.pinimg.com/736x/a9/42/d6/a942d6782fa638575f2a7e05695d3224.jpg',
                plateado: 'https://i.pinimg.com/736x/81/37/d4/8137d4c96b0a79121b8f687a90ab4420.jpg',
                negro: 'https://i.pinimg.com/736x/91/1d/29/911d299c92cad7d15f7d57b50594ffe2.jpg',
                rosa: 'https://i.pinimg.com/736x/d6/26/66/d626662375b9603ed5d399d1ca452c0c.jpg',
            },
            mainImage: 'https://i.pinimg.com/736x/5a/55/05/5a55056e30a78e0ff6b98ab94f855052.jpg',
            hoverImage: 'https://i.pinimg.com/736x/1f/19/16/1f19168d8914cc649bdb2058df880791.jpg'
        },
        // ... (Todos los demás productos comentados)
];
*/

// =======================================================
// Estado Inicial: Asume que allProducts se inicializa fuera.
// =======================================================
export const initialStore = (productsFromExcel = []) => { // Recibe la lista para inicializarla
    return {
        allProducts: productsFromExcel, // Inicializa con la lista (vacía o cargada)
        cart: [], 
    };
};

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        
        case "SET_PRODUCTS":
            // Opción para cargar los productos (ej. desde el Excel)
            return {
                ...store,
                allProducts: action.payload,
            };

        case "ADD_TO_CART":
            // 🚨 Importante: Asume que action.payload incluye selectedSize y selectedColor
            const newCartItem = {
                ...action.payload, 
                cartId: uuidv4(),  
            };

            return {
                ...store,
                cart: [...store.cart, newCartItem],
            };
        
        case "REMOVE_FROM_CART":
            return {
                ...store,
                cart: store.cart.filter(item => item.cartId !== action.payload),
            };
        
        case "UPDATE_CART_ITEM_COLOR":
            // Actualiza el color y la imagen del ítem en el carrito
            return {
                ...store,
                cart: store.cart.map(item => {
                    if (item.cartId === action.payload.itemCartId) { 
                        return {
                            ...item,
                            selectedColor: action.payload.newColor,
                            // El reducer aplica la nueva imagen que calculó el componente
                            image: action.payload.newImage
                        };
                    }
                    return item; 
                }),
            };
            
        // ✅ NUEVO CASE: Para cambiar la talla del ítem en el carrito
        case "UPDATE_CART_ITEM_SIZE": {
            // Action.payload: { itemCartId, newSize }
            return {
                ...store,
                cart: store.cart.map(item =>
                    item.cartId === action.payload.itemCartId
                        ? {
                            ...item,
                            selectedSize: action.payload.newSize,
                        }
                        : item
                ),
            };
        }
        
        default:
            return store;
    }
};
