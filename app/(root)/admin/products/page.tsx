"use client";
import ProductForm from '@/components/forms/ProductForm'
import { CreateProduct } from '@/lib/actions/product.action';
import { productCreationSchema } from '@/lib/validation'

const ProductsPage = () => {
  return (
    <>
    <ProductForm
    schema={productCreationSchema}
    defaultValues={{title: "", description: "", price: 0.00, stock: 0}}
    onSubmit={CreateProduct}
    />
    </>
  )
}

export default ProductsPage