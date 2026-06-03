import { Product } from "@prisma/client";

export function searilizeProduct(product: Product){
    return {
        ...product,
        price: Number(product.price)
    }
}