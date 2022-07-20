import AdresseForm from "../AdresseForm/AdresseForm";
import "./AddAddress.css";

function AddAddress() {
  const handleSubmit = (value) => {
    console.log(value);
  };
  return <AdresseForm onSubmit={handleSubmit} />;
}

export default AddAddress;
