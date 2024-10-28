import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImage = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const showToast = useShowToast();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file type", "please select an image file", "error");
      setImageUrl(null);
    }
  };
//   console.log(imageUrl);

  return { handleImageChange, imageUrl,setImageUrl };
};

export default usePreviewImage;
