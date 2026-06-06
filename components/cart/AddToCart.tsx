"use client";

import { FiShoppingCart } from "react-icons/fi";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { AddProductToCart } from "@/lib/actions/product.action";

interface Props {
  productId: string;
}

const AddToCart = ({ productId }: Props) => {


  const handleCartOption = async () => {
    const {  success , message} = await AddProductToCart({ productId });
    if (!success) {
      toast.error("Unable to Add in Cart");
    }else{
        toast.success(message)
    }
  };

  return (
    <Button onClick={handleCartOption} className="h-12 flex-1 rounded-md bg-red-600 text-white hover:bg-red-700">
      <div className="flex items-center gap-2">
        <FiShoppingCart size={20} />
        <span className="font-semibold">Add To Cart</span>
      </div>
    </Button>
  );
};

export default AddToCart;
