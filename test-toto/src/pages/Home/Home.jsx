import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import ListeCourriers from "../../components/ListeCourriers/ListeCourriers";
import { getData, postData } from "../../modules/fetchData";
import "./Home.css";
import Recherche from "../../components/Recherche/Recherche";
import { baseUrl } from "../../modules/data";

function Home(props) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [courriers, updateCourriers] = useState([]);
  useEffect(() => {
    getData(`${baseUrl}/courriers`, auth.token).then((response) =>
      response.json().then((response) => {
        if (!response.code !== 401) {
          updateCourriers(response.response);
        } else {
          navigate("/logout");
        }
      })
    );
  }, [auth.token, navigate]);

  const handleRechercheNom = async (value) => {
    const response = await postData(`${baseUrl}/nom`, [value], auth.token);
    updateCourriers(response.result);
    console.log("value", response.result);
    console.log("courriers", courriers);
  };

  return (
    <main className="home-main">
      <Recherche onRechercheNom={handleRechercheNom} />
      <ListeCourriers courriers={courriers} />
    </main>
  );
}

export default Home;
